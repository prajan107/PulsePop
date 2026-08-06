import re
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.trend_analysis import TrendAnalysis
from app.models.trend_cluster import TrendCluster
from app.repositories.trend_cluster_repository import TrendClusterRepository


def compute_cosine_similarity(vec_a: list[float] | None, vec_b: list[float] | None) -> float:
    """Calculate cosine similarity between two vector embeddings."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = sum(a * a for a in vec_a) ** 0.5
    norm_b = sum(b * b for b in vec_b) ** 0.5
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return max(0.0, min(1.0, dot / (norm_a * norm_b)))


def compute_jaccard_similarity(set_a: set[str], set_b: set[str]) -> float:
    """Calculate Jaccard similarity index between two string sets."""
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return intersection / union if union > 0 else 0.0


def slugify(text: str) -> str:
    """Convert text into a URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def generate_deterministic_cluster_key(
    title: str, entity_names: list[str], topics: list[str]
) -> str:
    """Generate a readable deterministic key for a cluster based on entities, topics, or title."""
    parts = []
    if entity_names:
        parts.extend(entity_names[:2])
    if topics:
        parts.extend(topics[:2])

    if not parts and title:
        parts = title.split()[:3]

    raw_key = "-".join(parts) if parts else "unclassified-cluster"
    slug = slugify(raw_key)
    return slug if slug else "unclassified-cluster"


class TrendCorrelationService:
    """Service for correlating related AI-analyzed trends into unified TrendClusters."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = TrendClusterRepository(session)

    async def correlate_analysis(self, analysis: TrendAnalysis) -> TrendCluster:
        """Correlate a single TrendAnalysis record against candidate clusters using multi-signal similarity."""
        if analysis.cluster_id:
            existing_cluster = await self.repo.get_by_id(analysis.cluster_id)
            if existing_cluster:
                return existing_cluster

        # Extract features from analysis
        topics = (
            [
                (t.upper() if isinstance(t, str) else str(t).upper())
                for t in analysis.topics
            ]
            if analysis.topics
            else []
        )
        entity_names = (
            [
                e.get("name", "")
                for e in analysis.entities
                if isinstance(e, dict) and e.get("name")
            ]
            if analysis.entities
            else []
        )
        embedding = analysis.embedding or []
        source = analysis.raw_trend.source if analysis.raw_trend else ""

        # Retrieve candidate clusters via candidate filtering
        candidates = await self.repo.find_candidate_clusters(topics, entity_names)

        best_cluster: TrendCluster | None = None
        best_score: float = 0.0

        for candidate in candidates:
            if not candidate.analyses:
                continue

            # Compute pairwise similarities against candidate member analyses
            emb_sims = []
            topic_sims = []
            entity_sims = []
            source_sims = []

            for member in candidate.analyses:
                # 1. Embedding similarity (40%)
                emb_sim = compute_cosine_similarity(embedding, member.embedding)
                emb_sims.append(emb_sim)

                # 2. Entity overlap (30%)
                member_entities = {
                    e.get("name", "").lower()
                    for e in (member.entities or [])
                    if isinstance(e, dict) and e.get("name")
                }
                entity_sim = compute_jaccard_similarity(
                    {e.lower() for e in entity_names}, member_entities
                )
                entity_sims.append(entity_sim)

                # 3. Topic overlap (20%)
                member_topics = {
                    (t.upper() if isinstance(t, str) else str(t).upper())
                    for t in (member.topics or [])
                }
                topic_sim = compute_jaccard_similarity(
                    set(topics), member_topics
                )
                topic_sims.append(topic_sim)

                # 4. Source similarity (10%)
                member_source = (
                    member.raw_trend.source if member.raw_trend else ""
                )
                source_sims.append(1.0 if source == member_source else 0.0)

            avg_emb = max(emb_sims) if emb_sims else 0.0
            avg_entity = max(entity_sims) if entity_sims else 0.0
            avg_topic = max(topic_sims) if topic_sims else 0.0
            avg_source = max(source_sims) if source_sims else 0.0

            # Formula: 40% Embedding + 30% Entity + 20% Topic + 10% Source
            score = (
                0.40 * avg_emb
                + 0.30 * avg_entity
                + 0.20 * avg_topic
                + 0.10 * avg_source
            )

            if score > best_score:
                best_score = score
                best_cluster = candidate

        # Assign to best matching cluster if correlation score meets threshold
        threshold = settings.TREND_CORRELATION_THRESHOLD
        if best_cluster and best_score >= threshold:
            # Update canonical title/summary if current analysis has higher confidence or better title
            current_title = (
                analysis.raw_trend.title
                if analysis.raw_trend
                else best_cluster.canonical_title
            )
            if len(current_title) > len(best_cluster.canonical_title):
                best_cluster.canonical_title = current_title
            if analysis.summary and (
                not best_cluster.canonical_summary
                or len(analysis.summary) > len(best_cluster.canonical_summary)
            ):
                best_cluster.canonical_summary = analysis.summary

            return await self.repo.assign_analysis(best_cluster, analysis)

        # Create new TrendCluster if no match exceeds threshold
        canonical_title = (
            analysis.raw_trend.title if analysis.raw_trend else "Untitled Trend"
        )
        canonical_summary = analysis.summary
        base_key = generate_deterministic_cluster_key(
            canonical_title, entity_names, topics
        )

        # Guarantee unique cluster key
        cluster_key = base_key
        suffix_counter = 1
        while await self.repo.get_by_cluster_key(cluster_key):
            cluster_key = f"{base_key}-{suffix_counter}"
            suffix_counter += 1

        new_cluster = TrendCluster(
            canonical_title=canonical_title,
            canonical_summary=canonical_summary,
            cluster_key=cluster_key,
            trend_count=1,
        )
        created_cluster = await self.repo.create(new_cluster)
        analysis.cluster_id = created_cluster.id
        await self.session.commit()
        await self.session.refresh(created_cluster)

        return created_cluster

    async def correlate_batch(
        self, analyses: list[TrendAnalysis]
    ) -> list[TrendCluster]:
        """Correlate a batch of TrendAnalysis records and return the distinct affected TrendClusters."""
        clusters_map: dict[int, TrendCluster] = {}
        for analysis in analyses:
            if analysis.status != "COMPLETED":
                continue
            cluster = await self.correlate_analysis(analysis)
            clusters_map[cluster.id] = cluster
        return list(clusters_map.values())


__all__ = ["TrendCorrelationService"]

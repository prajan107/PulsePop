from app.collectors.models import RawTrendData
from app.ingestion.models import NormalizedTrendData

KEYWORD_CATEGORY_MAP: dict[str, list[str]] = {
    "Technology": [
        "technology",
        "tech",
        "ai",
        "ml",
        "software",
        "coding",
        "programming",
        "hardware",
        "python",
        "robotics",
        "computer",
    ],
    "Entertainment": [
        "movies",
        "movie",
        "film",
        "music",
        "entertainment",
        "tv",
        "television",
        "gaming",
        "games",
        "cinema",
        "celebrity",
    ],
    "Finance": [
        "finance",
        "crypto",
        "stocks",
        "money",
        "bitcoin",
        "trading",
        "economy",
        "market",
        "investing",
        "wallstreet",
    ],
    "Sports": [
        "sports",
        "sport",
        "football",
        "basketball",
        "soccer",
        "baseball",
        "tennis",
        "nba",
        "nfl",
        "olympics",
    ],
    "News": [
        "news",
        "worldnews",
        "politics",
        "global",
        "world",
        "breaking",
    ],
}


class TrendNormalizer:
    """Normalizes RawTrendData into clean NormalizedTrendData."""

    @staticmethod
    def infer_category(raw: RawTrendData) -> str:
        """Infer category using deterministic keyword matching on metadata and text."""
        metadata_vals = " ".join(
            str(v).lower()
            for v in raw.metadata.values()
            if isinstance(v, (str, int))
        )
        search_text = (
            f"{raw.title.lower()} {metadata_vals} {(raw.content or '').lower()}"
        )

        for category, keywords in KEYWORD_CATEGORY_MAP.items():
            for kw in keywords:
                if kw in search_text:
                    return category

        return "General"

    @classmethod
    def normalize(cls, raw: RawTrendData) -> NormalizedTrendData:
        """Clean and normalize raw trend fields into NormalizedTrendData."""
        title = raw.title.strip() if raw.title else ""
        summary = (
            raw.content.strip()
            if raw.content and raw.content.strip()
            else None
        )
        author = (
            raw.author.strip()
            if raw.author and raw.author.strip()
            else None
        )
        url = raw.url.strip() if raw.url else ""
        source_name = (
            raw.source.strip().lower() if raw.source else "unknown"
        )
        language = raw.language.strip().lower() if raw.language else "en"

        category_name = cls.infer_category(raw)

        return NormalizedTrendData(
            title=title,
            summary=summary,
            author=author,
            url=url,
            published_at=raw.published_at,
            source_name=source_name,
            category_name=category_name,
            language=language,
            sentiment_score=None,
            trend_score=None,
            popularity_score=None,
            metadata=raw.metadata,
        )


__all__ = ["TrendNormalizer"]

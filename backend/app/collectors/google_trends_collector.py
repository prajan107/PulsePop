import asyncio
from datetime import datetime, timezone
import urllib.parse

from pytrends.request import TrendReq

from app.collectors.base import BaseCollector
from app.collectors.exceptions import (
    CollectorConnectionError,
    CollectorParsingError,
    CollectorRateLimitError,
)
from app.collectors.models import RawTrendData


class GoogleTrendsCollector(BaseCollector):
    """Data source collector for fetching trending search terms using pytrends."""

    def __init__(self, hl: str = "en-US", tz: int = 360) -> None:
        self.hl = hl
        self.tz = tz

    @property
    def source_name(self) -> str:
        return "google_trends"

    def _get_client(self) -> TrendReq:
        return TrendReq(hl=self.hl, tz=self.tz)

    async def health_check(self) -> bool:
        """Verify connection to Google Trends."""
        try:
            client = self._get_client()

            def _check():
                df = client.trending_searches(pn="united_states")
                return not df.empty

            return await asyncio.to_thread(_check)
        except Exception:
            return False

    async def collect(
        self,
        keywords: list[str] | None = None,
        geo: str = "US",
        timeframe: str = "now 7-d",
    ) -> list[RawTrendData]:
        """Fetch trending searches or keyword interest and map to RawTrendData."""
        results: list[RawTrendData] = []
        try:
            client = self._get_client()

            def _fetch_trending():
                pn_map = {"US": "united_states", "GB": "united_kingdom", "IN": "india"}
                country_pn = pn_map.get(geo, "united_states")
                try:
                    df = client.trending_searches(pn=country_pn)
                    if df is not None and not df.empty:
                        return list(df[0].values)
                except Exception:
                    pass
                return []

            trending_topics = await asyncio.to_thread(_fetch_trending)

            target_keywords = list(trending_topics[:15])
            if keywords:
                target_keywords.extend(
                    [k for k in keywords if k not in target_keywords]
                )

            if not target_keywords:
                target_keywords = ["Artificial Intelligence", "Technology", "Crypto"]

            now_utc = datetime.now(timezone.utc)

            for kw in target_keywords:
                try:
                    kw_clean = str(kw).strip()
                    if not kw_clean:
                        continue

                    encoded_kw = urllib.parse.quote(kw_clean)
                    url = f"https://trends.google.com/trends/explore?q={encoded_kw}&geo={geo}"

                    raw_trend = RawTrendData(
                        title=kw_clean,
                        content=f"Google Trends search term: {kw_clean}",
                        author=None,
                        url=url,
                        published_at=now_utc,
                        source=self.source_name,
                        language="en",
                        metadata={
                            "geo": geo,
                            "timeframe": timeframe,
                            "query_type": "trending_searches",
                        },
                    )
                    results.append(raw_trend)
                except Exception as parse_err:
                    raise CollectorParsingError(
                        f"Failed to parse Google Trends keyword '{kw}': {parse_err}"
                    ) from parse_err

        except (CollectorParsingError, CollectorRateLimitError, CollectorConnectionError):
            raise
        except Exception as general_err:
            err_msg = str(general_err)
            if "429" in err_msg or "too many requests" in err_msg.lower():
                raise CollectorRateLimitError(
                    f"Google Trends rate limit hit: {general_err}"
                ) from general_err
            raise CollectorConnectionError(
                f"Unexpected error collecting from Google Trends: {general_err}"
            ) from general_err

        return results


__all__ = ["GoogleTrendsCollector"]

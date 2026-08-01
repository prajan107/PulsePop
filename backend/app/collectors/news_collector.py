import asyncio
from datetime import datetime, timezone
from newsapi import NewsApiClient
import requests

from app.collectors.base import BaseCollector
from app.collectors.exceptions import (
    CollectorConnectionError,
    CollectorParsingError,
    CollectorRateLimitError,
)
from app.collectors.models import RawTrendData
from app.core.config import settings


class NewsCollector(BaseCollector):
    """Data source collector for fetching top news headlines and articles using NewsAPI."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = settings.NEWS_API_KEY if api_key is None else api_key

    @property
    def source_name(self) -> str:
        return "news"

    def _get_client(self) -> NewsApiClient:
        return NewsApiClient(api_key=self.api_key)

    async def health_check(self) -> bool:
        """Verify connection and valid API key with NewsAPI."""
        if not self.api_key or self.api_key == "mock_news_api_key":
            return False
        try:
            client = self._get_client()
            res = await asyncio.to_thread(
                client.get_top_headlines, language="en", page_size=1
            )
            return res.get("status") == "ok"
        except Exception:
            return False

    async def collect(
        self,
        query: str = "technology",
        language: str = "en",
        page_size: int = 20,
    ) -> list[RawTrendData]:
        """Fetch top headlines or news articles matching query and map to RawTrendData."""
        if not self.api_key or self.api_key == "mock_news_api_key":
            return []

        results: list[RawTrendData] = []
        try:
            client = self._get_client()
            response = await asyncio.to_thread(
                client.get_top_headlines,
                q=query,
                language=language,
                page_size=page_size,
            )

            if response.get("status") != "ok":
                code = response.get("code", "")
                msg = response.get("message", "NewsAPI request failed")
                if code == "rateLimited":
                    raise CollectorRateLimitError(f"NewsAPI rate limit hit: {msg}")
                raise CollectorConnectionError(f"NewsAPI error ({code}): {msg}")

            articles = response.get("articles", [])
            for article in articles:
                try:
                    title = article.get("title")
                    url = article.get("url")
                    if not title or not url:
                        continue

                    raw_pub_at = article.get("publishedAt")
                    if raw_pub_at:
                        pub_dt = datetime.fromisoformat(
                            raw_pub_at.replace("Z", "+00:00")
                        )
                    else:
                        pub_dt = datetime.now(timezone.utc)

                    content_text = (
                        article.get("description") or article.get("content")
                    )

                    raw_trend = RawTrendData(
                        title=title,
                        content=content_text,
                        author=article.get("author"),
                        url=url,
                        published_at=pub_dt,
                        source=self.source_name,
                        language=language,
                        metadata={
                            "publisher": article.get("source", {}).get("name"),
                            "urlToImage": article.get("urlToImage"),
                            "content_length": len(article.get("content") or ""),
                        },
                    )
                    results.append(raw_trend)
                except Exception as parse_err:
                    raise CollectorParsingError(
                        f"Failed to parse NewsAPI article: {parse_err}"
                    ) from parse_err

        except (CollectorParsingError, CollectorRateLimitError, CollectorConnectionError):
            raise
        except requests.exceptions.RequestException as req_err:
            raise CollectorConnectionError(
                f"Network request error connecting to NewsAPI: {req_err}"
            ) from req_err
        except Exception as general_err:
            raise CollectorConnectionError(
                f"Unexpected error collecting from NewsAPI: {general_err}"
            ) from general_err

        return results


__all__ = ["NewsCollector"]

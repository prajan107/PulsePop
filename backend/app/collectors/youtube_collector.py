import asyncio
from datetime import datetime, timezone

from googleapiclient.discovery import Resource, build
from googleapiclient.errors import HttpError

from app.collectors.base import BaseCollector
from app.collectors.exceptions import (
    CollectorConnectionError,
    CollectorParsingError,
    CollectorRateLimitError,
)
from app.collectors.models import RawTrendData
from app.core.config import settings


class YouTubeCollector(BaseCollector):
    """Data source collector for fetching video trend data using YouTube Data API v3."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = settings.YOUTUBE_API_KEY if api_key is None else api_key

    @property
    def source_name(self) -> str:
        return "youtube"

    def _get_client(self) -> Resource:
        return build("youtube", "v3", developerKey=self.api_key)

    async def health_check(self) -> bool:
        """Verify connection and API key validity with YouTube Data API."""
        if not self.api_key or self.api_key == "mock_youtube_api_key":
            return False
        try:
            client = self._get_client()

            def _check():
                request = client.search().list(
                    part="snippet", q="test", maxResults=1, type="video"
                )
                return request.execute()

            res = await asyncio.to_thread(_check)
            return "items" in res
        except Exception:
            return False

    async def collect(
        self,
        query: str = "technology trends",
        max_results: int = 25,
    ) -> list[RawTrendData]:
        """Search YouTube videos and map results to RawTrendData."""
        if not self.api_key or self.api_key == "mock_youtube_api_key":
            return []

        results: list[RawTrendData] = []
        try:
            client = self._get_client()

            def _search():
                request = client.search().list(
                    part="snippet",
                    q=query,
                    type="video",
                    maxResults=max_results,
                    order="relevance",
                )
                return request.execute()

            response = await asyncio.to_thread(_search)
            items = response.get("items", [])

            for item in items:
                try:
                    snippet = item.get("snippet", {})
                    id_info = item.get("id", {})

                    video_id = id_info.get("videoId")
                    if not video_id:
                        continue

                    title = snippet.get("title", "")
                    description = snippet.get("description", "")
                    channel_title = snippet.get("channelTitle", "")
                    published_at_raw = snippet.get("publishedAt")

                    if published_at_raw:
                        pub_dt = datetime.fromisoformat(
                            published_at_raw.replace("Z", "+00:00")
                        )
                    else:
                        pub_dt = datetime.now(timezone.utc)

                    url = f"https://www.youtube.com/watch?v={video_id}"
                    language = (
                        snippet.get("defaultLanguage")
                        or snippet.get("defaultAudioLanguage")
                        or "en"
                    )

                    raw_trend = RawTrendData(
                        title=title,
                        content=description or None,
                        author=channel_title or None,
                        url=url,
                        published_at=pub_dt,
                        source=self.source_name,
                        language=language,
                        metadata={
                            "video_id": video_id,
                            "channel_id": snippet.get("channelId"),
                            "channel_title": channel_title,
                            "thumbnail": snippet.get("thumbnails", {})
                            .get("high", {})
                            .get("url"),
                            "live_broadcast": snippet.get("liveBroadcastContent"),
                        },
                    )
                    results.append(raw_trend)
                except Exception as parse_err:
                    raise CollectorParsingError(
                        f"Failed to parse YouTube video item: {parse_err}"
                    ) from parse_err

        except (CollectorParsingError, CollectorRateLimitError, CollectorConnectionError):
            raise
        except HttpError as http_err:
            if http_err.resp.status in (403, 429):
                raise CollectorRateLimitError(
                    f"YouTube API quota or rate limit exceeded: {http_err}"
                ) from http_err
            raise CollectorConnectionError(
                f"YouTube API HttpError: {http_err}"
            ) from http_err
        except Exception as general_err:
            raise CollectorConnectionError(
                f"Unexpected error collecting from YouTube API: {general_err}"
            ) from general_err

        return results


__all__ = ["YouTubeCollector"]

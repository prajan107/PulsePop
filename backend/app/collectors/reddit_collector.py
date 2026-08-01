from datetime import datetime, timezone
import asyncpraw
import asyncprawcore

from app.collectors.base import BaseCollector
from app.collectors.exceptions import (
    CollectorConnectionError,
    CollectorParsingError,
    CollectorRateLimitError,
)
from app.collectors.models import RawTrendData
from app.core.config import settings


class RedditCollector(BaseCollector):
    """Data source collector for fetching trending Reddit posts using AsyncPRAW."""

    def __init__(
        self,
        client_id: str | None = None,
        client_secret: str | None = None,
        user_agent: str | None = None,
    ) -> None:
        self.client_id = (
            settings.REDDIT_CLIENT_ID if client_id is None else client_id
        )
        self.client_secret = (
            settings.REDDIT_CLIENT_SECRET
            if client_secret is None
            else client_secret
        )
        self.user_agent = (
            settings.REDDIT_USER_AGENT if user_agent is None else user_agent
        )

    @property
    def source_name(self) -> str:
        return "reddit"

    def _get_reddit_client(self) -> asyncpraw.Reddit:
        return asyncpraw.Reddit(
            client_id=self.client_id,
            client_secret=self.client_secret,
            user_agent=self.user_agent,
        )

    async def health_check(self) -> bool:
        """Verify connection and read access to Reddit API."""
        if not self.client_id or not self.client_secret:
            return False
        try:
            async with self._get_reddit_client() as reddit:
                subreddit = await reddit.subreddit("test")
                _ = subreddit.display_name
                return True
        except Exception:
            return False

    async def collect(
        self,
        subreddits: list[str] | None = None,
        limit: int = 25,
    ) -> list[RawTrendData]:
        """Fetch hot posts from specified subreddits and map to RawTrendData models."""
        target_subreddits = subreddits or ["technology", "news", "worldnews"]
        results: list[RawTrendData] = []

        try:
            async with self._get_reddit_client() as reddit:
                for sub_name in target_subreddits:
                    try:
                        subreddit = await reddit.subreddit(sub_name)
                        async for submission in subreddit.hot(limit=limit):
                            try:
                                author_name = (
                                    submission.author.name
                                    if submission.author
                                    else None
                                )
                                published_dt = datetime.fromtimestamp(
                                    submission.created_utc, tz=timezone.utc
                                )

                                raw_trend = RawTrendData(
                                    title=submission.title,
                                    content=submission.selftext or None,
                                    author=author_name,
                                    url=submission.url,
                                    published_at=published_dt,
                                    source=self.source_name,
                                    language="en",
                                    metadata={
                                        "subreddit": str(
                                            submission.subreddit.display_name
                                        ),
                                        "score": submission.score,
                                        "num_comments": submission.num_comments,
                                        "upvote_ratio": getattr(
                                            submission, "upvote_ratio", 0.0
                                        ),
                                        "is_nsfw": getattr(
                                            submission, "over_18", False
                                        ),
                                        "post_id": submission.id,
                                    },
                                )
                                results.append(raw_trend)
                            except Exception as parse_err:
                                raise CollectorParsingError(
                                    f"Failed to parse Reddit submission {getattr(submission, 'id', 'unknown')}: {parse_err}"
                                ) from parse_err
                    except (
                        asyncprawcore.exceptions.TooManyRequests,
                        asyncprawcore.exceptions.RequestException,
                        asyncprawcore.exceptions.ResponseException,
                        asyncprawcore.exceptions.OAuthException,
                        asyncprawcore.exceptions.AsyncPrawcoreException,
                    ) as e:
                        if isinstance(
                            e, asyncprawcore.exceptions.TooManyRequests
                        ):
                            raise CollectorRateLimitError(
                                f"Reddit API rate limit exceeded on r/{sub_name}: {e}"
                            ) from e
                        raise CollectorConnectionError(
                            f"Reddit API error on r/{sub_name}: {e}"
                        ) from e

        except (CollectorParsingError, CollectorRateLimitError, CollectorConnectionError):
            raise
        except Exception as general_err:
            raise CollectorConnectionError(
                f"Unexpected error collecting from Reddit API: {general_err}"
            ) from general_err

        return results


__all__ = ["RedditCollector"]

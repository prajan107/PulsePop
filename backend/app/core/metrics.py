import platform
import sys
import threading
from datetime import datetime, timezone
from typing import Any

from app.core.config import settings


class ApplicationMetrics:
    """Thread-safe in-memory metric collector for PulsePop backend operational observability."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.start_time: datetime = datetime.now(timezone.utc)
        self.raw_trends_processed: int = 0
        self.ai_analyses_completed: int = 0
        self.failed_analyses: int = 0
        self.correlation_count: int = 0
        self.cluster_count: int = 0
        self.total_processing_time_ms: float = 0.0
        self.collector_requests: int = 0
        self.collector_failures: int = 0

    def record_raw_trends(self, count: int = 1) -> None:
        """Increment processed raw trends count."""
        with self._lock:
            self.raw_trends_processed += count

    def record_analysis(self, processing_time_ms: float = 0.0, success: bool = True) -> None:
        """Record completed or failed AI analysis execution."""
        with self._lock:
            if success:
                self.ai_analyses_completed += 1
                self.total_processing_time_ms += processing_time_ms
            else:
                self.failed_analyses += 1

    def record_failure(self) -> None:
        """Record a failed analysis execution."""
        with self._lock:
            self.failed_analyses += 1

    def record_cluster(self, count: int = 1) -> None:
        """Increment correlation and cluster counts."""
        with self._lock:
            self.correlation_count += count
            self.cluster_count += count

    def record_collector(self, success: bool = True) -> None:
        """Record collector execution status."""
        with self._lock:
            self.collector_requests += 1
            if not success:
                self.collector_failures += 1

    def get_summary(self) -> dict[str, Any]:
        """Return structured runtime metrics dictionary."""
        with self._lock:
            uptime = round((datetime.now(timezone.utc) - self.start_time).total_seconds(), 2)
            avg_proc_time = (
                round(self.total_processing_time_ms / self.ai_analyses_completed, 2)
                if self.ai_analyses_completed > 0
                else 0.0
            )

            return {
                "application": {
                    "app_name": settings.APP_NAME,
                    "version": settings.APP_VERSION,
                    "pipeline_version": "1.0",
                    "python_version": sys.version.split()[0],
                    "platform": platform.platform(),
                    "uptime_seconds": uptime,
                    "start_time": self.start_time.isoformat(),
                },
                "collectors": {
                    "requests": self.collector_requests,
                    "failures": self.collector_failures,
                },
                "ai": {
                    "raw_trends_processed": self.raw_trends_processed,
                    "completed_analyses": self.ai_analyses_completed,
                    "failed_analyses": self.failed_analyses,
                    "average_processing_time_ms": avg_proc_time,
                },
                "clusters": {
                    "correlations": self.correlation_count,
                    "clusters": self.cluster_count,
                },
            }


metrics = ApplicationMetrics()

__all__ = ["ApplicationMetrics", "metrics"]

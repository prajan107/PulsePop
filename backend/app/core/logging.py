import logging
import sys
from pathlib import Path

from loguru import logger

from app.core.config import settings


LOG_DIR = Path("logs")
LOG_FILE = LOG_DIR / "pulsepop.log"
LOG_FORMAT = (
    "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
    "<level>{message}</level>"
)


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level: str | int = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame = logging.currentframe()
        depth = 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def setup_logging() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    log_level = "DEBUG" if settings.DEBUG else "INFO"

    logger.remove()
    logger.add(
        sys.stdout,
        level=log_level,
        format=LOG_FORMAT,
        enqueue=True,
        backtrace=settings.DEBUG,
        diagnose=settings.DEBUG,
    )
    logger.add(
        LOG_FILE,
        level=log_level,
        format=LOG_FORMAT,
        rotation="10 MB",
        retention="7 days",
        compression="zip",
        enqueue=True,
        backtrace=settings.DEBUG,
        diagnose=False,
    )

    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        standard_logger = logging.getLogger(logger_name)
        standard_logger.handlers = [InterceptHandler()]
        standard_logger.propagate = False


__all__ = ["setup_logging"]

import time

from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


EXCLUDED_LOG_PATHS = {"/docs", "/redoc", "/openapi.json", "/favicon.ico"}


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = time.perf_counter()

        response = await call_next(request)

        if request.url.path in EXCLUDED_LOG_PATHS:
            return response

        response_time_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "{method} {path} completed with {status_code} in {response_time:.2f}ms",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            response_time=response_time_ms,
        )

        return response


__all__ = ["LoggingMiddleware"]

from typing import Any

from fastapi import HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from loguru import logger


class AppException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Any | None = None,
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: Any | None = None) -> None:
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            details=details,
        )


class DatabaseException(AppException):
    def __init__(self, message: str = "Database error", details: Any | None = None) -> None:
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details,
        )


def build_error_response(
    status_code: int,
    message: str,
    error: str,
    details: Any | None = None,
) -> JSONResponse:
    content: dict[str, Any] = {
        "success": False,
        "error": error,
        "message": message,
    }

    if details is not None:
        content["details"] = details

    return JSONResponse(status_code=status_code, content=content)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning(
        "Application exception at {path}: {message}",
        path=request.url.path,
        message=exc.message,
    )
    return build_error_response(
        status_code=exc.status_code,
        message=exc.message,
        error=exc.__class__.__name__,
        details=exc.details,
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    logger.warning(
        "HTTP exception at {path}: {status_code}",
        path=request.url.path,
        status_code=exc.status_code,
    )
    return build_error_response(
        status_code=exc.status_code,
        message=str(exc.detail),
        error="HTTPException",
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    logger.warning("Validation error at {path}", path=request.url.path)
    return build_error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message="Request validation failed",
        error="RequestValidationError",
        details=exc.errors(),
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception at {path}", path=request.url.path)
    return build_error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message="Internal server error",
        error="InternalServerError",
    )


__all__ = [
    "AppException",
    "NotFoundException",
    "DatabaseException",
    "app_exception_handler",
    "http_exception_handler",
    "validation_exception_handler",
    "generic_exception_handler",
]

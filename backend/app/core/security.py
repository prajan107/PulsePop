from datetime import datetime, timedelta, timezone
from jose import jwt
from pwdlib import PasswordHash

from app.core.config import settings

_password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a plain text password securely using pwdlib."""
    return _password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a stored hashed password using pwdlib."""
    return _password_hash.verify(password, hashed_password)


def create_access_token(
    data: dict, expires_delta: timedelta | None = None
) -> str:
    """Create a signed JWT access token containing claims."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt

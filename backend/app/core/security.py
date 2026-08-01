from pwdlib import PasswordHash

_password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a plain text password securely using pwdlib."""
    return _password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a stored hashed password using pwdlib."""
    return _password_hash.verify(password, hashed_password)

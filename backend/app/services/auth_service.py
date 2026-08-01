from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.user_repo = UserRepository(session)

    async def register_user(self, request: RegisterRequest) -> User:
        """Validate duplicate username/email, hash password, and create user."""
        existing_username = await self.user_repo.get_by_username(request.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken",
            )

        existing_email = await self.user_repo.get_by_email(request.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        hashed_pwd = hash_password(request.password)
        return await self.user_repo.create_user(
            username=request.username,
            email=request.email,
            hashed_password=hashed_pwd,
        )

    async def authenticate_user(self, request: LoginRequest) -> dict[str, str]:
        """Authenticate user by email and password and return JWT access token."""
        user = await self.user_repo.get_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        return {"access_token": access_token, "token_type": "bearer"}

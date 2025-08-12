from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.core.security import get_current_user

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            token = credentials.credentials
            payload = get_current_user(token)
            if payload is None:
                raise HTTPException(status_code=403, detail="Invalid token")
            return payload
        raise HTTPException(status_code=403, detail="Token missing")

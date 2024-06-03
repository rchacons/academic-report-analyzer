from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .auth_handler import decode_jwt
from dotenv import load_dotenv
import os

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

load_dotenv()


class JWTBearer(HTTPBearer):
    """
    A custom authentication class that extends FastAPI's HTTPBearer.

    Attributes:
        auto_error (bool): If True, automatically returns a 403 response for failed authentication.
    """

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        """
        Authenticate the request and return the user's credentials if authentication is enabled and successful.

        """
        logger.info("Authenticating request")

        if os.getenv("ENABLE_AUTH") == 'False':
            logger.info("Authentication bypassed")
            return "dummy_token"
        
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        """
        Verify a JWT token.

        Args:
            jwtoken (str): The JWT token to verify.

        Returns:
            bool: True if the token is valid, False otherwise.
        """
        try:
            payload = decode_jwt(jwtoken)
        except:
            logger.exception("An error occurred while decoding the token")
            return False  
        
        return bool(payload)
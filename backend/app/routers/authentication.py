from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from ..schemas.token_schema import Token
from ..auth.auth_handler import authenticate_user, create_access_token
import logging
from ..core.config import settings

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(
        tags=["Authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=settings.API_V1_STR+"/token")

@router.post("/token",
             summary="Token Generation",
             description="This endpoint validates the user credentials and returns a JWT token.",
             response_model=Token,
             responses={
                 200: {"description": "Access token successfully generated and returned."},
                 401: {"description": "Invalid username or password. Authentication failed."},
                 500: {"description": "An error occurred during the authentication process."}})
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    
    logger.info("Attempting to authenticate user")

    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        logger.warning("Authentication failed for user: %s", form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    logger.info("User authenticated successfully: %s", form_data.username)
    
    token = Token(access_token=create_access_token(user), token_type="bearer")
    logger.info("Access token created for user: %s", form_data.username)
    
    return token

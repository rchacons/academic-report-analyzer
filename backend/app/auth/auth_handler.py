import jwt
from decouple import config
from ..schemas.token_schema import Token
from datetime import datetime, timedelta, timezone
import logging
from dateutil.parser import parse


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


JWT_SECRET = config("SECRET_KEY")
JWT_ALGORITHM = config("ALGORITHM")
JWT_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES")


def create_access_token(user_id: str) -> Token:
    """
    Create a JWT access token for the given user ID.

    Args:
        user_id (str): The user ID to encode in the access token.

    Returns:
        Token: The JWT access token.
    """
    logger.info("Creating access token for user: %s", user_id)

    access_token_expires = timedelta(minutes=int(JWT_EXPIRE_MINUTES))
    to_encode = {
        "user_id": user_id,
        "expires": (datetime.now() + access_token_expires).isoformat()
    }

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    logger.info("Access token created successfully for user: %s", user_id)

    return encoded_jwt


def authenticate_user(username: str, password: str):
    """
    Authenticate a user based on their username and password.

    Args:
        username (str): The username to authenticate.
        password (str): The password to authenticate.

    Returns:
        str: The username if authentication was successful, or None otherwise.
    """
    logger.info("Attempting to authenticate user: %s", username)

    # Import user information from environment file
    user_username = config("API_USERNAME")
    user_password = config("API_PASSWORD")

    if username == user_username and password == user_password:
        logger.info("User authenticated successfully: %s", username)
        return username
    else:
        logger.warning("Authentication failed for user: %s", username)
        return None



def decode_jwt(token: str) -> dict:
    """
    Decode a JWT access token.

    Args:
        token (str): The JWT access token to decode.

    Returns:
        dict: The decoded token if the token is valid and has not expired, or an empty dictionary otherwise.
    """
    logger.info("Attempting to decode JWT token")
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if parse(decoded_token["expires"]) >= datetime.now() else None
    except:
        logging.exception("An error occurred while decoding the token")
        return {}
from pydantic import BaseModel

class Token(BaseModel):
    """
    A model that represents a JWT token.

    Attributes:
        access_token (str): The JWT access token.
        token_type (str): The type of the token, typically "bearer".
    """
    access_token: str
    token_type: str
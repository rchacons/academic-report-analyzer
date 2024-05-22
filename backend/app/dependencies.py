from typing import Annotated

from fastapi import Header, HTTPException

# TODO definir l'authetnification apres

"""
async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "x-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")
    # See for better security practices : https://fastapi.tiangolo.com/tutorial/security/


async def get_query_token(token: str):
    if token != "token":
        raise HTTPException(status_code=400, detail="No Jessica token provided")
    
"""
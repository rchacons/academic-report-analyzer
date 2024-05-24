from fastapi import Depends, FastAPI
from .routers import comparison, authentication
from .core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from .auth.auth_bearer import JWTBearer
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version=settings.API_VERSION,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173/",
            "http://127.0.0.1:5173/"
            # str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(comparison.router,prefix=settings.API_V1_STR)
app.include_router(authentication.router,prefix=settings.API_V1_STR)

@app.get("/", summary="Root endpoint", description="This is the root endpoint of the API.")
async def root():
    return {"message": "Index"}
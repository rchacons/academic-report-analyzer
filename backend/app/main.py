from fastapi import Depends, FastAPI
from .routers import comparison, authentication, rdf, export
from .core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from .auth.auth_bearer import JWTBearer
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.API_V1_STR,
    version=settings.API_VERSION,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(comparison.router)
app.include_router(authentication.router)
app.include_router(rdf.router)
app.include_router(export.router)

@app.get("/", summary="Root endpoint", description="This is the root endpoint of the API.")
async def root():
    return {"message": "Index"}
from fastapi import FastAPI, UploadFile, File

#from .dependencies import get_query_token, get_token_header
#from .internal import admin
from .routers import comparison, rdf

#app = FastAPI(dependencies=[Depends(get_query_token)])
app = FastAPI(title="SI-REL2 API", version="0.1.0")

api_prefix = "/api/v1"
app.include_router(comparison.router,prefix=api_prefix)
app.include_router(rdf.router)


@app.get("/", summary="Root endpoint", description="This is the root endpoint of the API.")
async def root():
    return {"message": "Index"}
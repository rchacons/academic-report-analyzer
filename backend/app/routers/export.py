from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from ..schemas.comparison_schema import Subject
from ..services.export_service import ExportService
from ..auth.auth_bearer import JWTBearer
from typing import List
import os
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(
    tags=["Export"],
    dependencies=[Depends(JWTBearer())]
)

@router.post("/export-to-excel/",
             summary="Export a list of subjects to an Excel file",
             description="This endpoint accepts accepts a list of subjects, and uses it to create an Excel file from the list, and then return the Excel file as a response.",
             responses={
                 200: {"description": "Export completed successfully"},
                 400: {"description": "Invalid input - not a list of subjects"},
                 500: {"description": "An error occurred during export"}
             })
async def export_to_excel(subjects: List[Subject]):
    file_name = "liste_sujets.xlsx"
    ExportService.create_excel(subjects, file_name)
    if not os.path.exists(file_name):
        raise HTTPException(status_code=500, detail="Failed to create Excel file")
    return FileResponse(file_name, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=file_name)
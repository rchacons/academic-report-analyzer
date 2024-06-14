from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from ..schemas.comparison_schema import Subject, Book
from ..services.export_service import ExportService
from ..auth.auth_bearer import JWTBearer
from typing import List, Union
import os
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(
    tags=["Export"],
    dependencies=[Depends(JWTBearer())]
)

@router.post("/export-to-excel/",
             summary="Export a list of subjects or books to an Excel file",
             description="This endpoint accepts accepts a list of subjects, and uses it to create an Excel file from the list, and then return the Excel file as a response.",
             responses={
                 200: {"description": "Export completed successfully"},
                 400: {"description": "Invalid input - not a list of subjects"},
                 500: {"description": "An error occurred during export"}
             })
async def export_to_excel(items: Union[List[Subject], List[Book]]):
    file_name = ""
    export_service = ExportService()

    if items and isinstance(items[0], Subject):
        file_name = "liste_sujets.xlsx"
        export_service.create_excel_subjects(items, file_name)
    elif items and isinstance(items[0], Book):
        file_name = "liste_livres.xlsx"
        export_service.create_excel_books(items, file_name)
    else:
        raise HTTPException(status_code=400, detail="Invalid input - not a list of subjects or books")
   
    if not os.path.exists(file_name):
        raise HTTPException(status_code=500, detail="Failed to create Excel file")
    return FileResponse(file_name, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=file_name)
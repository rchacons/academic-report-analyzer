from typing import Optional, Annotated
from ..services.list_book_compare_service import ListBookCompareService
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ..services.file_service import save_file_temporarily
from ..services.comparison_service import ComparisonService
from ..schemas.comparison_schema import ComparaisonListBookResult, ComparisonSubjectsResult
from ..auth.auth_bearer import JWTBearer
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(
    tags=["Comparisons"],
    dependencies=[Depends(JWTBearer())]
)

@router.post("/compare-reports/",
             summary="Compare two PDF CAPES reports",
             description="This endpoint accepts two PDF or XLSX CAPES reports (mandatory) and XLSX list of themes (optional), compares them, and returns the comparison result.",
             response_model=ComparisonSubjectsResult,
             responses={
                 200: {"description": "Comparison completed successfully"},
                 400: {"description": "Invalid input - Reports must be in PDF or XLSX, list of theme in XLSX only"},
                 500: {"description": "An error occurred during comparison"}
             })
async def compare_reports(file1: UploadFile = File(..., description="The old PDF CAPES report to compare"), 
                          file2: UploadFile = File(..., description="The new PDF CAPES report to compare"),
                          file3: Annotated[UploadFile, File(description="The list of themes")] = None):

    logger.info("Received request to compare reports")

    # Verify formats
    if (file1.content_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']):
       raise HTTPException(status_code=400, detail="File 1 must be in PDF or XLSX.")
    
    if (file2.content_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']):
       raise HTTPException(status_code=400, detail="File 2 must be in PDF or XLSX.")
    
    if (file3 != None and file3.content_type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
        raise HTTPException(status_code=400, detail="The list of themes must be in XLSX.")

    # Save the PDF files temporarily    
    file1_path : str = save_file_temporarily(file1)
    file2_path : str = save_file_temporarily(file2)
    file3_path: Optional[str] = save_file_temporarily(file3) if file3 else None

    try: 
        # Compare the contents
        comparison_service = ComparisonService()
        return comparison_service.compare(file1_path, file2_path, file3_path)
        
    except Exception as e:
        logger.exception("An error occurred during comparison")
        raise HTTPException(status_code=500, detail=str(e))






@router.post("/compare-book-list/",
             summary="Compare two PDF CAPES list of book",
             description="This endpoint accepts two PDF CAPES list of book, compares them, and returns the comparison result.",
             response_model=ComparaisonListBookResult,
             responses={
                 200: {"description": "Comparison completed successfully"},
                 400: {"description": "Invalid input - not a PDF file"},
                 500: {"description": "An error occurred during comparison"}
             })
def compare_book_list(file1: UploadFile = File(..., description="The old PDF CAPES list of book to compare"), 
                          file2: UploadFile = File(..., description="The new PDF CAPES list of book to compare")):
    

    logger.info("Received request to compare list of book")


    # Verify that both files are PDFs
    if file1.content_type != 'application/pdf' or file2.content_type != 'application/pdf':
        logger.error("Invalid file format")
        raise HTTPException(status_code=400, detail="Both files must be in PDF format.")

    # Save the PDF files temporarily    
    file1_path = save_file_temporarily(file1)
    file2_path = save_file_temporarily(file2)

    try: 
        # Compare the contents
        comparison_list_book_service = ListBookCompareService()
        
        return comparison_list_book_service.compareTwoListBook(file1_path, file2_path)
        
    except Exception as e:

        logger.exception("An error occurred during comparison")
        raise HTTPException(status_code=500, detail=str(e))
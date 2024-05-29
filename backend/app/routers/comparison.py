from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ..services.file_service import save_pdf_temporarily
from ..services.comparison_service import ComparisonService
from ..schemas.comparison_schema import ComparisonSubjectsResult
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
             description="This endpoint accepts two PDF CAPES reports, compares them, and returns the comparison result.",
             response_model=ComparisonSubjectsResult,
             responses={
                 200: {"description": "Comparison completed successfully"},
                 400: {"description": "Invalid input - not a PDF file"},
                 500: {"description": "An error occurred during comparison"}
             })
async def compare_reports(file1: UploadFile = File(..., description="The old PDF CAPES report to compare"), 
                          file2: UploadFile = File(..., description="The new PDF CAPES report to compare")):

    logger.info("Received request to compare reports")

    # Verify that both files are PDFs
    if file1.content_type != 'application/pdf' or file2.content_type != 'application/pdf':
        logger.error("Invalid file format")
        raise HTTPException(status_code=400, detail="Both files must be in PDF format.")

    # Save the PDF files temporarily    
    file1_path = save_pdf_temporarily(file1)
    file2_path = save_pdf_temporarily(file2)

    try: 
        # Compare the contents
        comparison_service = ComparisonService()
        
        return comparison_service.compare(file1_path, file2_path)
        
    except Exception as e:
        logger.exception("An error occurred during comparison")
        raise HTTPException(status_code=500, detail=str(e))
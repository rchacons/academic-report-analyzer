from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from typing import List, Dict
import logging
from pydantic import BaseModel
import tempfile
from ..services.file_service import save_pdf_temporarily
from ..auth.auth_bearer import JWTBearer
from ..schemas.book_from_subject_schema import LinkedBook, SubjectSchema
from ..services.book_from_subject_service import link_books_to_subject
from ..services.book_list_extractor_service import BookListExtractorService

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(
    tags=["Book Linking"],
    dependencies=[Depends(JWTBearer())]
)


@router.post("/link-books/",
             summary="Link books from a pdf to a subject.",
             description="This endpoint accepts a PDF CAPES list of book and a subject as a Text  and returns the list of book linked to the subject.",
             response_model=List[LinkedBook],
             responses={
                 200: {"description": "Link completed successfully"},
                 400: {"description": "Invalid input - not a PDF file"},
                 500: {"description": "An error occurred during extracting list of book"}
             })
async def link_books(file1: UploadFile = File(..., description="The PDF CAPES list of book to extract"), subject: SubjectSchema = Depends()):
    logger.info("Attempting to get the file")
    file1_path = save_pdf_temporarily(file1)
    logger.info("File OK")

    try:
        logger.info("objet classe BookListExtractorService")
         # Compare the contents
        book_list_extractor_service = BookListExtractorService(file1_path)
        logger.info("Objet classe BookListExtractorService OK - Extraction des livres")
        
        linked_books = link_books_to_subject(book_list_extractor_service.extract_books_from_pdf(), subject.subject)

    except Exception as e:
        logger.error("Error while linking books: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing."
        )

    return linked_books
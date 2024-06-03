import os
import tempfile
import secrets
from fastapi import UploadFile
import logging


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def save_pdf_temporarily(file: UploadFile) -> str:
    """
    Save a PDF file temporarily and returns the path.

    Args:
    file (UploadFile): The file to save

    Returns:
    str: The path to the saved file
    """
    
    logger.info("Saving PDF file temporarily")

    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()
    
    # Generate a secure random filename
    filename = secrets.token_hex(15) + ".pdf"
    temp_file_path = os.path.join(temp_dir, filename)

    # Write the file to the temporary directory
    with open(temp_file_path, 'wb') as temp_file:
        temp_file.write(file.file.read())

    # Return the path to the saved file
    return temp_file_path
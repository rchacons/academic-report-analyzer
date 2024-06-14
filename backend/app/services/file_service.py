import os
import tempfile
import secrets
from fastapi import UploadFile
import logging


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def save_file_temporarily(file: UploadFile) -> str:
    """
    Save a PDF file temporarily and returns the path.

    Args:
    file (UploadFile): The file to save

    Returns:
    str: The path to the saved file
    """
    
    logger.info("Saving file temporarily")

    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()
    
    # Generate a secure random filename
    filename = ""
    if (file.content_type == 'application/pdf'):
        filename = secrets.token_hex(15) + ".pdf"
    elif (file.content_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
        filename = secrets.token_hex(15) + ".xlsx"
    else:
        raise Exception("The file must be in PDF or XLSX")
    
    temp_file_path = os.path.join(temp_dir, filename)
    
    with open(temp_file_path, 'wb') as temp_file: # Write the file to the temporary directory
        temp_file.write(file.file.read())

    # Return the path to the saved file
    return temp_file_path
    
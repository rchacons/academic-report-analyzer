import logging
from ..schemas.comparison_schema import Book
import pdfplumber
import re
from typing import List, Dict, Tuple


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class BookListExtractorService:

    
    def __init__(self, file_path):
        self.file_path = file_path
    
   
    def extract_books_from_pdf(self) -> List[Book]:
        books = []
        pattern = re.compile(r'^(.*?) \((\d{4})\) : (.*)') 

        with pdfplumber.open(self.file_path) as pdf:
            for page in pdf.pages:
                data_page = page.extract_table()
                first_column = [row[0] for row in data_page if row]
                
                for row in first_column:
                    if row != None:
                        match = pattern.findall(row)
                        if match:
                            author, year_published, book_name = match[0]
                            extracted_book =  Book(author=author, year_published=year_published, book_name=book_name)
                            books.append(extracted_book)
        return books

    def get_books(self) -> List[Dict[str, str]]:
        return self.books

import logging
from ..schemas.comparison_schema import Book
import pdfplumber
import re
from typing import List


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class BookListExtractorService:

    
    def __init__(self, file_path):
        self.file_path = file_path
    
   
    def extract_books_from_pdf(self) -> List[Book]:
        books = []

        with pdfplumber.open(self.file_path) as pdf:
            for page in pdf.pages:
                data_page = page.extract_table()
                first_column = [row[0] for row in data_page if row]
                
                for row in first_column:
                    if row is not None:
                        if '\n' in row:
                            # If the row contains a newline character, use extract_book_multiple_line
                            book = self.extract_book_multiple_line(row)
                        else:
                            # If the row does not contain a newline character, use extract_book_single_line
                            book = self.extract_book_single_line(row)
                        
                        if book is not None:
                            books.append(book)
        return books



    def extract_book_multiple_line(self,book_string):
        book_pattern = re.compile(r"(\w+) \((\d{4})\) : (.+?)(?=\w+ \(\d{4}\) : |$)", re.DOTALL)

        match = book_pattern.search(book_string)
        if match:
            # Extract the book details from the match
            author, year, title = match.groups()

            # Replace newline characters in the title
            title = title.replace('\n', ' ').strip()

            # Create a new Book object and return it
            return Book(author=author, year_published=year, book_name=title)
        else:
            return None
        
    def extract_book_single_line(self,book_string):
        book_pattern = re.compile(r"(\w+) \((\d{4})\) : (.+?)(?=\w+ \(\d{4}\) : |$)")

        match = book_pattern.search(book_string)
        if match:
            # Extract the book details from the match
            author, year, title = match.groups()
            
            # Create a new Book object and return it
            return Book(author=author, year_published=year, book_name=title)
        else:
            return None
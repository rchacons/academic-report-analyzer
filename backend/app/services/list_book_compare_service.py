
import pdfplumber
import re
import logging
from collections import defaultdict

from ..schemas.comparison_schema import Author, Book, ComparaisonListBookResult
from .book_list_extractor_service import BookListExtractorService


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class ListBookCompareService:

    """
    A service for reading and retrieving data of list book, serving for
    comparing list of each year. 
    """
    
    def __init__(self):
        self.book_partern = re.compile(r'([A-Z\s,\'’:.]+)(\d{4})?\s?\(([^)]+)\)')



    def compareTwoListBook(self, path1: str, path2: str) -> ComparaisonListBookResult:

        list_book1 = BookListExtractorService(path1).extract_books_from_pdf()

        author_list1 = [Author(name=book.author) for book in list_book1]



        list_book2 = BookListExtractorService(path2).extract_books_from_pdf()

        author_list2 = [Author(name=book.author) for book in list_book2]


        set_book1 = set(list_book1)

        set_book2 = set(list_book2)

        
        removed_books_from_list = [Book(author=book.author, book_name= book.book_name, year_published=book.year_published, origin = [1]) for book in list_book1 if book not in set_book2]
        added_books_to_list = [Book(author=book.author, book_name= book.book_name, year_published=book.year_published, origin = [2]) for book in list_book2 if book not in set_book1]
        kept_books_in_list = [Book(author=book.author, book_name= book.book_name, year_published=book.year_published, origin = [1,2]) for book in list_book1 if book in set_book2]


        return ComparaisonListBookResult(
            added_books=added_books_to_list,
            removed_books=removed_books_from_list,
            kept_books=kept_books_in_list,
            author_list=author_list1 + author_list2)
    

    









        

        
    


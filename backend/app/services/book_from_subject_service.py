import logging

from ..services.book_list_extractor_service import BookListExtractorService
from ..schemas.comparison_schema import Book
import pdfplumber
import re
from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def link_books_to_subject(books: List[Book], subject: str) -> List[Book]:
    # Combine book attributes into a single string for each book
    book_descriptions = [
        f"{book.author} {book.book_name} {book.year_published}" for book in books
    ]

    # Create a list with the subject and all book descriptions
    corpus = [subject] + book_descriptions

    # Calculate TF-IDF vectors for the corpus
    vectorizer = TfidfVectorizer().fit_transform(corpus)
    vectors = vectorizer.toarray()

    # Calculate cosine similarity between the subject and each book description
    cosine_similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # Get the indices of books sorted by similarity score in descending order
    similar_books_indices = cosine_similarities.argsort()[::-1]

    # Prepare the list of books sorted by relevance to the subject
    linked_books = [books[i] for i in similar_books_indices]

    return linked_books


# Usage example
#file_path = 'path_to_pdf_file.pdf'
#subject = 'Biologie et Médecine'
#linked_books = link_books_to_subject(file_path, subject)
#for book in linked_books:
#    print(book)

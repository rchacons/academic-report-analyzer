
from pydantic import BaseModel
from typing import List, Dict

class Subject(BaseModel):
    """
    A model for a subject in a report.
    """
    domaine: str  # bio / géo
    niveau: str
    intitule: str

    def __eq__(self, other):
        if isinstance(other, Subject):
            return (self.domaine == other.domaine and self.niveau == other.niveau and self.intitule == other.intitule)
        return False

    def __hash__(self):
        return hash((self.domaine, self.niveau, self.intitule))

    
class ComparisonSubjectsResult(BaseModel):
    """
    A model for the result of a comparison.
    """
    added_subjects: Dict[Subject, List[List[str]]]
    removed_subjects: Dict[Subject, List[List[str]]]
    kept_subjects: Dict[Subject, List[List[str]]]
    identical_subjects: Dict[Subject, List[List[str]]]

class ComparisonMaterialsResult(BaseModel):
    
    added_materials: List[str]
    removed_materials: List[str]
    kept_materials: List[str]


class Book(BaseModel):
        author: str
        year_published: str
        book_name: str

        def __eq__(self, other):
            if isinstance(other, Book):
                return (self.author == other.author and
                        self.year_published == other.year_published and
                        self.book_name == other.book_name)
            return False

        def __hash__(self):
            return hash((self.author, self.year_published, self.book_name))
        

class ComparaisonListBookResult(BaseModel):
     added_books: List[Book]
     removed_books: List[Book]
     kept_books: List[Book]
     



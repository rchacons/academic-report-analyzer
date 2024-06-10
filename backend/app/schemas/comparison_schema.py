from pydantic import BaseModel
from typing import List, Optional, Optional, Set

class ListMaterials(BaseModel):
    materials: List[str]
    materials_research: str
    origin: int

    def __hash__(self):
        return hash((tuple(self.materials), self.materials_research, self.origin))

class Subject(BaseModel):
    """
    A model for a subject in a report.
    """
    field: str  # bio / géo
    level: str
    theme: str
    title: str
    title_research: str
    materials_configurations: Set[ListMaterials]

    def __eq__(self, other):
        if isinstance(other, Subject):
            return (self.field == other.field and self.level == other.level and self.title == other.title)
        return False

    def __hash__(self):
        return hash((self.field, self.level, self.title))
    
class ComparisonSubjectsResult(BaseModel):
    """
    A model for the result of a comparison.
    """
    added_subjects: List[Subject]
    removed_subjects: List[Subject]
    kept_subjects: List[Subject]
    field_list: Set[str]
    level_list: Set[str]
    theme_list: Set[str]

class Book(BaseModel):
        author: str
        year_published: str
        book_name: str
        origin: Optional[List[int]] = None

        
        origin: Optional[List[int]] = None

        

        def __eq__(self, other):
            if isinstance(other, Book):
                return (self.author == other.author and
                        self.year_published == other.year_published and
                        self.book_name == other.book_name)
            return False

        def __hash__(self):
            return hash((self.author, self.year_published, self.book_name))
        


class Author(BaseModel):
    name: str

class ComparaisonListBookResult(BaseModel):
    added_books: List[Book]
    removed_books: List[Book]
    kept_books: List[Book]
   
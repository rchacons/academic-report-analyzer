from pydantic import BaseModel
from typing import List, Dict

class ListMaterials(BaseModel):
    materials: List[str]
    origin: int

    # 2 ListMaterials are treated as equals if their materials have the same content
    def __eq__(self, other):
        if isinstance(other, ListMaterials):
            return set(self.materials) == set(other.materials) and self.origin == other.origin
        return False

    def __hash__(self):
        return hash((frozenset(self.materials), self.origin))

class Subject(BaseModel):
    """
    A model for a subject in a report.
    """
    field: str  # bio / géo
    level: str
    title: str
    materials_configurations: List[ListMaterials]

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
    identical_subjects: List[Subject]

class ComparisonMaterialsResult(BaseModel):
    
    added_materials: List[str]
    removed_materials: List[str]
    kept_materials: List[str]
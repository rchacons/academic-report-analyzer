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
    
class ListMaterials(BaseModel):
    materials: List[str]
    origin: int

class ComparisonSubjectsResult(BaseModel):
    """
    A model for the result of a comparison.
    """
    added_subjects: Dict[Subject, List[ListMaterials]]
    removed_subjects: Dict[Subject, List[ListMaterials]]
    kept_subjects: Dict[Subject, List[ListMaterials]]
    identical_subjects: Dict[Subject, List[ListMaterials]]

class ComparisonMaterialsResult(BaseModel):
    
    added_materials: List[str]
    removed_materials: List[str]
    kept_materials: List[str]
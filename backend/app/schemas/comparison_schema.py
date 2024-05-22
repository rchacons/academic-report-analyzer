from pydantic import BaseModel
from typing import List, Dict, Any


class Subject(BaseModel):
    """
    A model for a subject in a report.
    """
    bio_geol: str
    niveau: str
    lecon: str
    materiel: List[str]

class KeptSubject(BaseModel):
    """
    A model for a subject that is kept in the comparison result.
    """
    bio_geol: str
    niveau: str
    lecon: str
    materiel_homis: List[str]
    materiel_ajoute: List[str]
    materiel_garde: List[str]

class ComparisonResult(BaseModel):
    """
    A model for the result of a comparison.
    """
    old_subjects: List[Subject]
    new_subjects: List[Subject]
    same_subjects: List[KeptSubject]  
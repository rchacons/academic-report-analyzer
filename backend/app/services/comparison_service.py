from .report_service import ReportService  
from ..schemas.comparison_schema import Subject, ComparisonSubjectsResult, ListMaterials
from typing import List, Dict, Set
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ComparisonService:
    
    """
    A service for comparing reports.
    """
    def compare(self, path1: str, path2: str) -> ComparisonSubjectsResult:
        """
        Creates the reports based on the pdf path and compares them.

        Args:
        path1 (str): The path to the first report
        path2 (str): The path to the second report

        Returns:
        ComparisonResult: The result of the comparison
        """

        logger.info("Starting comparison : Fetching report data")

        report1 = ReportService(path1, 1).data
        report2 = ReportService(path2, 2).data
        return self.compareSubjectsWithMaterials(report1, report2)
 
    def compareSubjectsWithMaterials(self, subjects1: Dict[Subject, Set[ListMaterials]], subjects2: Dict[Subject, Set[ListMaterials]]) -> ComparisonSubjectsResult:
        added_subjects : Dict[Subject, Set[ListMaterials]] = {subject: values for subject, values in subjects2.items() if subject not in subjects1}
        removed_subjects : Dict[Subject, Set[ListMaterials]] = {subject: values for subject, values in subjects1.items() if subject not in subjects2}
        kept_subjects : Dict[Subject, Set[ListMaterials]] = {}
        identical_subjects : Dict[Subject, Set[ListMaterials]] = {}

        common_keys : set[Subject] = subjects1.keys() & subjects2.keys()

        for subject in common_keys:

            materials_s1_set : set[ListMaterials] = subjects1[subject]
            materials_s2_set : set[ListMaterials] = subjects2[subject]

            identical : set[ListMaterials] = materials_s1_set & materials_s2_set
            kept : set[ListMaterials] = materials_s1_set ^ materials_s2_set  # Symmetric difference

            if identical:
                identical_subjects[subject] = identical
            if kept:
                kept_subjects[subject] = kept

        all_keys : set[Subject] = subjects1.keys() | subjects2.keys()
        unique_fields: Set[str] = {subject.field.lower() for subject in all_keys if subject.field.strip()}
        unique_levels: Set[str] = {subject.level.lower() for subject in all_keys if subject.level.strip()}

        return ComparisonSubjectsResult(
            added_subjects=self.convertDictionaryIntoSubject(added_subjects),
            removed_subjects=self.convertDictionaryIntoSubject(removed_subjects),
            kept_subjects=self.convertDictionaryIntoSubject(kept_subjects),
            identical_subjects=self.convertDictionaryIntoSubject(identical_subjects),
            field_list=unique_fields,
            level_list=unique_levels,
            theme_list =[]
        )

    def convertDictionaryIntoSubject(self, dictionary: Dict[Subject, Set[ListMaterials]]) -> List[Subject]:
        subjects_list = []
        for key, value in dictionary.items():
            subject = Subject(field=key.field, level=key.level, theme=key.theme, title=key.title, title_research=key.title_research, materials_configurations=value)
            subjects_list.append(subject)
        return subjects_list
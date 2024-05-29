from .report_service import ReportService  
from ..schemas.comparison_schema import Subject, ComparisonMaterialsResult, ComparisonSubjectsResult, ListMaterials
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
 
    def compareSubjectsWithMaterials(self, subjects1: Dict[Subject, List[ListMaterials]], subjects2: Dict[Subject, List[ListMaterials]]) -> ComparisonSubjectsResult:
        
        added_subjects = {subject: values for subject, values in subjects2.items() if subject not in subjects1}
        removed_subjects = {subject: values for subject, values in subjects1.items() if subject not in subjects2}
        kept_subjects = {}
        identical_subjects = {}

        common_keys = subjects1.keys() & subjects2.keys()

        for subject in common_keys:
            identical_lists = [lst for lst in subjects1[subject] if lst in subjects2[subject]]
            if identical_lists:
                identical_subjects[subject] = identical_lists
                kept_materials = []
                for lst in subjects1[subject]:
                    kept_materials.append(ListMaterials(materials=[material for material in lst.materials if material not in identical_lists[0].materials], origin=lst.origin))
                kept_subjects[subject] = kept_materials
            else:
                kept_subjects[subject] = subjects1[subject]

        return ComparisonSubjectsResult(
            added_subjects=added_subjects,
            removed_subjects=removed_subjects,
            kept_subjects=kept_subjects,
            identical_subjects=identical_subjects
        )
    
    def countNumberOfSubjects(subjects: Dict[Subject, List[ListMaterials]]) -> int:
        total_count = 0
        for materials_list in subjects.values():
            for materials_obj in materials_list:
                total_count += len(materials_obj.materials)
        return total_count 
    
    def compareListMaterials(self, list1: List[str], list2: List[str]) -> ComparisonMaterialsResult:
        added_materials = List[str]([item for item in list1 if item not in list2])
        removed_materials = List[str]([item for item in list2 if item not in list1])
        kept_materials = List[str]([item for item in list1 if item in list2])
        return ComparisonMaterialsResult(added_materials=added_materials,removed_materials=removed_materials,kept_materials=kept_materials)  


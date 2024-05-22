from .report_service import ReportService  
from ..schemas.comparison_schema import Subject, ComparisonResult, KeptSubject
from typing import List, Dict
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ComparisonService:
    """
    A service for comparing reports.
    """
    
    def compare(self, path1: str, path2: str) -> ComparisonResult:
        """
        Creates the reports based on the pdf path and compares them.

        Args:
        path1 (str): The path to the first report
        path2 (str): The path to the second report

        Returns:
        ComparisonResult: The result of the comparison
        """

        report1 = ReportService(path1).data
        report2 = ReportService(path2).data

    
        # Perform the comparison
        old_subjects, new_subjects, same_subjects = self.perform_comparison(report1, report2)

        return ComparisonResult(
            old_subjects=old_subjects,
            new_subjects=new_subjects,
            same_subjects=same_subjects
        )
    

    def count(self, df, column):
        """
        Count the occurrences for each material in a DataFrame column.

        Args:
        df (DataFrame): The DataFrame to count occurrences in
        column (str): The column to count occurrences in

        Returns:
        DataFrame: The DataFrame with counted occurrences
        """
        
        logger.info("Counting occurrences")

        # Replace 'nan' elements with np.nan
        df[column] = df[column].apply(lambda x: [np.nan if 'nan' in str(item).lower() else item for item in x]) 

        # Remove null elements
        df[column] = df[column].apply(lambda x: [e for e in x if pd.notna(e)]) 

        # Add count to elements that appear more than once
        df[column] = df[column].apply(lambda x: [w if x.count(w) == 1 else w + ' (' + str(x.count(w)) + ')' for w in x])


        return df
  

    def perform_comparison(self, report1, report2) :
        """
        Perform a comparison between two reports.

        Args:
        report1 (Report): The first report
        report2 (Report): The second report

        Returns:
        tuple: A tuple containing the old subjects, new subjects, and same subjects
        """

        logger.info("Performing comparison")

        # Convert List[Subjects] to Dataframe
        old_subjects = pd.DataFrame([subject.dict() for subject in report1])
        new_subjects = pd.DataFrame([subject.dict() for subject in report2])

        # Merge the two DataFrames
        df = pd.merge(old_subjects, new_subjects, on=['bio_geol','niveau','lecon'], how='outer')
        df = df.reset_index(drop=True)

        # Find new subjects
        new_subjects = df[(df['materiel_x'].isna()) & (df['materiel_y'].notna())].drop('materiel_x', axis=1).rename(columns={'materiel_y':'materiel'})
        new_subjects = self.count(new_subjects, 'materiel')
        
        # Find old subjects
        old_subjects = df[(df['materiel_x'].notna()) & (df['materiel_y'].isna())].drop('materiel_y', axis=1).rename(columns={'materiel_x':'materiel'})
        old_subjects = self.count(old_subjects, 'materiel')
        
        # Same subjects
        df = df[(df['materiel_x'].notna()) & (df['materiel_y'].notna())]
        df['materiel_homis'] = [list(set(a)-set(b)) for a, b in zip(df['materiel_x'], df['materiel_y'])]
        df['materiel_ajoute'] = [list(set(a)-set(b)) for a, b in zip(df['materiel_y'], df['materiel_x'])]
        df['materiel_garde'] = [list(set(a)&set(b)) for a, b in zip(df['materiel_y'], df['materiel_x'])]
        df = df.drop('materiel_x', axis=1)
        df = df.drop('materiel_y', axis=1)
        df = self.count(df, 'materiel_ajoute')
        df = self.count(df, 'materiel_homis')
        df = self.count(df, 'materiel_garde')

        # Convert to list of subjects to respect the schema
        old_subjects = [Subject(**record) for record in old_subjects.to_dict('records')]
        new_subjects = [Subject(**record) for record in new_subjects.to_dict('records')]
        same_subjects = [KeptSubject(**record) for record in df.to_dict('records')]

        return old_subjects, new_subjects, same_subjects
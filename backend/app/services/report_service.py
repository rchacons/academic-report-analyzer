from typing import List, Dict, Tuple
from ..schemas.comparison_schema import Subject, ListMaterials
import pandas as pd
import pdfplumber
import re
import logging
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class ReportService:
    """
    A service for reading, processing, and cleaning the tabular data from PDF files.
    """

    def __init__(self, path, origin: int):
        self.path = path
        self.data = None
        self.get_table_and_clean_data(origin)
    
    def get_table_and_clean_data(self, origin: int):
        """
        Get the table from the PDF file and clean the data.
        """
        raw_data = self.get_table_from_pdf()
        self.data = self.clean_and_parse_data(raw_data, origin)

    def get_table_from_pdf(self):
        """
        Extract the table from the PDF file.

        Returns:
        list: The table data
        """

        logger.info("Extracting table from PDF")

        text = []

        with pdfplumber.open(self.path) as pdf:
            for page in pdf.pages:
                text += page.extract_table()
        
        return text
    

    def clean_and_parse_data(self, raw_data, origin:int) ->Dict[Subject, List[ListMaterials]]:
        """
        Clean and parse the raw data into a list of Subjects.

        Args:
        raw_data (list): The raw data

        Returns:
        List[Subject]: The cleaned and parsed data
        """
        
        logger.info("Cleaning and parsing data")

        subjects : Dict[Subject, List[List[str]]] = {}

        for row in raw_data[1:]:

            # Normalize text
            row = [re.sub(r'\s+', ' ', cell).strip() for cell in row]

            if (row[2] != "Titre de la leçon") and (row[1] != "Niveau"):
                
                # Parse the row into a Subject object
                subject = Subject(
                    domaine=row[0],
                    niveau=row[1],
                    intitule=row[2]
                )

                if subject not in subjects:
                    subjects[subject] = []
                subjects[subject].append(self.tokenize_material(row[3], origin))

        return subjects

    def tokenize_material(self, raw_materials:str, origin: int) -> ListMaterials:
        """
        Tokenize the raw materials string into a list of materials.

        Args:
        raw_materials (str): The raw materials string

        Returns:
        List[str]: The tokenized materials
        """
        logger.debug("Tokenizing materials") 
        
        # Replace newlines that should be commas
        material_str = re.sub(r'\n', ', ', raw_materials)
    
        # Replace points by commas
        material_str = material_str.replace(".", ",")

        # Replace all '+' characters with ',' if there is not at least one digit within two characters before or within two characters after the '+'. 
        material_str = re.sub(r'(?<!\d{2})\+(?!\d{2})', ',', material_str)

        # Replace ';' by commas
        material_str = material_str.replace(";", ",")

        # Replace '/' that are not followed nor preceded by a number, by commas
        material_str = re.sub(r'(?<!\d)/|/(?!\d)', ',', material_str)

        # Replace all '-' characters with spaces, if there is not at least one digit within two characters before or within two characters after the '+'. 
        material_str = re.sub(r'(?<!\d{2})\+(?!\d{2})', ' ', material_str)

        # Remove '•'
        material_str = material_str.replace("•", "")
        
        # Handle numbers with commas (ex -> '0,5mol/L')
        material_str = re.sub(r'(\d),(\d)', r'\1.\2', material_str)
    
        # Split on comma and strip whitespace from each item
        final_materials = [item.strip() for item in material_str.split(',') if item]

        # Remove the french stopwords
        final_materials = [word for word in final_materials if word not in stopwords.words('french')]

        # Remove available materials
        list_exclude = ["eau", "microscope", "aiguille lancéolée", "blouse", "ciseaux", "ecran vertical", "évier", "excel", "feutre à pointe fine", "feutre au matériel", "feutres permanents", "lames de verre", "lunettes", "marqueur", "ordinateur", "papier absorbant", "pissette", "pissette d'eau", "poubelle de table", "récipient", "sopalin", "tableur", "touillette", "matériel imposé", "", " "]
        final_materials = [word for word in final_materials if word.lower() not in list_exclude]

        return ListMaterials(materials=final_materials, origin=origin)
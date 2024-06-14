from typing import List, Dict, Tuple, Set
from ..schemas.comparison_schema import Subject, ListMaterials
from .themes_service import ThemesService
import pandas as pd
import pdfplumber
import re
import logging
import nltk
from nltk.corpus import stopwords


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ReportService:

    """
    A service for reading, processing, and cleaning the tabular data from files.
    """

    def __init__(self, path, origin: int, themesService: ThemesService):
        self.path = path
        self.data = None
        self.themesService = themesService
        self.get_table_and_clean_data(origin)

    def get_table_and_clean_data(self, origin: int):
        if self.path.endswith('.pdf'):
            raw_data = self.get_table_from_pdf()
        elif self.path.endswith('.xlsx'):
            raw_data = self.get_table_from_excel()
        else:
            raise ValueError("Unsupported file format")
        
        self.data = self.clean_and_parse_data(raw_data, origin)

    def get_table_from_pdf(self):
        """
        Extract the table from the PDF file.

        Returns:
        list: The table data
        """

        logger.info("Extracting table from file")

        text = []

        with pdfplumber.open(self.path) as pdf:
            for page in pdf.pages:
                text += page.extract_table()
        return text
    
    def get_table_from_excel(self) -> list[str]:
        return pd.read_excel(self.path).values.tolist()
    
    def clean_and_parse_data(self, raw_data, origin:int) -> Dict[Subject, Set[ListMaterials]]:
        """
        Clean and parse the raw data into a list of Subjects.

        Args:
        raw_data (list): The raw data

        Returns:
        List[Subject]: The cleaned and parsed data
        """
        logger.info("Cleaning and parsing data")

        subjects : Dict[Subject, Set[ListMaterials]] = {}
        managed_pagination_data : List[List[str]] = []

        #handle pagination by fusing cropped rows with their corresponding row in the previous page
        for i in range(0, len(raw_data)):
            current_row : List[str] = raw_data[i]
            if(len(current_row) > 0 and isinstance(current_row[0], str)):
                current_row = [re.sub(r'\s+', ' ', str(cell)).strip() for cell in current_row]
                if(ReportService.isCroppedRow(current_row) and i >= 2):
                    previous_row : List[str] = raw_data[i-1]
                    if(ReportService.isHeaderRow(previous_row)): #Header row is repeated at the beginning of all pages
                        managed_pagination_data[-1][3] += '\n' + current_row[3]
                        if(current_row[2] != ""):
                            managed_pagination_data[-1][2] += " " + current_row[2]
                elif(not ReportService.isHeaderRow(current_row)):
                    managed_pagination_data.append(current_row)
                    if(len(current_row) >= 5 and isinstance(current_row[4], str) and current_row[4] != "" and current_row[4] != "nan"):
                        if(self.themesService.themes == None):
                            self.themesService.themes = set()
                        self.themesService.themes.add(current_row[4])

        for row in managed_pagination_data[0:]:
                
            if(len(row) >= 5 and isinstance(row[4], str) and row[4] != "" and row[4] != "nan"):
                themeToGive : str = row[4]
            else:
                themeToGive : str = self.themesService.get_associated_theme(row[2])

            # Parse the row into a Subject object
            subject = Subject(
                field=row[0],
                level=row[1],
                theme=themeToGive,
                title=row[2],
                title_research=self.tokenize_lemmatize(row[2]),
                materials_configurations=set([ListMaterials(materials=[], origin=origin, materials_research="")])
            )

            if subject not in subjects:
                subjects[subject] = set()
            subjects[subject].add(self.tokenize_material(row[3], origin))

        return subjects

    @staticmethod
    def isHeaderRow(row : List[str]) -> bool :
        if(row[0].lower() not in ["bio/géol", "domaine", "field"]): return False
        if(row[1].lower() not in ["niveau", "level"]): return False
        if("titre" not in row[2].lower() and "title" not in row[2].lower()) and "intitulé" not in row[2].lower(): return False
        if("matériel" not in row[3].lower()): return False
        return True
    
    @staticmethod
    def isCroppedRow(row : List[str]) -> bool :
        return row[0] == "" and row[1] == "" and row[3] != ""

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
        material_str = re.sub(r'\r\n|\r|\n', ', ', raw_materials)

        # Replace points by commas
        material_str = material_str.replace(".", ",")

        # Replace ';' by commas
        material_str = material_str.replace(";", ",")

        # Remove '•'
        material_str = material_str.replace("•", ",")
        material_str = material_str.replace("●", ",")

        # Replace all '+' characters with ',' if there is not at least one digit within two characters before or within two characters after the '+'. 
        material_str = re.sub(r'(?<!\d{2})\+(?!\d{2})', ',', material_str)

        # Replace '/' that are not followed nor preceded by a number, by commas
        material_str = re.sub(r'(?<!\d)/|/(?!\d)', ',', material_str)

        # Replace all '-' characters with spaces, if there is not at least one digit within two characters before or within two characters after the '+'. 
        material_str = re.sub(r'(?<!\d{2})\+(?!\d{2})', ' ', material_str)

        # Handle numbers with commas (ex -> '0,5mol/L')
        material_str = re.sub(r'(\d),(\d)', r'\1.\2', material_str)

        # Split on comma and strip whitespace from each item
        final_materials = [item.strip() for item in material_str.split(',') if item]

        # Remove the french stopwords
        final_materials = [word for word in final_materials if word not in stopwords.words('french')]

        # Remove available materials
        list_exclude = ["eau", "microscope", "aiguille lancéolée", "blouse", "ciseaux", "ecran vertical", "évier", "excel", "feutre à pointe fine", "feutre au matériel", "feutres permanents", "lames de verre", "lunettes", "marqueur", "ordinateur", "papier absorbant", "pissette", "pissette d'eau", "poubelle de table", "récipient", "sopalin", "tableur", "touillette", "matériel imposé", "", " "]
        final_materials = [word for word in final_materials if word.lower() not in list_exclude]

        return ListMaterials(materials=final_materials, materials_research=", ".join(self.tokenize_lemmatize(final_materials)) ,origin=origin)
    
    def tokenize_lemmatize(self, text: str):
        return text


from typing import Set, Optional
import pandas as pd
import logging
import re
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import math


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ThemesService:

    """
    A service for reading, processing, and cleaning the tabular data from files.
    """

    def __init__(self, path : Optional[str]):
        self.path = path
        self.set_themes()

    def set_themes(self):
        if(self.path):
            raw_data = pd.read_excel(self.path).values.tolist()
            self.themes = self.extract_themes(raw_data)
        else:
            self.themes = None

    def extract_themes(self, raw_data) -> Set[str]:
        """
        Clean and parse the raw data into a list of Subjects.

        Args:
        raw_data (list): The raw data

        Returns:
        Set[str]: The list of themes
        """
        themes : Set[str] = set()
        for row in raw_data[0:]:
            if(row and len(row) > 0 and isinstance(row[0], str)):
                if row[0].lower() not in ["theme", "themes", "thème", "thèmes", "", "nan"]:
                    if all(sous_chaine not in row[0].lower() for sous_chaine in ["référent.es", "participant.es", "en gras"]):
                        themes.add(row[0])

        return themes
    
    def get_associated_theme(self, subject_title) -> str:        
        if(self.path == None):
            return ""
        else:
            listthemes = list(self.themes)
            documents = [subject_title] + listthemes # Liste combinée pour calculer les TF-IDF
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(documents)
            cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
            index_most_similar = np.argmax(cosine_similarities)
            associated_theme = listthemes[index_most_similar]
            return associated_theme



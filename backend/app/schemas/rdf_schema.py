from pydantic import BaseModel
from typing import List, Dict, Any
import json

# TODO

class RDFSchema(BaseModel):
    rdf_content: list[str]

class RDFResponseGraph(BaseModel):
    graph: dict
    client_concept: dict
    combinate_graph: dict

class RDFResponseCombinGraph(BaseModel):
    combinate_graph: dict


class RDFResponse(BaseModel):
    message: str
    data: dict

class RDFRequest(BaseModel):
    text: str

class RDFResponse2(BaseModel):
    preprocessed_terms: list
    wikidata_graph: dict
    dbpedia_graph: dict
    merged_graph: dict

class RDFResponse22(BaseModel):
    preprocessed_terms: list
    wikidata_graph: dict
    dbpedia_graph: dict
    merged_graph: dict
    labels_dbpedia: dict
    labels_wikidata: dict

class RDFResponse23(BaseModel):
    preprocessed_terms: list
    graph: dict


class RDFResponse3(BaseModel):
    terms: list

class RDFResponse4(BaseModel):
    terms: list
    lemme_terms: list

class RDFResponse5(BaseModel):
    text: str

class RDFResponse6(BaseModel):
    graph_data: Dict[str, Any]
    terms: List[str]
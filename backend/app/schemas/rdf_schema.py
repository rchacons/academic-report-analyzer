from pydantic import BaseModel
from typing import List

# TODO

class RDFSchema(BaseModel):
    rdf_content: list[str]

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
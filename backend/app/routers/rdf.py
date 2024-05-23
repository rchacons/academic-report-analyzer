from fastapi import APIRouter, HTTPException
from ..services.rdf_service import preprocess, retrieve_top_biology_concepts_dbpedia, retrieve_top_biology_concepts_wikidata, merge_graphs, get_graph_data
from ..schemas.rdf_schema import RDFSchema, RDFResponse2, RDFRequest

router = APIRouter()

@router.post("/process-rdf/", 
            summary="Process RDF data",
            description="Takes a text, pre-processes it, queries Wikidata and DBpedia, and returns the constructed schema.",
            response_model=RDFResponse2,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def process_rdf(request: RDFRequest):
    try:
        # Preprocess the input text
        preprocessed_terms = preprocess(request.text.split())
        
        # Retrieve graphs from Wikidata and DBpedia
        wikidata_graph = retrieve_top_biology_concepts_wikidata(preprocessed_terms)
        dbpedia_graph = retrieve_top_biology_concepts_dbpedia(preprocessed_terms)
        
        # Merge the graphs
        merged_graph = merge_graphs(wikidata_graph, dbpedia_graph)
        
        # Convert graphs to JSON
        wikidata_graph_data = get_graph_data(wikidata_graph)
        dbpedia_graph_data = get_graph_data(dbpedia_graph)
        merged_graph_data = get_graph_data(merged_graph)
        
        return RDFResponse2(
            preprocessed_terms=preprocessed_terms,
            wikidata_graph=wikidata_graph_data,
            dbpedia_graph=dbpedia_graph_data,
            merged_graph=merged_graph_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

"""
async def process_rdf_endpoint(rdf_data: RDFSchema):
    try:
        result = process_rdf(rdf_data)
        return {"message": "RDF processed successfully", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""
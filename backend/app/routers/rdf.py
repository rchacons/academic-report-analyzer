from fastapi import APIRouter, HTTPException
from ..services.rdf_service import preprocess, merge_graphs, get_graph_data, stemme_words, trad_words,trad_sentence, preprocess_english, lemmatize_words, trad_words_french, merge_graphs, get_graph_data, retrieve_top_biology_concepts_dbpedia, retrieve_top_biology_concepts_wikidata, get_labels_from_dbpedia, get_labels_from_wikidata, test_wiki, wiki_graph, process_rdf_wikipedia, get_graph_from_sentence
from ..schemas.rdf_schema import RDFSchema, RDFResponse2, RDFRequest, RDFResponse3, RDFResponse4, RDFResponse5, RDFResponse6, RDFResponse22, RDFResponse23, RDFResponseGraph, RDFResponseCombinGraph
import json


router = APIRouter()


@router.post("/main-get-graph-from-sentence/", 
            summary="Process RDF data",
            description="Takes a text, pre-processes it, lemmetize it, queries Wikipedia, and returns the constructed graph in JSON format.",
            response_model=RDFResponseCombinGraph,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def process_rdf(request: RDFRequest):
    try:
        combinate_graph = get_graph_from_sentence(request.text)

        print(json.dumps(combinate_graph, indent=2, ensure_ascii=False))

        return RDFResponseCombinGraph(
            combinate_graph=combinate_graph
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/main-process-rdf-wikipedia/", 
            summary="Process RDF data",
            description="Takes a text, pre-processes it, lemmetize it, queries Wikipedia, and returns the constructed graph in JSON format.",
            response_model=RDFResponseGraph,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def process_rdf(request: RDFRequest):
    try:
        graph, client_concept, combinate_graph = process_rdf_wikipedia(request.text)

        print(json.dumps(combinate_graph, indent=2, ensure_ascii=False))

        return RDFResponseGraph(
            graph=graph,
            client_concept=client_concept,
            combinate_graph=combinate_graph
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    






@router.post("/process-rdf/", 
            summary="Process RDF data",
            description="Takes a text, pre-processes it, queries Wikidata and DBpedia, and returns the constructed schema.",
            response_model=RDFResponse22,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def process_rdf(request: RDFRequest):
    try:
        # Preprocess the input text
        #Traduis l'entrée en français
        eng_sentence = trad_sentence(request.text)
        #Preprocess les mots de la phrase
        preprocessed_terms = preprocess_english(eng_sentence)
        #Lemmetize words
        lemmatize_terms = lemmatize_words(preprocessed_terms)
        #Translate in french
        french_terms = trad_words_french(lemmatize_terms)
        
        # Retrieve graphs from Wikidata and DBpedia
        wikidata_graph = retrieve_top_biology_concepts_wikidata(preprocessed_terms)
        dbpedia_graph = retrieve_top_biology_concepts_dbpedia(preprocessed_terms)
        
        dbpedia_labels = get_labels_from_dbpedia(dbpedia_graph)
        wikidata_labels = get_labels_from_wikidata(wikidata_graph)

        # Merge the graphs
        merged_graph = merge_graphs(dbpedia_graph, wikidata_graph, dbpedia_labels, wikidata_labels)
        #merged_graph = merge_graphs(wikidata_graph, dbpedia_graph)
        
        # Convert graphs to JSON
        wikidata_graph_data = get_graph_data(wikidata_graph)
        dbpedia_graph_data = get_graph_data(dbpedia_graph)
        merged_graph_data = get_graph_data(merged_graph)

        
        return RDFResponse22(
            preprocessed_terms=french_terms,
            wikidata_graph=wikidata_graph_data,
            dbpedia_graph=dbpedia_graph_data,
            merged_graph=merged_graph_data,
            labels_dbpedia=dbpedia_labels,
            labels_wikidata= wikidata_labels
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.post("/process-rdf-wikipedia/", 
            summary="Process RDF data",
            description="Takes a text, pre-processes it, queries Wikidata and DBpedia, and returns the constructed schema.",
            response_model=RDFResponse23,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def process_rdf(request: RDFRequest):
    try:
        # Preprocess the input text
        #Traduis l'entrée en français
        eng_sentence = trad_sentence(request.text)
        #Preprocess les mots de la phrase
        preprocessed_terms = preprocess_english(eng_sentence)
        #Lemmetize words
        lemmatize_terms = lemmatize_words(preprocessed_terms)
        #Translate in french
        french_terms = trad_words_french(lemmatize_terms)
        #Construit le graphe
        graph = wiki_graph(french_terms)

        return RDFResponse23(
            preprocessed_terms=french_terms,
            graph=graph
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post("/preprocess-rdf/", 
            summary="Preprocess RDF data",
            description="Takes a text, pre-processes it and return the result.",
            response_model=RDFResponse3,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def preprocess_rdf(request: RDFRequest):
    try:
        # Preprocess the input text
        preprocessed_terms = preprocess(request.text.split())
        
        return RDFResponse3(
            terms=preprocessed_terms,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/lemmatisation-rdf/", 
            summary="Preprocess RDF data",
            description="Takes a text, pre-processes it, lemme it and return the result.",
            response_model=RDFResponse4,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def preprocess_rdf(request: RDFRequest):
    try:
        # Preprocess the input text
        preprocessed_terms = preprocess(request.text.split())
        # Lemme the preprocessed terms
        stemme_words_terms = stemme_words(preprocessed_terms)
        
        return RDFResponse4(
            terms= preprocessed_terms,
            lemme_terms=stemme_words_terms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/traduction-rdf/", 
            summary="Preprocess RDF data",
            description="Takes a text, pre-processes it, translate it and return the result.",
            response_model=RDFResponse5,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def traduction_rdf(request: RDFRequest):
    try:
        # Preprocess the input text
        #preprocessed_terms = preprocess(request.text.split())
        # traduis les preprocessed terms en anglais
        #traduction_words = trad_words(preprocessed_terms)
        eng_sentence = trad_sentence(request.text)
        
        return RDFResponse5(
            text=eng_sentence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/traduction-mots-rdf/", 
            summary="Preprocess RDF data",
            description="Takes a text, pre-processes it, translate it and return the result.",
            response_model=RDFResponse3,
            responses={
                200: {"description": "RDF processed successfully"},
                400: {"description": "Invalid input"},
                500: {"description": "An error occurred during RDF processing"}
            })
async def traduction_rdf(request: RDFRequest):
    try:
        #Traduis l'entrée en français
        eng_sentence = trad_sentence(request.text)
        #Preprocess les mots de la phrase
        preprocessed_terms = preprocess_english(eng_sentence)
        #Lemmetize words
        lemmatize_terms = lemmatize_words(preprocessed_terms)
        #Translate in french
        french_terms = trad_words_french(lemmatize_terms)
        
        return RDFResponse3(
            terms=french_terms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/traduction-mots-rdf/", 
          summary="Preprocess RDF data",
          description="Takes a list of terms, retrieves RDF data from DBpedia and Wikidata, and returns the merged graph data and terms.",
          response_model=RDFResponse6,
          responses={
              200: {"description": "RDF processed successfully"},
              400: {"description": "Invalid input"},
              500: {"description": "An error occurred during RDF processing"}
          })
async def traduction_rdf(request: RDFRequest):
    try:
        #Traduis l'entrée en français
        eng_sentence = trad_sentence(request.text)
        #Preprocess les mots de la phrase
        preprocessed_terms = preprocess_english(eng_sentence)
        #Lemmetize words
        lemmatize_terms = lemmatize_words(preprocessed_terms)
        #Translate in french
        french_terms = trad_words_french(lemmatize_terms)
        
        # Retrieve biology concepts from DBpedia and Wikidata
        dbpedia_graph = retrieve_top_biology_concepts_dbpedia(french_terms)
        wikidata_graph = retrieve_top_biology_concepts_wikidata(french_terms)
        
        # Merge the two graphs
        merged_graph = merge_graphs(dbpedia_graph, wikidata_graph)
        
        # Get graph data
        graph_data = get_graph_data(merged_graph)
        
        return RDFResponse6(
            graph_data=graph_data,
            terms=french_terms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
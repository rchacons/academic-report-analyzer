import pytest
from app.services.rdf_service import preprocess, retrieve_top_biology_concepts_dbpedia, retrieve_top_biology_concepts_wikidata, merge_graphs, get_graph_data, process_rdf
from rdflib import Graph

def test_preprocess():
    terms = ["l'exemple", "les arbres", "d'eau"]
    expected = ["exemple", "arbres", "eau"]
    assert preprocess(terms) == expected

def test_retrieve_top_biology_concepts_dbpedia():
    terms = ["ADN"]
    graph = retrieve_top_biology_concepts_dbpedia(terms)
    assert isinstance(graph, Graph)
    assert len(graph) > 0  # Assure qu'il y a au moins une donnée RDF dans le graphe

def test_retrieve_top_biology_concepts_wikidata():
    terms = ["ADN"]
    graph = retrieve_top_biology_concepts_wikidata(terms)
    assert isinstance(graph, Graph)
    assert len(graph) > 0  # Assure qu'il y a au moins une donnée RDF dans le graphe

def test_merge_graphs():
    g1 = Graph()
    g2 = Graph()
    merged_graph = merge_graphs(g1, g2)
    assert isinstance(merged_graph, Graph)
    assert len(merged_graph) >= len(g1) + len(g2)  # Le graphe fusionné doit être au moins aussi grand que la somme des graphes individuels

def test_get_graph_data():
    g = Graph()
    data = get_graph_data(g)
    assert isinstance(data, dict)
    assert 'nodes' in data and 'links' in data

def test_process_rdf():
    class RDFData:
        def __init__(self, terms):
            self.terms = terms

    rdf_data = RDFData(terms=["ADN", "protéine"])
    result = process_rdf(rdf_data)
    assert 'Réponse' in result or ('nodes' in result and 'links' in result)

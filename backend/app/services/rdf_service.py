import rdflib
import re
import nltk
from textblob import TextBlob 
#from pattern import parse, split
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer, SnowballStemmer, PorterStemmer
from nltk.stem.snowball import FrenchStemmer
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from rdflib import Graph, URIRef, RDF
from rdflib.extras.external_graph_libs import rdflib_to_networkx_multidigraph
from SPARQLWrapper import SPARQLWrapper, JSON
import networkx as nx
from networkx.readwrite import json_graph




# Adaptation de la V1
# Assurez-vous d'avoir téléchargé les ressources nécessaires
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('averaged_perceptron_tagger')
nltk.download('universal_tagset')
nltk.download('stopwords')
nltk.download('punkt')


def preprocess(terms):
    terms = [re.sub("(l'|d'|L'|D'|s'|S'|t'|T'|m'|M'|n'|N'|c'|C'|j'|J'|qu'|Qu')", "", w) for w in terms]
    terms = [re.sub(r'\(\d+\)|,', '', w).strip() for w in terms]
    terms = [re.sub(r'\W+', '', w).lower() for w in terms]
    terms = [item for item in terms if item != ""]
    terms = [w for w in terms if w not in stopwords.words('french')]
    terms = [w for w in terms if w.lower() != 'les']
    terms = [w for w in terms if w.lower() != 'des']
    terms = [w for w in terms if w.lower() != 'le']
    terms = [w for w in terms if w.lower() != 'de']
    terms = [w for w in terms if w.lower() != 'la']
    terms = [w for w in terms if w.lower() != 'une']
    terms = [w for w in terms if w.lower() != 'un']
    terms = [w for w in terms if len(w) >= 3]
    terms = list(dict.fromkeys(terms))
    
    return terms


"""
def lemmatize_words(word_list):
    lemmatizer = WordNetLemmatizer()
    return [lemmatizer.lemmatize(word, get_wordnet_pos(word)) for word in word_list]
"""
"""
def lemmatize_words(word_list):
    stemmer = SnowballStemmer('french')
    return [stemmer.stem(word) for word in word_list]
"""

def lemmatize_words(word_list):
    stemmer = FrenchStemmer()
    lemmatized_words = []
    for word in word_list:
        stemmed_word = stemmer.stem(word)
        if nltk.pos_tag([word])[0][1].startswith('V'):  # Vérifie si le mot est un verbe
            lemma = stemmer.stem(word)  # Prend la racine du mot
        else:
            lemma = stemmed_word
        lemmatized_words.append(lemma)
    ps =PorterStemmer()
    for w in word_list:
        rootWord=ps.stem(w)
        print(rootWord)
    return lemmatized_words




def retrieve_top_biology_concepts_dbpedia(terms):
    g = Graph()
    endpoint_url = "https://dbpedia.org/sparql"
    for term in terms:
        resource_query = f"""
            SELECT DISTINCT ?resource WHERE {{
                ?resource rdfs:label "{term}"@en.
            }}
            LIMIT 1
        """
        resource_sparql = SPARQLWrapper(endpoint_url)
        resource_sparql.setQuery(resource_query)
        resource_sparql.setReturnFormat(JSON)
        resource_results = resource_sparql.query().convert()
        if 'results' in resource_results and 'bindings' in resource_results['results']:
            if len(resource_results['results']['bindings']) > 0:
                resource_uri = resource_results['results']['bindings'][0]['resource']['value']
                concept = URIRef(resource_uri)
                g.add((concept, RDF.type, URIRef("https://dbpedia.org/ontology/Biology")))
            else:
                print(f"No results found for the term: {term}")
        else:
            print("Error in resource query results format.")
    return g

def is_valid_wikidata_uri(uri):
    return uri.startswith("https://www.wikidata.org/entity/")

def retrieve_top_biology_concepts_wikidata(terms):
    g = Graph()
    endpoint_url = "https://query.wikidata.org/sparql"
    for term in terms:
        qid_query = f"""
            SELECT ?subject ?subjectLabel WHERE {{
                ?subject rdfs:label "{term}"@en.
                SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}
            }}
            LIMIT 1
        """
        qid_sparql = SPARQLWrapper(endpoint_url)
        qid_sparql.setQuery(qid_query)
        qid_sparql.setReturnFormat(JSON)
        qid_results = qid_sparql.query().convert()
        if 'results' in qid_results and 'bindings' in qid_results['results']:
            if len(qid_results['results']['bindings']) > 0:
                qid = qid_results['results']['bindings'][0]['subject']['value'].split("/")[-1]
                term_uri = URIRef(f'https://www.wikidata.org/entity/{qid}')
                g.add((term_uri, RDF.type, URIRef("https://www.wikidata.org/entity/Q420927")))
            else:
                print(f"No results found for the term: {term}")
        else:
            print("Error in QID query results format.")
    return g

def merge_graphs(graph1, graph2):
    common_node_uri = URIRef("https://example.org/commonNode")
    graph1.add((common_node_uri, RDF.type, URIRef("https://example.org/commonNode")))
    graph1.add((URIRef("https://example.org/commonNode"), URIRef("https://example.org/commonNode"), common_node_uri))
    graph2.add((URIRef("https://example.org/commonNode"), URIRef("https://example.org/commonNode"), common_node_uri))
    merged_graph = graph1 + graph2
    return merged_graph

def get_graph_data(graph):
    nx_graph = rdflib_to_networkx_multidigraph(graph)
    unique_nx_graph = nx.Graph(nx_graph)
    graph_data = json_graph.node_link_data(unique_nx_graph)
    return graph_data

def process_rdf(rdf_data):
    try:
        terms = preprocess(rdf_data.terms)
        wikidata_graph = retrieve_top_biology_concepts_wikidata(terms)
        dbpedia_graph = retrieve_top_biology_concepts_dbpedia(terms)
        merged_graph = merge_graphs(wikidata_graph, dbpedia_graph)
        graph_data = get_graph_data(merged_graph)
        return graph_data
    except Exception:
        return {'Réponse': 'Introuvable'}



""""
def process_rdf(rdf_data):
    # Implémenter ici les traitements RDF
    # Par exemple, tu peux utiliser RDFLib pour manipuler RDF
    g = rdflib.Graph()
    try:
        g.parse(data=rdf_data.rdf_content, format="application/rdf+xml")
        # Exemple de traitement: compter les triplets dans le graphe
        # Effectuer des traitements sur les graphes RDF
    
    
    # Retourner les résultats sous forme de dictionnaire
        result = {"some": "data"}  # Remplacer après par les résultats réels
        return result
    except Exception as e:
        raise RuntimeError(f"Failed to process RDF data: {str(e)}")
    

    """

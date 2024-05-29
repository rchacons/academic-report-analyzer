import rdflib
import re
import nltk
import wikipediaapi
import json
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer, SnowballStemmer, PorterStemmer, RegexpStemmer
from nltk.stem.snowball import FrenchStemmer
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from rdflib import Graph, URIRef, RDF, Literal
from rdflib.extras.external_graph_libs import rdflib_to_networkx_multidigraph
from SPARQLWrapper import SPARQLWrapper, JSON
import networkx as nx
from networkx.readwrite import json_graph
from deep_translator import GoogleTranslator


# Adaptation de la V1
# Assurez-vous d'avoir téléchargé les ressources nécessaires
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('averaged_perceptron_tagger')
nltk.download('universal_tagset')
nltk.download('stopwords')
nltk.download('punkt')



def trad_sentence(sentence):
    translated_text = GoogleTranslator(source='auto', target='en').translate(sentence)
    return translated_text


def preprocess_english(text):
    # Découpe la chaîne de caractères en mots
    terms = text.split()
    # Supprime les contractions anglaises courantes
    terms = [re.sub(r"(i'm|he's|she's|it's|we're|they're|you're|i've|we've|they've|you've|i'll|he'll|she'll|it'll|we'll|they'll|you'll|don't|can't|won't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|didn't|wouldn't|shouldn't|couldn't|mustn't|shan't|n't|'ll|'re|'ve|'d|'s)", "", w, flags=re.IGNORECASE) for w in terms]
    # Supprime les caractères non-alphanumériques et les ponctuations spécifiques
    terms = [re.sub(r'\(\d+\)|,', '', w).strip() for w in terms]
    terms = [re.sub(r'\W+', '', w).lower() for w in terms]
    # Supprime les mots vides (stopwords)
    terms = [w for w in terms if w not in stopwords.words('english')]
    # Filtre les mots vides spécifiques à l'anglais
    custom_stopwords = {'the', 'and', 'is', 'in', 'to', 'it', 'of', 'for', 'on', 'with', 'as', 'by', 'that', 'this', 'at', 'from', 'but', 'not', 'or', 'be', 'are', 'was', 'were', 'an', 'which', 'you', 'we', 'they', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'shall', 'should', 'may', 'might', 'must', 'i', 'he', 'she', 'it', 'me', 'my', 'mine', 'your', 'yours', 'his', 'her', 'hers', 'its', 'our', 'ours', 'their', 'theirs'}
    terms = [w for w in terms if w not in custom_stopwords]
    # Supprime les termes de moins de trois caractères
    terms = [w for w in terms if len(w) >= 3]
    # Supprime les doublons tout en conservant l'ordre des éléments
    terms = list(dict.fromkeys(terms))
    
    return terms

def get_wordnet_pos(word):
    """Retourne la catégorie grammaticale d'un mot nécessaire pour la lemmatisation."""
    tag = nltk.pos_tag([word])[0][1][0].upper()
    tag_dict = {
        'J': wordnet.ADJ,
        'N': wordnet.NOUN,
        'V': wordnet.VERB,
        'R': wordnet.ADV
    }
    return tag_dict.get(tag, wordnet.NOUN)

def lemmatize_words(word_list):
    lemmatizer = WordNetLemmatizer()
    return [lemmatizer.lemmatize(word, get_wordnet_pos(word)) for word in word_list]

def trad_words_french(word_list):
    translated_words = []
    for word in word_list:
        translated_word = GoogleTranslator(source='en', target='fr').translate(word)
        translated_words.append(translated_word)
    return translated_words


#Pourquoi utiliser wikipedia ? Car dbpedia et wikidata n'étaient pas performant avec les requetes sparql. 
#En effet, il fallait préciser un domaine particulier mais les mots clés relatifs à la biologie étaient présents sur plusieurs domaines. 
#Rendant impossible l'affichage de tout les mots clés en une requête.

#Retourne un graphe networkX, pas le format voulu
def test_wiki(words):
    graph = nx.Graph()
    valid_words = []

    # Ajouter les mots ayant une URL Wikipedia au graphe
    for word in words:
        url = get_wiki_link(word)
        if url:
            graph.add_node(word, url=url)
            valid_words.append(word)
    
    # Ajouter des arêtes entre les mots valides selon un critère
    for i, word1 in enumerate(valid_words):
        for j, word2 in enumerate(valid_words):
            if i < j:  # Évite d'ajouter deux fois la même arête ou de créer une boucle
                graph.add_edge(word1, word2)

    print("Noeuds:", graph.nodes(data=True))
    print("Arêtes:", list(graph.edges(data=True)))

    # Convertir le graphe en un dictionnaire de dictionnaires
    graph_dict = nx.to_dict_of_dicts(graph)
    
    # Convertir le dictionnaire en une chaîne JSON
    graph_json = json.dumps(graph_dict, indent=2)

    return graph_json


def get_wiki_link(word):
    wiki_wiki = wikipediaapi.Wikipedia(user_agent='Projet SI-REL2 (annie.foret@univ-rennes1.fr)',
        language='fr',
        extract_format=wikipediaapi.ExtractFormat.WIKI)
    if wiki_wiki.page(word).exists:
        #print("Page trouvée - " + word)
        #Pour chaque catégorie de la page on vérifie si elle appartient à la catégorie biologie, si oui on renvoit le lien
        for index, category in enumerate(wiki_wiki.page(word).categories.keys()):
            if category.startswith("Catégorie:Biologie") or category.startswith("Catégorie:Portail:Biologie"):
                #print(f"{category} : OK - La page '{wiki_wiki.page(word)}' appartient à la catégorie 'Category:Biologie'.")
                return wiki_wiki.page(word).canonicalurl
            # Si la dernière catégorie de la page n'est pas biologique on regarde si une autre page homonyme existe, si oui on renvoit le lien
            if index == len(wiki_wiki.page(word).categories.keys()) - 1: 
                if category.startswith("Catégorie:Biologie") or category.startswith("Catégorie:Portail:Biologie"):
                    #print(f"{category} : OK - La page '{wiki_wiki.page(word)}' appartient à la catégorie 'Category:Biologie'.")
                    return wiki_wiki.page(word).canonicalurl
                else:
                    #print(f"{category} : La page '{wiki_wiki.page(word)}' n'appartient pas à la catégorie 'Category:Biologie'.")
                    if wiki_wiki.page(f"{word} (biologie)").exists:
                        #print("Page (biologie) trouvée - " + word)
                        return wiki_wiki.page(f"{word} (biologie)").canonicalurl
            #else:
                #print(f"{category} : La page '{wiki_wiki.page(word)}' n'appartient pas à la catégorie 'Category:Biologie'.")
    else:
        #print("Mot non trouvé - " + word)
        return ""
    return ""


# Fonction pour construire le graphe RDF
def wiki_graph(words):
    graph = Graph()
    for word in words:
        link = get_wiki_link(word)
        if link:
            concept = URIRef(link)            
            graph.add((Literal(word), URIRef("https://fr.wikipedia.org/wiki/Portail:Biologie"), concept))
    graph_dict = graph_to_dict(graph)
    return graph_dict

# Fonction pour convertir le graphe RDF en un dictionnaire compatible JSON
def graph_to_dict(graph):
    graph_dict = {}
    for subj, pred, obj in graph:
        subj = str(subj)
        pred = str(pred)
        obj = str(obj)
        if subj not in graph_dict:
            graph_dict[subj] = []
        graph_dict[subj].append({'predicate': pred, 'object': obj})
    return graph_dict



#Main
def process_rdf_wikipedia(words):
    #Traduis l'entrée en français
    eng_sentence = trad_sentence(words)
    #Preprocess les mots de la phrase
    preprocessed_terms = preprocess_english(eng_sentence)
    #Lemmetize words
    lemmatize_terms = lemmatize_words(preprocessed_terms)
    #Translate in french
    french_terms = trad_words_french(lemmatize_terms)
    #Construit le graphe
    graph = wiki_graph(french_terms)
    return graph



# Code de la V1


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

def trad_words(word_list):
    translated_words = []
    for word in word_list:
        translated_word = GoogleTranslator(source='auto', target='en').translate(word)
        translated_words.append(translated_word)
    return translated_words

def stemme_words(word_list):
    stemmer = SnowballStemmer('french')
    lemmatized_words = []
    st = RegexpStemmer('s$|es$|era$|erez$|ions$|ent$', min=3)
    for word in word_list:
        stemmed_word = stemmer.stem(word) #1er traitement par SnowballStemmer 
        stemmed_word2 = st.stem(stemmed_word) # 2eme traitement par RegexpStemmer défini au dessus pour éliminer les cas manquants
        lemmatized_words.append(stemmed_word2)
    return lemmatized_words





def retrieve_top_biology_concepts_dbpedia(terms):
    # Create an RDF graph
    g = Graph()
    # Specify the RDF data endpoint (DBpedia SPARQL endpoint)
    endpoint_url = "https://dbpedia.org/sparql"
    for term in terms:
      # Define a SPARQL query to retrieve the resource URI for the specified term
      resource_query = f"""
            SELECT DISTINCT ?resource WHERE {{
                ?resource rdfs:label "{term}"@en.
            }}
            LIMIT 1
        """
      # Set up the SPARQL wrapper for resource query
      resource_sparql = SPARQLWrapper(endpoint_url)
      resource_sparql.setQuery(resource_query)
      resource_sparql.setReturnFormat(JSON)
      # Execute the resource query and parse the results
      resource_results = resource_sparql.query().convert()
      if 'results' in resource_results and 'bindings' in resource_results['results']:
        if len(resource_results['results']['bindings']) > 0:
          # Extract the resource URI for the specified term
          resource_uri = resource_results['results']['bindings'][0]['resource']['value']
          # Add the unique resource URI to the RDF graph
          concept = URIRef(resource_uri)
          g.add((concept, RDF.type, URIRef("https://dbpedia.org/ontology/Biology")))
        else:
          # Handle the case when there are no results for the term
          print(f"No results found for the term: {term}")
      else:
        # Handle the case when there is an issue with the results format
        print("Error in resource query results format.")
    return g
def is_valid_wikidata_uri(uri):
    return uri.startswith("https://www.wikidata.org/entity/")

def retrieve_top_biology_concepts_wikidata(terms):
    # Create an RDF graph
    g = Graph()
    # Specify the RDF data endpoint (Wikidata SPARQL endpoint)
    endpoint_url = "https://query.wikidata.org/sparql"
    for term in terms:
      # Get the QID for the specified term
      qid_query = f"""
              SELECT ?subject ?subjectLabel WHERE {{
                  ?subject rdfs:label "{term}"@en.
                  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}
              }}
              LIMIT 1
              """
      # Set up the SPARQL wrapper for QID query
      qid_sparql = SPARQLWrapper(endpoint_url)
      qid_sparql.setQuery(qid_query)
      qid_sparql.setReturnFormat(JSON)
      # Execute the QID query and parse the results
      qid_results = qid_sparql.query().convert()
      if 'results' in qid_results and 'bindings' in qid_results['results']:
        if len(qid_results['results']['bindings']) > 0:
          # Extract the QID for the specified term
          qid = qid_results['results']['bindings'][0]['subject']['value'].split("/")[-1]
          # Add the term to the RDF graph
          term_uri = URIRef(f'https://www.wikidata.org/entity/{qid}')
          g.add((term_uri, RDF.type, URIRef(f"https://www.wikidata.org/entity/{qid}")))
        else:
          # Handle the case when there are no results for the term
          print(f"No results found for the term: {term}")
      else:
        # Handle the case when there is an issue with the results format
        print("Error in QID query results format.")
    return g
def get_graph_data(graph):
    # Convert RDF graph to NetworkX MultiDiGraph
    nx_graph = rdflib_to_networkx_multidigraph(graph)
    # Create a new graph without duplicate nodes
    unique_nx_graph = nx.Graph(nx_graph)
    # Convert NetworkX graph to JSON format
    graph_data = json_graph.node_link_data(unique_nx_graph)
    return graph_data


# Récupération des labels pour les graphs, ne fonctionne pas en l'état car les API des wiki nécessitent des indicateurs trop précis.

def get_labels_from_dbpedia(graph):
    labels = {}
    endpoint_url = "https://dbpedia.org/sparql"
    sparql = SPARQLWrapper(endpoint_url)
    
    for s, p, o in graph:
        if isinstance(s, URIRef):
            query = f"""
            SELECT ?label WHERE {{
                <{s}> rdfs:label ?label.
                FILTER (lang(?label) = 'en' || lang(?label) = 'fr')
            }}
            LIMIT 1
            """
            sparql.setQuery(query)
            sparql.setReturnFormat(JSON)
            results = sparql.query().convert()
            
            if results["results"]["bindings"]:
                label = results["results"]["bindings"][0]["label"]["value"]
                cleaned_label = re.sub(r'\s*\(.*?\)\s*', '', label)  # Remove text within parentheses
                labels[s] = cleaned_label.lower()
    
    return labels

def get_labels_from_wikidata(graph):
    labels = {}
    endpoint_url = "https://query.wikidata.org/sparql"
    sparql = SPARQLWrapper(endpoint_url)
    
    for s, p, o in graph:
        if isinstance(s, URIRef):
            query = f"""
            SELECT ?label WHERE {{
                <{s}> rdfs:label ?label.
                FILTER (lang(?label) = 'en' || lang(?label) = 'fr')
            }}
            LIMIT 1
            """
            sparql.setQuery(query)
            sparql.setReturnFormat(JSON)
            try:
                results = sparql.query().convert()
                if results["results"]["bindings"]:
                    label = results["results"]["bindings"][0]["label"]["value"]
                    cleaned_label = re.sub(r'\s*\(.*?\)\s*', '', label).lower()  # Remove text within parentheses
                    labels[s] = cleaned_label
            except Exception as e:
                print(f"Error retrieving label for {s}: {e}")
    
    return labels


def create_label_mapping(dbpedia_labels, wikidata_labels):
    label_mapping = {}
    
    for dbpedia_uri, dbpedia_label in dbpedia_labels.items():
        for wikidata_uri, wikidata_label in wikidata_labels.items():
            if dbpedia_label == wikidata_label:
                label_mapping[dbpedia_uri] = wikidata_uri
    
    return label_mapping

def merge_graphs(graph1, graph2, dbpedia_labels, wikidata_labels):
    merged_graph = Graph()
    
    # Add all triples from both graphs to the merged graph
    for triple in graph1:
        merged_graph.add(triple)
        
    for triple in graph2:
        merged_graph.add(triple)
    
    # Create a mapping between DBpedia URIs and Wikidata QIDs based on labels
    label_mapping = create_label_mapping(dbpedia_labels, wikidata_labels)
    
    # Use the mapping to merge nodes
    for dbpedia_uri, wikidata_uri in label_mapping.items():
        for s, p, o in merged_graph:
            if s == dbpedia_uri:
                merged_graph.add((wikidata_uri, p, o))
                merged_graph.remove((s, p, o))
            if o == dbpedia_uri:
                merged_graph.add((s, p, wikidata_uri))
                merged_graph.remove((s, p, o))
    
    return merged_graph

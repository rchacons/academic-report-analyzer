// RelatedConceptPage.js
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRdfGraph } from '../services/RdfService';

const RelatedConceptPage = () => {
  const location = useLocation();

  const text = location.state?.title || '';
  const id = location.state?.id || '';

  const [loading, setLoading] = useState(true);
  const [rdfGraph, setRdfGraph] = useState([]);

  const handleGetRdfGraph = async () => {
    try {
      const rdfGraph = await getRdfGraph({ text });
      setRdfGraph(rdfGraph);
      localStorage.setItem('rdfGraph', JSON.stringify({ id, rdfGraph }));
      localStorage.setItem('rdfGraphTimestamp', Date.now());
    } catch (error) {
      console.error('Une erreur est survenue', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedRdfGraph = localStorage.getItem('rdfGraph');
    const cachedTimestamp = localStorage.getItem('rdfGraphTimestamp');
    const cacheDuration = 1000 * 60 * 60; // 1 hour

    if (cachedRdfGraph && cachedTimestamp && (Date.now() - cachedTimestamp < cacheDuration)) {
      const cachedData = JSON.parse(cachedRdfGraph);
      if (cachedData.id === id) {
        setRdfGraph(cachedData.rdfGraph);
        setLoading(false);
      } else {
        handleGetRdfGraph();
      }
    } else {
      handleGetRdfGraph();
    }
  }, [text, id]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="headerTitle">Concepts Liés</Typography>
      {loading ? (
        <Typography variant="textInfoLittle" mt={1}>
          Le traitement peut mettre quelques instants, veuillez patienter...
        </Typography>
      ) : (
        <Typography variant="body1">
          Le graphe a été chargé avec {rdfGraph.length} éléments.
        </Typography>
      )}
    </Box>
  );
};

export default RelatedConceptPage;

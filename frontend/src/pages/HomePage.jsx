import { Box, Button, Grid, Typography } from '@mui/material';
import FileDropZone from '../components/FileDropZone';
import { useNavigate } from 'react-router-dom';
import { useState } from 'preact/hooks';
import { login } from '../services/AuthService';
import { compareReports } from '../services/comparisonService';

export const HomePage = () => {
  let navigate = useNavigate();

  const [oldReportFile, setOldReportFile] = useState(null);
  const [newReportFile, setNewReportFile] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!oldReportFile || !newReportFile) {
      console.error('Veuillez télécharger les deux fichiers PDF.');
      return;
    }

    try {
      const comparisonResult = await compareReports(oldReportFile, newReportFile);
      console.log(comparisonResult);
    } catch (error) {
      console.error('Erreur lors de la comparaison des rapports. Veuillez réessayer.');
    }

    // console.log('Old report file:', oldReportFile);
    // console.log('New report file:', newReportFile);
    // navigate('/results');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login({ username: 'jperrier', password:'jperrier'});
      console.log('Utilisateur authentifié avec succès:', data);
      // Stocker le token, rediriger l'utilisateur, etc.
    } catch (error) {
      console.error('Échec de l\'authentification. Veuillez vérifier vos identifiants.')
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='headerTitle' gutterBottom>
        Comparer les rapports de jury CAPES
      </Typography>

      <Grid container spacing={2} justifyContent='center'>

        <FileDropZone
          title={'Ancien Rapport'}
          reportFile={oldReportFile}
          setReportFile={setOldReportFile}
        />

        <FileDropZone
          title={'Nouveau Rapport'}
          reportFile={newReportFile}
          setReportFile={setNewReportFile}
        />

      </Grid>
      <Box textAlign='center' mt={4}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
        >
          Afficher le résultat
        </Button>

        <Button
          variant='contained'
          color='primary'
          onClick={handleLoginSubmit}
        >
          Se connecter à L'API
        </Button>
      </Box>
    </Box>
  );
};

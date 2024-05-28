import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import FileDropZone from '../components/FileDropZone';
import { useNavigate } from 'react-router-dom';
import { useState } from 'preact/hooks';
import { compareReports } from '../services/comparisonService';

export const HomePage = () => {
  let navigate = useNavigate();

  const [oldReportFile, setOldReportFile] = useState(null);
  const [newReportFile, setNewReportFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldReportFile || !newReportFile) {
      console.error('Veuillez télécharger les deux fichiers PDF.');
      return;
    }

    setLoading(true);

    try {
      const comparisonResult = await compareReports(
        oldReportFile,
        newReportFile
      );
      navigate('/results', { state: { comparisonResult } });
    } catch (error) {
      console.error(
        'Erreur lors de la comparaison des rapports. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      display={'flex'}
      justifyContent='center'
      textAlign={'left'}
      sx={{ p: 4 }}
    >
      <Typography variant='headerTitle' width={'83%'}>
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
      <Box
        mt={4}
        display={'flex'}
        flexDirection={'column'}
        textAlign='center'
        alignItems='center'
      >
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          disabled={loading}
        >
          Afficher le résultat
          {loading && (
            <CircularProgress
              color='primary'
              size={30}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>

        {loading && (
          <Typography variant='textInfoLittle' mt={1}>
            Le traitement peut mettre quelques instants, veuillez patienter...
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

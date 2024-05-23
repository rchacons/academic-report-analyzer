import { Box, Button, Grid, Typography } from '@mui/material';
import FileDropZone from '../components/FileDropZone';
import { useNavigate } from 'react-router-dom';
import { useState } from 'preact/hooks';

export const HomePage = () => {
  let navigate = useNavigate();

  const [oldReportFile, setOldReportFile] = useState(null);
  const [newReportFile, setNewReportFile] = useState(null);

  const handleSubmit = () => {
    console.log('Old report file:', oldReportFile);
    console.log('New report file:', newReportFile);
    navigate('/results');
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
      </Box>
    </Box>
  );
};

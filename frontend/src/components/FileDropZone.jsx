import { Box, Button, Grid, Typography } from '@mui/material';
import { useCallback } from 'preact/hooks';
import { useDropzone } from 'react-dropzone';
import uploadFile from '../assets/upload_file.svg';

function FileDropZone({ title, reportFile, setReportFile }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && file.type === 'application/pdf') {
        setReportFile(file);
      } else {
        alert('Veuillez télécharger un fichier au format PDF.');
      }
    },
    [setReportFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  const handleReportFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setReportFile(file);
    } else {
      alert('Veuillez télécharger un fichier au format PDF.');
    }
  };

  return (
    <Grid item xs={12} md={5}>
      <Box
        {...getRootProps()}
        display='flex'
        flexDirection='column'
        gap={1}
        textAlign='center'
        justifyContent='center'
        alignItems='center'
        border={1}
        borderRadius={1}
        p={'3vh'}
        borderColor='grey.300'
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'primary.lighter',
          },
        }}
      >
        <input
          {...getInputProps()}
          hidden
          onChange={handleReportFileChange}
          accept='application/pdf'
        />

        <Typography variant='cardTitle' gutterBottom>
          {title}
        </Typography>

        <img className='uploadImg' src={uploadFile}></img>

        <Button variant='outlined' color={'primary'}>
          Télécharger un fichier
        </Button>

        {isDragActive ? (
          <Typography variant='textInfo' mt={1}>
            Déposez le fichier ici ...
          </Typography>
        ) : (
          <Typography variant='textInfo' mt={1}>
            Ou faite glisser un fichier ici
          </Typography>
        )}
      </Box>
      {reportFile && (
        <Typography variant='body2' sx={{ mt: 2 }}>
          Fichier chargé : {reportFile.name}
        </Typography>
      )}
    </Grid>
  );
}

export default FileDropZone;

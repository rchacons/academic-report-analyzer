import { Box, Button, Grid, Typography } from '@mui/material';
import { useCallback } from 'preact/hooks';
import { useDropzone } from 'react-dropzone';
import uploadFile from '../assets/upload_file.svg';

const FileDropZone = ({ title, reportFile, setReportFile, displayMessage }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && (file.type === 'application/pdf' || file.type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        if (file.size <= 5242880) {
          setReportFile(file);
        } else {
          displayMessage('La taille du fichier doit être inférieur à 5 Mo');
        }
      } else {
        displayMessage('Veuillez charger un fichier au format pdf ou xlsx');
      }
    },
    [setReportFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
  });

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
        <input {...getInputProps()} hidden onChange={onDrop} />

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
            Ou faites glisser un fichier ici
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
};

export default FileDropZone;

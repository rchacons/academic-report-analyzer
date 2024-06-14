import { Box, Button, Grid, Tooltip, Typography } from '@mui/material'
import { useCallback } from 'preact/hooks'
import { useDropzone } from 'react-dropzone'
import uploadFile from '../assets/upload_file.svg'

const FileDropZone = ({ title, file, setFile, displayMessage, acceptedMimeType, tooltip }) => {
  const getAcceptedExtensions = () => {
    return Object.values(acceptedMimeType).flat().join(', ')
  }

  const isFileTypeAccepted = (fileType) => {
    return Object.keys(acceptedMimeType).includes(fileType)
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]

      if (file && isFileTypeAccepted(file.type)) {
        if (file.size <= 5242880) {
          setFile(file)
        } else {
          displayMessage('La taille du fichier doit être inférieur à 5 Mo')
        }
      } else {
        const acceptedExtensions = getAcceptedExtensions(acceptedMimeType)

        displayMessage(`Veuillez charger un fichier au format accepté (${acceptedExtensions})`)
      }
    },
    [setFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeType,
  })

  return (
    <Grid item xs={12} md={4}>
      <Tooltip title={tooltip}>
        <Box
          {...getRootProps()}
          display="flex"
          flexDirection="column"
          gap={1}
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          border={1}
          borderRadius={1}
          p={'1vh'}
          borderColor="grey.300"
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            },
          }}
        >
          <input {...getInputProps()} hidden onChange={onDrop} />

          <Typography variant="cardTitle" gutterBottom>
            {title}
          </Typography>

          <img className="uploadImg" src={uploadFile}></img>

          <Button variant="outlined" color={'primary'} size="small">
            Télécharger un fichier
          </Button>

          {isDragActive ? (
            <Typography variant="textInfo" mt={1}>
              Déposez le fichier ici ...
            </Typography>
          ) : (
            <Typography variant="textInfo" mt={1}>
              Ou faites glisser un fichier ici
            </Typography>
          )}
        </Box>
      </Tooltip>
      {file && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Fichier chargé : {file.name}
        </Typography>
      )}
    </Grid>
  )
}

export default FileDropZone

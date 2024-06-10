import {
  Box,
  Grid,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import FileDropZone from '../components/FileDropZone'
import { useNavigate } from 'react-router-dom'
import { useState } from 'preact/hooks'
import { compareBiblio, compareReports } from '../services/ComparisonService'
import LoadingButton from '../components/shared/LoadingButton'

export const HomePage = () => {
  let navigate = useNavigate()

  const [firstFile, setFirstFile] = useState(null)
  const [secondFile, setSecondFile] = useState(null)
  const [thirdFile, setThirdFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [comparisonType, setComparisonType] = useState('report')

  const handleComparisonTypeChange = (event) => {
    setComparisonType(event.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!firstFile || !secondFile) {
      displayMessage('Veuillez charger les deux documents')
      return
    }
    setLoading(true)

    comparisonType == 'report' ? handleReportComparison() : handleBiblioComparison()
  }

  const handleReportComparison = async () => {
    try {
      const comparisonResult = await compareReports(firstFile, secondFile, thirdFile)
      navigate('/results/report', { state: { comparisonResult } })
    } catch (error) {
      displayMessage('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleBiblioComparison = async () => {
    try {
      const comparisonResult = await compareBiblio(firstFile, secondFile)
      navigate('/results/biblio', { state: { comparisonResult } })
    } catch (error) {
      displayMessage('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const displayMessage = (message) => {
    setMessage(message)
    setOpen(true)
  }

  return (
    <Grid
      container
      spacing={2}
      display={'flex'}
      justifyContent="center"
      textAlign={'left'}
      sx={{ p: 4 }}
    >
      <Grid item md={12}>
        <Tooltip title={'Que souhaitez-vous comparer ?'}>
          <ToggleButtonGroup
            color="primary"
            value={comparisonType}
            exclusive
            onChange={(event) => handleComparisonTypeChange(event)}
            aria-label="Comparison-type"
          >
            <ToggleButton value="report">Rapports de jury</ToggleButton>
            <ToggleButton value="biblio">Bibliographies</ToggleButton>
          </ToggleButtonGroup>
        </Tooltip>
      </Grid>

      {comparisonType == 'report' ? (
        <Typography variant="headerTitle">Comparer les rapports de jury CAPES</Typography>
      ) : (
        <Typography variant="headerTitle">Comparer les bibliographies</Typography>
      )}

      <Grid container spacing={1} justifyContent="center">
        <FileDropZone
          title={'Ancien Fichier'}
          file={firstFile}
          setFile={setFirstFile}
          displayMessage={displayMessage}
          acceptedMimeType={{
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          }}
          tooltip={'Chargez le premier fichier à comparer'}
        />

        <FileDropZone
          title={'Nouveau Fichier'}
          file={secondFile}
          setFile={setSecondFile}
          displayMessage={displayMessage}
          acceptedMimeType={{
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          }}
          tooltip={'Chargez le second fichier à comparer'}
        />

        {comparisonType == 'report' ? (
          <FileDropZone
            title={'Liste des thèmes (Optionnel)'}
            file={thirdFile}
            setFile={setThirdFile}
            displayMessage={displayMessage}
            acceptedMimeType={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            }}
            tooltip={'Chargez une liste de thèmes pour les associer aux sujets'}
          />
        ) : (
          <></>
        )}
      </Grid>

      <Box mt={4} display={'flex'} flexDirection={'column'} textAlign="center" alignItems="center">
        <LoadingButton onClick={handleSubmit} loading={loading} />

        {loading && (
          <Typography variant="textInfoLittle" mt={1}>
            Le traitement peut mettre quelques instants, veuillez patienter...
          </Typography>
        )}
      </Box>

      <Snackbar
        warning
        ContentProps={{ warning: true }}
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </Grid>
  )
}

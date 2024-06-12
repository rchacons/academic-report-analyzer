import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getRdfGraph } from '../services/RdfService'
import GraphComponent from '../components/GraphComponent'

const RelatedConceptPage = () => {
  const location = useLocation()

  const { id, text } = location.state

  const [loading, setLoading] = useState(true)
  const [rdfGraph, setRdfGraph] = useState(null)
  const [wikiUrl, setWikiUrl] = useState('')

  const handleNodeClick = (url) => {
    setWikiUrl(url)
  }

  const handleGetRdfGraph = async () => {
    try {
      const rdfGraph = await getRdfGraph({ text })
      setRdfGraph(rdfGraph)
      localStorage.setItem('rdfGraph', JSON.stringify({ id, rdfGraph }))
      localStorage.setItem('rdfGraphTimestamp', Date.now())
    } catch (error) {
      console.error('Une erreur est survenue', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cachedRdfGraph = localStorage.getItem('rdfGraph')
    const cachedTimestamp = localStorage.getItem('rdfGraphTimestamp')
    const cacheDuration = 1000 * 60 * 60 // 1 hour

    if (cachedRdfGraph && cachedTimestamp && Date.now() - cachedTimestamp < cacheDuration) {
      const cachedData = JSON.parse(cachedRdfGraph)
      console.log('cachedData.id', cachedData.id)
      console.log('id', id)

      if (cachedData.id === id) {
        setRdfGraph(cachedData.rdfGraph)
        setLoading(false)
      } else {
        handleGetRdfGraph()
      }
    } else {
      handleGetRdfGraph()
    }
  }, [text, id])

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            m: 4,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" mt={1}>
            Le traitement peut mettre quelques instants, veuillez patienter...
          </Typography>
        </Box>
      ) : (
        rdfGraph && (
          <Grid container spacing={2} padding={'2em'}>
            <Grid item md={6} xs={12} sx={{ height: 800, width: 800 }}>
              <Box display={'flex'} flexDirection={'column'} textAlign={'center'} mt={2}>
                <Typography variant="headerTitle">Concepts Liés</Typography>
                <Typography variant="textInfo">
                  Cliquer sur un noeud pour afficher la page wikipédia
                </Typography>
              </Box>
              <GraphComponent rdfGraph={rdfGraph} onNodeClick={handleNodeClick} />
            </Grid>
            <Grid item md={6} xs={12} mt={4}>
              {wikiUrl && (
                <Box sx={{ height: '80vh', overflow: 'auto' }}>
                  <iframe src={wikiUrl} title="Wiki Page" width="100%" height="100%"></iframe>
                </Box>
              )}
            </Grid>
          </Grid>
        )
      )}
    </Box>
  )
}

export default RelatedConceptPage

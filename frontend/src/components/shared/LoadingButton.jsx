import { Button, CircularProgress } from '@mui/material'

const LoadingButton = ({ onClick, loading }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick} disabled={loading}>
      Afficher le résultat
      {loading && (
        <CircularProgress
          color="primary"
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
  )
}

export default LoadingButton

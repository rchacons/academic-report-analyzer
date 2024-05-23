import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Step 1: Create the base theme
let baseTheme = createTheme({
  palette: {
    primary: {
      main: '#0d6efd',
      light: '#9ebcf5',
      lighter: '#D2E1FE',
      dark: '#9ebcf5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#2196f3',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#fafafa', // Couleur de fond par défaut
      paper: '#fff', // Couleur de fond des éléments "papier" comme les cartes
    },
    text: {
      primary: '#000', // Couleur du texte principal
      secondary: '#757575', // Couleur du texte secondaire
    },
    gray: {
      light: '#f8f9fa',
    },
  }, // palette

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontSize: 30,
      color: 'black',
      padding: 20,
      fontWeight: 600,
    },
    headerTitle: {
      fontSize: '3rem',
      color: '#1A1A1A',
      padding: 20,
      fontWeight: 600,
    },
    textInfo: {
      color: '#888',
    },
  }, // typography

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '1em 2em',
          borderRadius: '12px',
        },
      },
    },
  },
});

const theme = createTheme(baseTheme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
      variants: [
        {
          props: { thin: true },
          style: {
            padding: '8px 16px',
          },
        },
      ],
    },
  },
});

export default theme;

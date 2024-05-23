import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
    gray : {
      light: '#f8f9fa'
    },
  }, // palette

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3 : {
      fontSize: 30,
      color: "black",
      padding: 20,
      fontWeight: 600
    },
    headerTitle : {
      fontSize: '3rem',
      color: "#1A1A1A",
      padding: 20,
      fontWeight: 600
    },
    textInfo: {
      color: "#888"
    }
  }, // typography
});

export const setCSSVariables = (theme) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-main', theme.palette.primary.main);
  root.style.setProperty('--primary-light', theme.palette.primary.light);
  root.style.setProperty('--primary-dark', theme.palette.primary.dark);
  root.style.setProperty('--primary-contrastText', theme.palette.primary.contrastText);
  root.style.setProperty('--secondary-main', theme.palette.secondary.main);
  root.style.setProperty('--secondary-light', theme.palette.secondary.light);
  root.style.setProperty('--secondary-dark', theme.palette.secondary.dark);
  root.style.setProperty('--secondary-contrastText', theme.palette.secondary.contrastText);
};

export default theme;

import { createTheme } from '@mui/material/styles';

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
      default: '#fafafa',
      paper: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#757575',
    },
    gray: {
      light: '#f8f9fa',
    },
    white: {
      main: '#fafafa',
      paper: 'fff',
    },
    black: {
      main: '#000',
      light: '#1C1C1E',
    },
  }, // palette
});

const theme = createTheme(baseTheme, {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    headerTitle: {
      fontSize: 32,
      marginBottom: '20px',
      color: baseTheme.palette.black.light,
      fontWeight: 600,
      letterSpacing: 2,
    },
    cardTitle: {
      fontSize: 28,
      color: baseTheme.palette.black.light,
      padding: 0,
      margin: 0,
      fontWeight: 400,
    },
    textInfo: {
      color: '#888',
    },
    textInfoLittle: {
      color: '#888',
      fontSize: 12,
    },
  }, // typography

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 28px',
          fontSize: '12px',
          borderRadius: '8px',
          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            border: 'none',
          },
        },
      },
      variants: [
        {
          props: { thin: true },
          style: {
            fontSize: '12px',
            // padding: '4px 10px',
          },
        },
      ],
    },
    MuiPAper: {
      styleOverrides: {
        root: {
          '::-webkit-scrollbar': {
            width: '10px',
          },
        },
      },
      variants: [
        {
          props: { thin: true },
          style: {
            fontSize: '10px',
            // padding: '4px 10px',
          },
        },
      ],
    },
  },
});

export default theme;

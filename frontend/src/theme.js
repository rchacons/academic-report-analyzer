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
      main: '#f00',
      background: '#FA948D',
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
    tableRowTitle: {
      fontSize: 18,
      color: baseTheme.palette.primary.main,
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',

          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            border: 'none',
          },
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '0.5rem 2rem',

          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            border: 'none',
          },
        },
      },
    },

    MuiSnackbar: {
      styleOverrides: {
        root: {},
      },
      variants: [
        {
          props: { warning: true },
          style: {
            backgroundColor: baseTheme.palette.error.background,
            border: `1px solid ${baseTheme.palette.error.main}`,
            borderRadius: '8px',
            color: 'red',
            fontSize: '1rem',
          },
        },
      ],
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {},
      },
      variants: [
        {
          props: { warning: true },
          style: {
            backgroundColor: baseTheme.palette.error.background,
            borderRadius: '8px',
            color: 'red',
            fontSize: '1rem',
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
          /* Track */
          '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },

          /* Handle */
          '::-webkit-scrollbar-thumb': {
            background: '#888',
          },

          /* Handle on hover */
          '::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        },
      },
      variants: [
        {
          props: { thin: true },
          style: {
            fontSize: '10px',
          },
        },
      ],
    },
  },
});

export default theme;

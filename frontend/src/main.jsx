import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

import theme from './theme.js'

import { ThemeProvider } from '@mui/material/styles'
import { render } from 'preact'
import { App } from './app.jsx'

import { CssBaseline } from '@mui/material'

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('app')
)

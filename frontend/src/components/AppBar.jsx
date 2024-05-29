import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CompDocLogo from '../assets/compdoc_logo.svg';
import { ButtonBase } from '@mui/material';

import { useNavigate } from 'react-router-dom';

export default function AppBar() {
  let navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position='static' sx={{ boxShadow: 'none' }}>
        <Toolbar sx={{ backgroundColor: 'grey.100' }}>
          <Box sx={{ marginLeft: '10em' }}>
            <ButtonBase
              sx={{
                '&:focus': {
                  outline: 'none',
                },
                '&:active': {
                  border: 'none',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => navigate('/')}
            >
              <img src={CompDocLogo} />
            </ButtonBase>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}

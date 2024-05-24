import { Box, Button, ButtonGroup, Grid, Tooltip } from '@mui/material';
import { useState } from 'preact/hooks';

import ReportsTable from '../components/ReportsTable';
import EquipmentList from '../components/EquipmentList';

export const ResultPage = () => {
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('second');
  const resultButtons = [
    <Button
      key='new_subjects'
      thin
      variant={
        activeSubjectFilter === 'new_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setActiveSubjectFilter('new_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Sujet ajoutés (165 sur 531)
    </Button>,
    <Button
      key='deleted_subjects'
      thin
      variant={
        activeSubjectFilter === 'deleted_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setActiveSubjectFilter('deleted_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Sujet supprimés (365 sur 531)
    </Button>,
    <Button
      key='kept_subjects'
      thin
      variant={
        activeSubjectFilter === 'kept_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setActiveSubjectFilter('kept_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Sujet gardés (1 sur 531)
    </Button>,
  ];

  return (
    <Grid container spacing={2} justifyContent='space-between' p='2em'>

      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            '& > *': {
              m: 1,
            },
          }}
        >
          <ButtonGroup size='large' aria-label='Large button group'>
            {resultButtons}
          </ButtonGroup>
        </Box>
      </Grid>

      <Grid item xs={12} md={2} >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'right',
          }}
        >
          <Tooltip title='Exporter les éléments sélectionnés au format xlsx'>
            <Button variant='outlined' thin color='primary' onClick={() => {}}>
              Exporter
            </Button>
          </Tooltip>
        </Box>
      </Grid>

        <Grid item xs={12} md={8}>
          <ReportsTable />
        </Grid>

        <Grid item xs={12} md={4}>
          <EquipmentList />
        </Grid>

    </Grid>
  );
};

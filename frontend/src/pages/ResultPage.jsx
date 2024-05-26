import { Box, Button, ButtonGroup, Grid, Tooltip } from '@mui/material';
import { useEffect, useState } from 'preact/hooks';

import ReportsTable from '../components/ReportsTable';
import EquipmentList from '../components/EquipmentList';
import { useLocation } from 'react-router-dom';

export const ResultPage = () => {
  const location = useLocation();
  const [addedSubjects, setAddedSubjects] = useState([]);
  const [removedSubjects, setRemovedSubjects] = useState([] );
  const [keptSubjects, setKeptSubjects] = useState([]);

  const { comparisonResult } = location.state || {};

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('second');
  const resultButtons = [
    <Button
      key='new_subjects'
      thin
      variant={
        activeSubjectFilter === 'new_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setActiveSubjectFilter('new_subjects')}
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

  useEffect(() => {
    if (comparisonResult) {
      setAddedSubjects(comparisonResult.added_subjects);
      setRemovedSubjects(comparisonResult.removed_subjects);
      setKeptSubjects(comparisonResult.kept_subjects);
    }


    return () => {};
  }, []);

  return (
    <Grid container spacing={2} justifyContent='space-between' p='2em'>
      <Grid item xs={12} md={8}>
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

      <Grid item xs={12} md={2}>
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

      {keptSubjects ? (
        <pre>{JSON.stringify(keptSubjects, null, 2)}</pre>
      ) : (
        <Typography>Pas de résultats disponibles.</Typography>
      )}

      <Grid item xs={12} md={8}>
        <ReportsTable />
      </Grid>

      <Grid item xs={12} md={4}>
        <EquipmentList />
      </Grid>
    </Grid>
  );
};

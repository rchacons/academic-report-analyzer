import { Box, Button, ButtonGroup, Grid, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'preact/hooks';

import ReportsTable from '../components/ReportsTable';
import EquipmentList from '../components/EquipmentList';
import { useLocation } from 'react-router-dom';

export const ResultPage = () => {
  const location = useLocation();

  const { comparisonResult } = location.state || {};
  const newSubjects = Object.entries(comparisonResult.added_subjects);
  const removedSubjects = Object.entries(comparisonResult.removed_subjects);
  const keptSubjects = Object.entries(comparisonResult.kept_subjects);
  const identicalSubjects = Object.entries(comparisonResult.identical_subjects);
  const numberOfSubjects =
    newSubjects.length +
    removedSubjects.length +
    keptSubjects.length +
    identicalSubjects.length;

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('');
  const [displayedSubjects, setDisplayedSubjects] = useState([]);

  const setSubjectsToDisplay = (subjectFilter) => {
    console.log(`dispay ${subjectFilter}`);
    switch (subjectFilter) {
      case 'new_subjects':
        setActiveSubjectFilter(subjectFilter);
        setDisplayedSubjects(newSubjects);
        break;
      case 'removed_subjects':
        setActiveSubjectFilter(subjectFilter);
        setDisplayedSubjects(removedSubjects);
        break;
      case 'kept_subjects':
        setActiveSubjectFilter(subjectFilter);
        setDisplayedSubjects(keptSubjects);
        break;
      case 'identical_subjects':
        setDisplayedSubjects(identicalSubjects);
        setActiveSubjectFilter(subjectFilter);
        break;
    }
  };

  const subjectFilterButtons = [
    <Button
      key='new_subjects'
      thin
      variant={
        activeSubjectFilter === 'new_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('new_subjects')}
    >
      Sujet ajoutés ({newSubjects.length} sur {numberOfSubjects})
    </Button>,

    <Button
      key='removed_subjects'
      thin
      variant={
        activeSubjectFilter === 'removed_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('removed_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Sujet supprimés ({removedSubjects.length} sur {numberOfSubjects})
    </Button>,
    <Button
      key='kept_subjects'
      thin
      variant={
        activeSubjectFilter === 'kept_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('kept_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Sujet gardés ({keptSubjects.length} sur {numberOfSubjects})
    </Button>,
    <Button
      key='identical_subjects'
      thin
      variant={
        activeSubjectFilter === 'identical_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('identical_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Sujet identiques ({identicalSubjects.length} sur {numberOfSubjects})
    </Button>,
  ];

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Grid container spacing={2} justifyContent='space-between' p='1em 2em'>
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
            {subjectFilterButtons}
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

      {displayedSubjects && displayedSubjects.length !== 0 ? (
        <pre>{JSON.stringify(displayedSubjects, null, 2)}</pre>
      ) : (
        <Typography> Pas de données à afficher</Typography>
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

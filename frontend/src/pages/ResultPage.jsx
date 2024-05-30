import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'preact/hooks';

import ReportsTable from '../components/ReportsTable';
import EquipmentList from '../components/EquipmentList';
import { useLocation } from 'react-router-dom';
import MultipleSelectChip from '../components/shared/MultipleSelectChip';

export const ResultPage = () => {
  const location = useLocation();

  const { comparisonResult } = location.state || {};
  const newSubjects = comparisonResult.added_subjects;
  const removedSubjects = comparisonResult.removed_subjects;
  const keptSubjects = comparisonResult.kept_subjects;
  const numberOfSubjects =
    newSubjects.length +
    removedSubjects.length +
    keptSubjects.length;

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('');
  const [displayedSubjects, setDisplayedSubjects] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [filterLevels, setFilterLevels] = useState([]);
  const levels = ['3C', '4C'];

  const setSubjectsToDisplay = (subjectFilter) => {
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

      {/* {displayedSubjects && displayedSubjects.length !== 0 ? (
        <pre>{JSON.stringify(displayedSubjects, null, 2)}</pre>
      ) : (
        <Typography> Pas de données à afficher</Typography>
      )} */}

      {/*   <MultipleSelectChip
        name='Niveaux'
        items={['3C', '4C']}
        selectedValue={filterLevels}
        setSelectedValue={setFilterLevels}
      ></MultipleSelectChip> */}

      <Grid item xs={12} md={12}>
        <ReportsTable data={displayedSubjects} /* setData={setDisplayedSubjects} */ selectedMaterial={selectedMaterial} setSelectedMaterial={setSelectedMaterial} />
      </Grid>
{/*
      <Grid item xs={12} md={4}>
        <EquipmentList data={selectedMaterial} />
      </Grid> */}
    </Grid>
  );
};

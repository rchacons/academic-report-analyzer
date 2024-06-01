import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import MultipleSelectChip from '../components/shared/MultipleSelectChip';
import { useEffect, useState } from 'preact/hooks';

import ReportsTable from '../components/ReportsTable';
import { useLocation } from 'react-router-dom';
export const ResultPage = () => {
  const location = useLocation();

  const { comparisonResult } = location.state || {};
  const newSubjects = comparisonResult.added_subjects;
  const removedSubjects = comparisonResult.removed_subjects;
  const keptSubjects = comparisonResult.kept_subjects;
  const numberOfSubjects =
    newSubjects.length + removedSubjects.length + keptSubjects.length;

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('');
  const [displayedSubjects, setDisplayedSubjects] = useState([]);
  const [filterLevels, setFilterLevels] = useState([]);
  const [filterFields, setFilterFields] = useState([]);

  const levels = ['3C', '4C'];
  const fields = ['Bio', 'physique']; // Ajouter d'autres domaines si nécessaire

  const applyFilters = (subjects, levelsFilter, fieldsFilter) => {
    return subjects.filter(
      (subject) =>
        (levelsFilter.length === 0 || levelsFilter.includes(subject.level)) &&
        (fieldsFilter.length === 0 || fieldsFilter.includes(subject.field))
    );
  };

  const setSubjectsToDisplay = (subjectFilter) => {
    let subjects;
    switch (subjectFilter) {
      case 'new_subjects':
        subjects = newSubjects;
        break;
      case 'removed_subjects':
        subjects = removedSubjects;
        break;
      case 'kept_subjects':
        subjects = keptSubjects;
        break;
      default:
        subjects = [];
    }

    const filteredSubjects = applyFilters(subjects, filterLevels, filterFields);
    setActiveSubjectFilter(subjectFilter);
    setDisplayedSubjects(filteredSubjects);
  };

  const handleFilterLevelsChange = (event) => {
    const selectedLevels = event.target.value;
    setFilterLevels(selectedLevels);
    setSubjectsToDisplay(activeSubjectFilter);
  };

  const handleFilterFieldsChange = (event) => {
    const selectedFields = event.target.value;
    setFilterFields(selectedFields);
    setSubjectsToDisplay(activeSubjectFilter);
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
      Sujets ajoutés ({newSubjects.length} sur {numberOfSubjects})
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
      Sujets supprimés ({removedSubjects.length} sur {numberOfSubjects})
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
      Sujets gardés ({keptSubjects.length} sur {numberOfSubjects})
    </Button>,
  ];

  useEffect(() => {
    setSubjectsToDisplay(activeSubjectFilter);
  }, [filterLevels, filterFields]);

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

      <Grid item xs={12} md={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
          }}
        >
          <MultipleSelectChip
            name='Domaines'
            items={fields}
            selectedValue={filterFields}
            onChange={handleFilterFieldsChange}
          ></MultipleSelectChip>

          <MultipleSelectChip
            name='Niveaux'
            items={levels}
            selectedValue={filterLevels}
            onChange={handleFilterLevelsChange}
          ></MultipleSelectChip>

        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <ReportsTable data={displayedSubjects} />
      </Grid>
    </Grid>
  );
};

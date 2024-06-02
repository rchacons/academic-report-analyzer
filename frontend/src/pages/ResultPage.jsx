import { Box, Button, ButtonGroup, Grid, Tooltip } from '@mui/material';
import MultipleSelectChip from '../components/shared/MultipleSelectChip';
import { useEffect, useState } from 'preact/hooks';

import ReportsTable from '../components/ReportsTable';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { removeStopwords, fra } from 'stopword';
import SubjectsFilterButtons from '../components/SubjectsFilterButtons';

export const ResultPage = () => {
  const location = useLocation();

  const { comparisonResult } = location.state || {};
  const newSubjects = comparisonResult.added_subjects;
  const removedSubjects = comparisonResult.removed_subjects;
  const keptSubjects = comparisonResult.kept_subjects;
  const levels = comparisonResult.level_list;
  const fields = comparisonResult.field_list;
  const numberOfSubjects =
    newSubjects.length + removedSubjects.length + keptSubjects.length;

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('');
  const [displayedSubjects, setDisplayedSubjects] = useState([]);
  const [filterLevels, setFilterLevels] = useState([]);
  const [filterFields, setFilterFields] = useState([]);

  const applyFilters = (subjects, levelsFilter, fieldsFilter) => {
    return subjects.filter(
      (subject) =>
        (levelsFilter.length === 0 || levelsFilter.includes((subject.level).toLowerCase())) &&
        (fieldsFilter.length === 0 || fieldsFilter.includes((subject.field.toLowerCase())))
    );
  };

  const getSelectedSubjects = (subjectFilter) => {
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
    console.log(subjects);
    return subjects;
  };

  const setSubjectsToDisplay = (subjectFilter) => {
    let subjects = getSelectedSubjects(subjectFilter);

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
          <SubjectsFilterButtons
            setSubjectsToDisplay={setSubjectsToDisplay}
            activeSubjectFilter={activeSubjectFilter}
            newSubjects={newSubjects}
            removedSubjects={removedSubjects}
            keptSubjects={keptSubjects}
            numberOfSubjects={numberOfSubjects}
          />
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

          <SearchBar
            items={getSelectedSubjects(activeSubjectFilter)}
            onResults={setDisplayedSubjects}
          ></SearchBar>
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <ReportsTable data={displayedSubjects} />
      </Grid>
    </Grid>
  );
};

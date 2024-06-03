import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'react-router-dom';
import { Box, Button, Grid, Tooltip } from '@mui/material';
import MultipleSelectChip from '../components/shared/MultipleSelectChip';
import ReportsTable from '../components/ReportsTable';
import SearchBar from '../components/SearchBar';
import SubjectsFilterButtons from '../components/SubjectsFilterButtons';
import Fuse from 'fuse.js';
import { removeStopwords, fra } from 'stopword';

function tokenize(query) {
  const filteredText = removeStopwords(query.toLowerCase().split(' '), fra);
  return filteredText;
}

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
  const [searchQuery, setSearchQuery] = useState('');

  const applyFilters = (subjects, levelsFilter, fieldsFilter) => {
    return subjects.filter(
      (subject) =>
        (levelsFilter.length === 0 ||
          levelsFilter.includes(subject.level.toLowerCase())) &&
        (fieldsFilter.length === 0 ||
          fieldsFilter.includes(subject.field.toLowerCase()))
    );
  };

  function search(query, items) {
    if (!query) return items;

    const tokens = tokenize(query);
    console.log('tokenized query:', tokens);
    return items
      .map((item) => {
        let score = 0;

        tokens.forEach((token) => {
          if (item.title_research.toLowerCase().includes(token)) {
            score += 1;
          }
        });

        return { item, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);
  }

  /* const search = (query, subjects) => {
    if (!query) return subjects;

    const options = {
      keys: ['title', 'materials_configurations.materials'],
      threshold: 0.3,
    };

    const fuse = new Fuse(subjects, options);
    const result = fuse.search(query);

    return result.map(({ item, score }) => ({
      ...item,
      score,
      materials_configurations: item.materials_configurations.map((config) => {
        const materialFuse = new Fuse([config], {
          keys: ['materials'],
          threshold: 0.3,
        });
        const materialResult = materialFuse.search(query);
        const materialScore = materialResult.length > 0 ? materialResult[0].score : 1;
        return { ...config, score: materialScore };
      }),
    }));
  }; */

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
    return subjects;
  };

  const setSubjectsToDisplay = (subjectFilter) => {
    let subjects = getSelectedSubjects(subjectFilter);
    subjects = applyFilters(subjects, filterLevels, filterFields);
    subjects = search(searchQuery, subjects);
    setActiveSubjectFilter(subjectFilter);
    setDisplayedSubjects(subjects);
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

  const handleSearchResults = (query) => {
    setSearchQuery(query);
    setSubjectsToDisplay(activeSubjectFilter);
  };

  useEffect(() => {
    setSubjectsToDisplay(activeSubjectFilter);
  }, [filterLevels, filterFields, searchQuery]);

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

          <SearchBar onSearch={handleSearchResults}></SearchBar>
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <ReportsTable reports={displayedSubjects} />
      </Grid>
    </Grid>
  );
};

import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'react-router-dom';
import { Box, Button, Grid, Tooltip } from '@mui/material';
import MultipleSelectChip from '../components/shared/MultipleSelectChip';
import ReportsTable from '../components/ReportsTable';
import SearchBar from '../components/SearchBar';
import SubjectsFilterButtons from '../components/SubjectsFilterButtons';
import { tokenize } from '../utils';
import { exportSubjects } from '../services/exportService';
import SimpleSelect from '../components/shared/SimpleSelect';

export const BiblioResultPage = () => {
  const location = useLocation();

  const { comparisonResult } = location.state || {};


  const addedBooks = comparisonResult.added_subjects.map((item, index) => ({
    id: `nb${index}`,
    ...item,
  }));
  const removedBooks = comparisonResult.removed_subjects.map(
    (item, index) => ({ id: `rb${index}`, ...item })
  );
  const keptBooks = comparisonResult.kept_subjects.map((item, index) => ({
    id: `kb${index}`,
    ...item,
  }));
  const allBooks = addedBooks.concat(removedBooks).concat(keptBooks);


  const [activeBookFilter, setActiveBookFilter] =
    useState('added_books');
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [selectedBooks, setSelecetedBooks] = useState([]);



  const applyFilters = (subjects, levelsFilter, fieldsFilter, docFilter) => {
    return subjects.filter((subject) => {
      return (
        (levelsFilter.length === 0 ||
          levelsFilter.includes(subject.level.toLowerCase())) &&
        (fieldsFilter.length === 0 ||
          fieldsFilter.includes(subject.field.toLowerCase())) &&
        (docFilter === 0 || getOrigin(subject).includes(docFilter))
      );
    });
  };

  const search = (query, items) => {
    if (!query) return items;
    const tokens = tokenize(query.toLowerCase());
    console.log('tokenized query:', tokens);

    return items
      .map((item) => {
        // Calcul du score pour l'intitulé' de l'item
        let itemScore = 0;
        tokens.forEach((token) => {
          if (item.title_research.toLowerCase().includes(token)) {
            itemScore += 1;
          }
        });

        // Calcul des scores pour chaque liste de matériel
        const materialsScores = item.materials_configurations.map((config) => {
          let configScore = 0;
          tokens.forEach((token) => {
            config.materials.forEach((material) => {
              if (material.toLowerCase().includes(token)) {
                configScore += 1;
              }
            });
          });
          return { ...config, score: configScore };
        });

        // Tri listes de matériel par score décroissant
        materialsScores.sort((a, b) => b.score - a.score);

        // Score maximum parmi les listes de matériel
        const maxMaterialScore = Math.max(
          ...materialsScores.map((config) => config.score)
        );

        // Score global de l'item
        const totalScore = itemScore + maxMaterialScore;

        return {
          ...item,
          score: totalScore,
          materials_configurations: materialsScores,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  };


  const getBooksByType = (bookFilter) => {
    let books;
    switch (bookFilter) {
      case 'added_books':
        books = addedBooks;
        break;
      case 'removed_books':
        books = removedBooks;
        break;
      case 'kept_books':
        books = keptBooks;
        break;
      case 'all_books':
        books = allBooks;
        break;
      default:
        books = [];
    }
    return books;
  };

  const setBooksToDisplay = (booktFilter) => {
    let books = getBooksByType(booktFilter);
    books = applyFilters(books, filterLevels, filterFields, filterDoc);
    books = search(searchQuery, books);
    setActiveBookFilter(booktFilter);
    setDisplayedBooks(books);
  };

  const handleExportBooks = async () => {
    const booksToExport = allBooks
      .filter((subject) => selectedBooks.includes(subject.id))
      .map(({ id, ...rest }) => rest); // Exclure 'id' des éléments
    await exportSubjects(booksToExport);
  };

  useEffect(() => {
    setBooksToDisplay(activeBookFilter);
  }, []);

  return (
    <Grid container spacing={2} justifyContent='space-between' p='1em 2em'>
      <Grid item xs={12} md={10}>
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
            itemsType={'Livres'}
            setitemsToDisplay={setBooksToDisplay}
            activeItemtFilter={activeBookFilter}
            addedItems={addedBooks}
            removedItems={removedBooks}
            keptItems={keptBooks}
            allItems={allBooks}
            keys={['added_books','removed_books','kept_books','all_books']}
            numberOfItems={allBooks.length}
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
            <Button
              variant='outlined'
              thin
              color='primary'
              onClick={handleExportBooks}
            >
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
              m: 0.5,
            },
          }}
        >
        {/*   <MultipleSelectChip
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

          <SimpleSelect
            name='Document'
            items={[1, 2]}
            selectedValue={filterDoc}
            onChange={handleFilterDocChange}
          />

          <SearchBar onSearch={handleSearchResults}></SearchBar> */}
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <ReportsTable
          reports={displayedBooks}
          selected={selectedBooks}
          setSelectedSubjects={setSelecetedBooks}
        />
      </Grid>
    </Grid>
  );
};

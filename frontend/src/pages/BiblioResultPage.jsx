import { useEffect, useState } from 'preact/hooks'
import { useLocation } from 'react-router-dom'
import { Autocomplete, Box, Button, Grid, TextField, Tooltip } from '@mui/material'
import MultipleSelectChip from '../components/shared/MultipleSelectChip'
import ReportsTable from '../components/ReportsTable'
import SearchBar from '../components/SearchBar'
import SubjectsFilterButtons from '../components/SubjectsFilterButtons'
import { tokenize } from '../utils'
import { exportSubjects } from '../services/ExportService'
import SimpleSelect from '../components/shared/SimpleSelect'
import comparisonResult from '../assets/book_response.json'
import BiblioTable from '../components/BiblioTable'

export const BiblioResultPage = () => {
  const location = useLocation()

  // const { comparisonResult } = location.state || {};

  // const { comparisonResult } = data || {};
  console.log(comparisonResult)

  const addedBooks = comparisonResult.added_books.map((item, index) => ({
    id: `nb${index}`,
    ...item,
  }))
  const removedBooks = comparisonResult.removed_books.map((item, index) => ({
    id: `rb${index}`,
    ...item,
  }))
  const keptBooks = comparisonResult.kept_books.map((item, index) => ({
    id: `kb${index}`,
    ...item,
  }))
  const allBooks = addedBooks.concat(removedBooks).concat(keptBooks)

  const authors = comparisonResult.author_list

  const [filterAuthor, setFilterAuthor] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [activeBookFilter, setActiveBookFilter] = useState('added_books')
  const [displayedBooks, setDisplayedBooks] = useState([])
  const [selectedBooks, setSelecetedBooks] = useState([])

  const applyFilters = (books, authorFilter) => {
    return books.filter((book) => {
      return (
        // (levelsFilter.length === 0 || levelsFilter.includes(subject.level.toLowerCase())) &&
        // (fieldsFilter.length === 0 || fieldsFilter.includes(subject.field.toLowerCase())) &&
        // (docFilter === 0 || getOrigin(subject).includes(docFilter)) &&
        authorFilter === '' || book.author === authorFilter
      )
    })
  }

  const search = (query, items) => {
    if (!query) return items
    const tokens = tokenize(query.toLowerCase())
    console.log('tokenized query:', tokens)

    return items
      .map((item) => {
        // Calcul du score pour l'intitulé' de l'item
        let itemScore = 0
        tokens.forEach((token) => {
          if (item.book_name.toLowerCase().includes(token)) {
            itemScore += 1
          }
        })

        return {
          ...item,
          score: itemScore,
        }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
  }

  const getBooksByType = (bookFilter) => {
    let books
    switch (bookFilter) {
      case 'added_books':
        books = addedBooks
        break
      case 'removed_books':
        books = removedBooks
        break
      case 'kept_books':
        books = keptBooks
        break
      case 'all_books':
        books = allBooks
        break
      default:
        books = []
    }
    return books
  }

  const setBooksToDisplay = (bookFilter) => {
    console.log("bookFilter", bookFilter);
    let books = getBooksByType(bookFilter)
    books = applyFilters(books, filterAuthor)
    books = search(searchQuery, books)
    setActiveBookFilter(bookFilter)
    setDisplayedBooks(books)
  }

  const handleExportBooks = async () => {
    const booksToExport = allBooks
      .filter((book) => selectedBooks.includes(book.id))
      .map(({ id, ...rest }) => rest) // Exclure 'id' des éléments
    await exportSubjects(booksToExport)
  }

  const handleFilterAuthorChange = (event, value) => {
    setFilterAuthor(value)
    setBooksToDisplay(activeBookFilter)
  }

  const handleSearchResults = (query) => {
    setSearchQuery(query)
    setBooksToDisplay(activeBookFilter)
  }

  useEffect(() => {
    setBooksToDisplay(activeBookFilter)
  }, [filterAuthor, searchQuery])

  return (
    <Grid container spacing={2} justifyContent="space-between" p="1em 2em">
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
            keys={['added_books', 'removed_books', 'kept_books', 'all_books']}
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
          <Tooltip title="Exporter les éléments sélectionnés au format xlsx">
            <Button variant="outlined" thin color="primary" onClick={handleExportBooks}>
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
          <Autocomplete
            disablePortal
            disabled={authors.length == 0}
            id="author-filter"
            options={authors}
            size="small"
            sx={{ width: 300 }}
            value={filterAuthor}
            onChange={handleFilterAuthorChange}
            renderInput={(params) => <TextField {...params} label="Auteurs" />}
          />

          <SearchBar onSearch={handleSearchResults}></SearchBar>
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <BiblioTable
          books={displayedBooks}
          // selected={selectedBooks}
          setSelectedBooks={setSelecetedBooks}
        />
      </Grid>
    </Grid>
  )
}

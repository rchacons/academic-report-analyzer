import { useEffect, useState } from 'preact/hooks'
import { useLocation } from 'react-router-dom'
import { Autocomplete, Box, Button, Grid, TextField, Tooltip } from '@mui/material'
import SearchBar from '../components/SearchBar'
import SubjectsFilterButtons from '../components/SubjectsFilterButtons'
import { tokenize } from '../utils'
import SimpleSelect from '../components/shared/SimpleSelect'
import BiblioTable from '../components/BiblioTable'
import { exportData } from '../services/ExportService'

export const BiblioResultPage = () => {
  const location = useLocation()

  const { comparisonResult } = location.state || {}

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

  const authors = comparisonResult.author_list || []

  const [filterDoc, setFilterDoc] = useState(0)
  const [filterAuthor, setFilterAuthor] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [activeBookFilter, setActiveBookFilter] = useState('added_books')
  const [displayedBooks, setDisplayedBooks] = useState([])
  const [selectedBooks, setSelecetedBooks] = useState([])

  const applyFilters = (books, authorFilter, docFilter) => {
    return books.filter((book) => {
      return (
        (docFilter === 0 || book.origin.includes(docFilter)) &&
        (authorFilter === '' || book.author === authorFilter)
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
    let books = getBooksByType(bookFilter)
    books = applyFilters(books, filterAuthor, filterDoc)
    books = search(searchQuery, books)
    setActiveBookFilter(bookFilter)
    setDisplayedBooks(books)
  }

  const handleExportBooks = async () => {
    const booksToExport = allBooks
      .filter((book) => selectedBooks.includes(book.id))
      .map(({ id, origin, ...rest }) => rest) // Exclure 'id' et 'origin' des éléments
    await exportData(booksToExport, 'liste_livres')
  }

  const handleFilterDocChange = (event) => {
    const selectedDoc = event.target.value
    setFilterDoc(selectedDoc)
    setBooksToDisplay(activeBookFilter)
  }

  const handleFilterAuthorChange = (event, value) => {
    setFilterAuthor(value || '')
    setBooksToDisplay(activeBookFilter)
  }

  const handleSearchResults = (query) => {
    setSearchQuery(query)
    setBooksToDisplay(activeBookFilter)
  }

  useEffect(() => {
    setBooksToDisplay(activeBookFilter)
  }, [filterDoc, filterAuthor, searchQuery])

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
          <SimpleSelect
            name="Document"
            items={[1, 2]}
            selectedValue={filterDoc}
            onChange={handleFilterDocChange}
          />

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
        <BiblioTable books={displayedBooks} setSelectedBooks={setSelecetedBooks} />
      </Grid>
    </Grid>
  )
}

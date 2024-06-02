import { useState } from 'preact/hooks';
import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { removeStopwords, fra } from 'stopword';

function tokenize(query) {
  const filteredText = removeStopwords(query.split(' '), fra);
  return filteredText;
}

function search(query, items) {
  const tokens = tokenize(query);
  console.log('tokenized query:', tokens);
  return items
    .map((item) => {
      let score = 0;

      tokens.forEach((token) => {
        if (item.title.includes(token)) {
          score += 1;
        }
        /* if (item.materials_configurations.material.includes(token)) {
          score += 1;
        } */
      });

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}

const SearchBar = ({ items, onResults }) => {
  const [query, setQuery] = useState('');


  const handleSearch = () => {
    const results = search(query, items);
    onResults(results);
  };

  return (
    <Box display='flex' alignItems='center' gap={2} width={'30em'}>
      <TextField
        variant='outlined'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Rechercher un sujet ou du matériel...'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
      />
    </Box>
  );
};

export default SearchBar;

import { useState } from 'preact/hooks';
import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
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

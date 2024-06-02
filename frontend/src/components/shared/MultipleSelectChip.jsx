import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

export default function MultipleSelectChip({
  name,
  items,
  selectedValue,
  onChange,
}) {
  const theme = useTheme();

  return (
    <Box>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={`filter-${name}-label`}>{name}</InputLabel>
        <Select
          sx={{ height: 55 }}
          labelId={`filter-${name}-label`}
          id={`filter-${name}`}
          multiple
          value={selectedValue}
          onChange={onChange}
          input={<OutlinedInput id={`filter-${name}-chip`} label={name} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.black.light,
                  }}
                />
              ))}
            </Box>
          )}
        >
          {items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

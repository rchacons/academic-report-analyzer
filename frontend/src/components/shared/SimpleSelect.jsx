import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const SimpleSelect = ({ name, items, selectedValue, onChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id={`${name}-select-label`}>{name}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        value={selectedValue}
        label={name}
        onChange={onChange}
      >
        <MenuItem key={0} value={0}>
          1 et 2
        </MenuItem>
        {items.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
export default SimpleSelect

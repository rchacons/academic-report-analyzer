import { Box, Button } from '@mui/material';

const TabButton = ({label1, label2}) => {
  return (
    <Box display={'flex'}>
      <Button variant='tab'>{label1}</Button>
      <Button variant='tab'>{label2}</Button>
    </Box>
  );
};

export default TabButton;

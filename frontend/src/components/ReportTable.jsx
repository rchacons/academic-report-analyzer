import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Checkbox } from '@mui/material';
import { useState } from 'preact/hooks';

function createData(name, subject, level, lesson, related_concepts) {
  return { name, subject, level, lesson, related_concepts };
}

const rows = [
  createData(159, 6.0, 24, 4.0),
  createData(237, 9.0, 37, 4.3),
  createData(262, 16.0, 24, 6.0),
  createData(305, 3.7, 67, 4.3),
  createData(356, 16.0, 49, 3.9),
];

function ReportTable() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='report table'>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                color='primary'
                // indeterminate={numSelected > 0 && numSelected < rowCount}
                // checked={rowCount > 0 && numSelected === rowCount}
                onChange={handleSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            </TableCell>
            {/* <TableCell>Dessert (100g serving)</TableCell> */}
            <TableCell align='right'>Matière</TableCell>
            <TableCell align='right'>Niveau</TableCell>
            <TableCell align='right'>Leçon</TableCell>
            <TableCell align='right'>Concepts Liés</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.subject}</TableCell>
              <TableCell align='right'>{row.level}</TableCell>
              <TableCell align='right'>{row.lesson}</TableCell>
              <TableCell align='right'>{row.related_concepts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReportTable;

import PropTypes from 'prop-types'
import { alpha, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { visuallyHidden } from '@mui/utils'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'preact/hooks'
import Collapse from '@mui/material/Collapse'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const createData = ({ id, field, level, title, theme, materials_configurations, score = 0 }) => {
  return { id, field, level, title, theme, materials_configurations, score }
}

const headCells = [
  { id: 'field', numeric: false, disablePadding: false, label: 'Domaine' },
  { id: 'level', numeric: false, disablePadding: false, label: 'Niveau' },
  { id: 'title', numeric: false, disablePadding: false, label: 'Intitulé' },
  { id: 'theme', numeric: false, disablePadding: false, label: 'Thème' },

  {
    id: 'related_concepts',
    numeric: false,
    disablePadding: false,
    label: 'Concepts liés',
  },
]

const EnhancedTableHead = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all reports' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="left">Matériels</TableCell>
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, numberOfSubjects } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} sélectionné(s)
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Rapports de Jury - {numberOfSubjects} résultat(s)
        </Typography>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  numberOfSubjects: PropTypes.number.isRequired,
}

const mergeMaterialConfigurations = (materials_configurations) => {
  const merged = {}

  materials_configurations.forEach((config) => {
    const key = config.materials.join(',')

    if (merged[key]) {
      merged[key].origin = `${merged[key].origin} et ${config.origin}`
    } else {
      merged[key] = { ...config }
    }
  })

  const origin1 = []
  const origin2 = []

  Object.values(merged).forEach((config) => {
    if (config.origin == '1') {
      origin1.push(config)
    } else {
      origin2.push(config)
    }
  })

  return [...origin1, ...origin2]
}

const CollapsibleRow = ({ row, isItemSelected, handleClick }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const mergedMaterials = mergeMaterialConfigurations(row.materials_configurations)

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        // selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onChange={(event) => handleClick(event, row)}
            inputProps={{
              'aria-labelledby': `enhanced-table-checkbox-${row.id}`,
            }}
          />
        </TableCell>

        <TableCell align="left">{row.field}</TableCell>
        <TableCell align="left">{row.level}</TableCell>
        <TableCell align="left">{row.title}</TableCell>
        <TableCell align="left">{row.theme}</TableCell>

        <TableCell align="left">
          <Link>voir</Link>
        </TableCell>

        <TableCell align="left">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
          sx={{ backgroundColor: theme.palette.gray }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {mergedMaterials.map((config, index) => (
                <Box key={index}>
                  <Typography variant="tableRowTitle" gutterBottom component="div">
                    Sous-sujet {index + 1}
                  </Typography>
                  <Table size="small" aria-label="materials">
                    <TableHead>
                      <TableRow>
                        <TableCell>Document</TableCell>
                        <TableCell align={'left'}>Matériel</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align={'left'}>{config.origin}</TableCell>
                        <TableCell align={'left'}>{config.materials.join(', ')}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

CollapsibleRow.propTypes = {
  row: PropTypes.object.isRequired,
  isItemSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
}

const ReportsTable = ({ reports, setSelectedSubjects }) => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('score')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selected, setSelected] = useState([])

  const rows = useMemo(() => reports.map((report) => createData(report)), [reports])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleCheckAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id)
      setSelected(newSelecteds)
      setSelectedSubjects(newSelecteds)
    } else {
      setSelected([])
      setSelectedSubjects([])
    }
  }

  const handleCheck = (event, row) => {
    const selectedIndex = selected.indexOf(row.id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
    setSelectedSubjects(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
  }

  const getComparator = (order, orderBy) => {
    return (a, b) => {
      if (a.score !== b.score) {
        return order === 'desc' ? b.score - a.score : a.score - b.score
      }
      if (orderBy === 'score') {
        return 0
      }
      return order === 'desc'
        ? b[orderBy] < a[orderBy]
          ? -1
          : 1
        : b[orderBy] > a[orderBy]
          ? -1
          : 1
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} numberOfSubjects={reports.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleCheckAll}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id)
                  return (
                    <CollapsibleRow
                      key={row.id}
                      row={row}
                      isItemSelected={isItemSelected}
                      handleClick={handleCheck}
                    />
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

ReportsTable.propTypes = {
  reports: PropTypes.array.isRequired,
  setSelectedSubjects: PropTypes.func.isRequired,
}

export default ReportsTable

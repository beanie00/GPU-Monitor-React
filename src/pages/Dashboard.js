import { filter } from 'lodash';
import { useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { TimelineDot } from '@mui/lab';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { ServerListHead, ServerListToolbar } from '../sections/@dashboard/server';
// mock
import SERVERLIST from '../_mock/server';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'ip', label: 'IP', alignRight: false },
  { id: 'usage', label: 'Usage', alignRight: false },
  // { id: 'cpu', label: 'CPU', alignRight: false },
  // { id: 'cpuClock', label: 'CPU Clock (GHz)', alignRight: false },
  // { id: 'cpuSockets', label: 'CPU Sockets', alignRight: false },
  { id: 'cores', label: 'Cores', alignRight: false },
  { id: 'threads', label: 'Threads', alignRight: false },
  { id: 'gpu', label: 'GPU', alignRight: false },
  { id: 'numberOfGPU', label: '# of GPUs', alignRight: false },
  { id: 'ram', label: 'RAM (GB)', alignRight: false },
  // { id: 'ssd', label: 'SSD/HDD (GB)', alignRight: false },
  // { id: 'os', label: 'OS', alignRight: false },
  { id: 'user', label: 'User', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = SERVERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - SERVERLIST.length) : 0;

  const filteredUsers = applySortFilter(SERVERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="SISReL Server Monitor">
      <Container maxWidth={'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            SISReL Server Monitor
          </Typography>
        </Stack>

        <Card>
          <ServerListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ServerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={SERVERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const { id, name, ip, cpu, cpuClock, cpuSockets, cores, threads, gpu, numberOfGPU, ram, ssd, os, user, status } = row;
                    const { id, name, usage, cores, threads, gpu, numberOfGPU, ram, user, status } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <TimelineDot
                            style={{width: '10px', height: '10px', marginLeft: '20px'}}
                            color={
                              (status === 'running' && 'success') ||
                              (status === 'fail' && 'error') 
                            }
                          />
                        </TableCell>
                        <TableCell align="left"><Typography variant="subtitle2" noWrap>{name}</Typography></TableCell>
                        {/* <TableCell align="left">{ip}</TableCell> */}
                        <TableCell align="left">{usage}</TableCell>
                        {/* <TableCell align="left">{cpu}</TableCell> */}
                        {/* <TableCell align="left">{cpuClock}</TableCell> */}
                        {/* <TableCell align="left">{cpuSockets}</TableCell> */}
                        <TableCell align="left">{cores}</TableCell>
                        <TableCell align="left">{threads}</TableCell>
                        <TableCell align="left">{gpu}</TableCell>
                        <TableCell align="left">{numberOfGPU}</TableCell>
                        <TableCell align="left">{ram}</TableCell>
                        {/* <TableCell align="left">{ssd}</TableCell> */}
                        {/* <TableCell align="left">{os}</TableCell> */}
                        <TableCell align="left">{user}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={SERVERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
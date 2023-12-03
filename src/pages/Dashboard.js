import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Box,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { TimelineDot } from '@mui/lab';
import { format } from 'date-fns'
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { ServerListHead, ServerListToolbar } from '../sections/@dashboard/server';
import { CpuUsage } from '../sections/@dashboard/app/CpuUsage';
import { DiskUsage } from '../sections/@dashboard/app/DiskUsage';
import { firestore } from '../utils/firebase';
// // mock
// import SERVERLIST from '../_mock/server';

// ----------------------------------------------------------------------

export const TOTAL_TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'ip', label: 'IP', alignRight: false },
  { id: 'gpuUsage', label: 'GPU Usage', alignRight: false },
  { id: 'cpuUsage', label: 'CPU/RAM Usage', alignRight: false },
  { id: 'disk', label: 'Disk Usage (GB)', alignRight: false },
  { id: 'gpu', label: 'GPU', alignRight: false },
  { id: 'cpu', label: 'CPU', alignRight: false },
  { id: 'cpuClock', label: 'CPU Clock (GHz)', alignRight: false },
  { id: 'cpuSockets', label: 'CPU Sockets', alignRight: false },
  { id: 'cores', label: 'Cores', alignRight: false },
  { id: 'threads', label: 'Threads', alignRight: false },
  { id: 'numberOfGPU', label: '# of GPUs', alignRight: false },
  { id: 'os', label: 'OS', alignRight: false },
  { id: 'user', label: 'User', alignRight: false },
  { id: '' },
]

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  if (!a[orderBy] && b[orderBy]) {
    return 2;
  }
  if (!b[orderBy] && a[orderBy]) {
    return -2;
  }
  return 0;
}

function getComparator(order, orderBy) {
  if (orderBy === 'gpuUsage') {
    orderBy = 'info'
  }
  if (orderBy === 'cpuUsage') {
    orderBy = 'cpuInfo'
  }
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
    return filter(array, (_user) => _user.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.server?.indexOf(query) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Dashboard() {
  const [serverData, setServerData] = useState([]);
  const [time, setTime] = useState()

  useEffect(() => {
    firestore.collection('server').get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTime(data[0])
      setServerData(data.filter((doc) => doc.server));
    })
  }, []);

  ///
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('gpuUsage');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedProperties, setSelectedProperties] = useState([]);


  useEffect(() => {
    const prevProperties = localStorage.getItem('properties1')
    if (prevProperties == null){
      const properties = ['name', 'cpuUsage', 'gpuUsage', 'disk', 'gpu']
      setSelectedProperties(properties);
      localStorage.setItem('properties1', JSON.stringify(properties));
    } else {
      setSelectedProperties(JSON.parse(prevProperties));
    }
  }, [])


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = serverData.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - serverData.length) : 0;

  const filteredServers = applySortFilter(serverData, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredServers.length === 0;

  const TABLE_HEAD = TOTAL_TABLE_HEAD.filter((item) => selectedProperties.includes(item.id));

  return (
    <Page title="SISReL Server Monitor">
      <Container maxWidth={'xl'}>
        <Stack direction="row" alignItems="center" mb={5}>
          <Typography variant="h4" gutterBottom sx={{mr: 2}}>
            SISReL Server Monitor
          </Typography>
          <Typography variant="caption" mb={1}>
            {time && (`Last updated: ${format(new Date(time.time.seconds * 1000 + time.time.nanoseconds/1000000), 'dd/MM/yyyy HH:mm:ss')}`)}
          </Typography>
        </Stack>

        <Card>
          <ServerListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName}
                              selectedProperties={selectedProperties} setSelectedProperties={setSelectedProperties}/>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ServerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={serverData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredServers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, server, cpuInfo, info, cpu, cpuClock, cpuSockets, cores, threads, gpu, numberOfGPU, disk, os, user, status } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;
                    let dotColor = 'success'
                    if (status === 'fail') {
                      dotColor = 'error'
                    } else if (status === 'no-nvidia') {
                      dotColor = 'info'
                    }
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
                            color={dotColor}
                          />
                        </TableCell>
                        <TableCell align="left"><Typography variant="subtitle2" noWrap>{name}</Typography></TableCell>
                        {selectedProperties.includes('ip') && server && (
                          <TableCell align="left">{server.split("@")[1]}</TableCell>
                        )}
                        {selectedProperties.includes('gpuUsage') && (
                          <TableCell align="left">
                            {info && info.map((gpu, index) => (
                              <Box key={index} sx={{pt: 1, maxWidth: 550}}>
                                {gpu.process_names.length > 0 && <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  <b>GPU {index}</b> : used by <b>
                                    {gpu.process_names.map((name, index) => {
                                      if (index === gpu.process_names.length - 1) {
                                        return `${name} (${gpu.used_memory[index]})`;
                                      }
                                      return `${name} (${gpu.used_memory[index]}), `;
                                    })}
                                  </b>
                                </Typography>}
                                {gpu.process_names.length === 0 && <Typography variant="caption" sx={{ color: 'success.dark' }}>
                                  <b>GPU {index}</b> : <b>Free</b>
                                </Typography>}
                              </Box>
                              ))}
                          </TableCell>
                        )}
                        {selectedProperties.includes('cpuUsage') &&  (
                          <CpuUsage cpuInfo={cpuInfo}/>
                        )}
                        {selectedProperties.includes('disk') && (
                          <DiskUsage diskInfo={disk}/>
                        )}
                        {selectedProperties.includes('gpu') && (
                          <TableCell align="left">{gpu}</TableCell>
                        )}
                        {selectedProperties.includes('cpu') && (
                          <TableCell align="left">{cpu}</TableCell>
                        )}
                        {selectedProperties.includes('cpuClock') && (
                          <TableCell align="left">{cpuClock}</TableCell>
                          )}
                        {selectedProperties.includes('cpuSockets') && (
                          <TableCell align="left">{cpuSockets}</TableCell>
                          )}
                        {selectedProperties.includes('cores') && (
                          <TableCell align="left">{cores}</TableCell>
                          )}
                        {selectedProperties.includes('threads') && (
                          <TableCell align="left">{threads}</TableCell>
                        )}
                        {selectedProperties.includes('numberOfGPU') && (
                          <TableCell align="left">{numberOfGPU}</TableCell>
                        )}
                        {selectedProperties.includes('os') && (
                          <TableCell align="left">{os}</TableCell>
                        )}
                        {selectedProperties.includes('user') && (
                          <TableCell align="left">{user}</TableCell>
                        )}
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
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={serverData.length}
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
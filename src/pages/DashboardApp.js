import { useEffect, useState } from 'react';
// @mui
import { Grid, Container, Typography, Box } from '@mui/material';
// components
import { format } from 'date-fns'
import { firestore } from '../utils/firebase';
import Page from '../components/Page';
// sections
import {
  ResourceListItem,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [GPUData, setGPUData] = useState([]);
  const [CPUData, setCPUData] = useState([]);
  const [time, setTime] = useState()

  useEffect(() => {
    firestore.collection('server').get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTime(data[0])
      setGPUData(data.filter((doc) => doc.server).filter((item) => item.status !== 'cpu'));
      setCPUData(data.filter((doc) => doc.server).filter((item) => item.status === 'cpu'));
    })
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Typography variant="h4" sx={{mr: 2}}>
            SISReL Server Monitor
          </Typography>
          <Typography variant="caption">
            {time && (`Last updated: ${format(new Date(time.time.seconds * 1000 + time.time.nanoseconds/1000000), 'dd/MM/yyyy HH:mm:ss')}`)}
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{mt: 5}}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <ResourceListItem
              type={'GPU'}
              data={GPUData}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <ResourceListItem
              type={'CPU'}
              data={CPUData}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

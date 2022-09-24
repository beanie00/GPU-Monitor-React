// @mui
import PropTypes from 'prop-types';
import { Card, Typography, CardHeader, CardContent, Box } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent } from '@mui/lab';

// ----------------------------------------------------------------------

ResourceListItem.propTypes = {
  type: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default function ResourceListItem({ data, type, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={type} />
      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {data.map((item, index) => (
            <ResourceItem key={index} item={item} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

ResourceItem.propTypes = {
  item: PropTypes.shape({
    info: PropTypes.array,
    server: PropTypes.string,
    status: PropTypes.string,
  }),
};

function ResourceItem({ item }) {
  const { status, server, info } = item;
  return (
    <TimelineItem>
      <TimelineDot
          color={
            (status === 'running' && 'success') ||
            (status === 'cpu' && 'info') ||
            (status === 'fail' && 'warning') ||
            'error'
          }
        />

      <TimelineContent sx={{mb : 3}}>
        {server && <Typography variant="subtitle2">{server}</Typography>}
        {info && info.map((gpu, index) => (
          <Box key={index} sx={{pt: 1}}>
            {gpu.process_names.length > 0 && <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <b>GPU {index} ({gpu.model})</b> : used by <b>{gpu.process_names.join(', ')}</b> with memory usage <b>{gpu.used_memory.join(', ')}</b>
            </Typography>}
            {gpu.process_names.length === 0 && <Typography variant="caption" sx={{ color: 'success.dark' }}>
              <b>GPU {index} ({gpu.model})</b> : <b>Free</b>
            </Typography>}
          </Box>
          ))}
      </TimelineContent>
    </TimelineItem>
  );
}

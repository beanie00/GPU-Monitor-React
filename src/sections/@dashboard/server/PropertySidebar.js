import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Stack,
  Button,
  Drawer,
  Tooltip,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { TOTAL_TABLE_HEAD } from '../../../pages/Dashboard';

// ----------------------------------------------------------------------

PropertySidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  selectedProperties: PropTypes.array,
  setSelectedProperties: PropTypes.func,
};

export default function PropertySidebar({ openFilter, onOpenFilter, onCloseFilter, selectedProperties, setSelectedProperties }) {
  const handleCheck = (event) => {
    if (event.target.checked) {
      const previousProperties = JSON.parse(localStorage.getItem('properties'));
      previousProperties.push(event.target.name);
      setSelectedProperties(previousProperties);
      localStorage.setItem('properties', JSON.stringify(previousProperties));
    } else {
      const previousProperties = JSON.parse(localStorage.getItem('properties'));
      const index = previousProperties.indexOf(event.target.name);
      if (index > -1) {
        previousProperties.splice(index, 1);
      }
      setSelectedProperties(previousProperties);
      localStorage.setItem('properties', JSON.stringify(previousProperties));
    }
  };

  return (
    <>
      <Tooltip title="View options">
        <IconButton onClick={onOpenFilter}>
            <Iconify icon="mdi:eye-check" />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Shown in table
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <FormGroup>
                {TOTAL_TABLE_HEAD.filter((item) => item.id !== 'name' && item.id !== '').map((item) => (
                  <FormControlLabel key={item.id} control={<Checkbox onChange={handleCheck} checked={selectedProperties.includes(item.id)} name={item.id} disabled={item.id === 'user'}/>} label={item.label} />
                ))}
              </FormGroup>
            </div>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            onClick={() => {
              const defaultProperties = ['name', 'cpuUsage', 'gpuUsage', 'disk']
              setSelectedProperties(defaultProperties);
              localStorage.setItem('properties', JSON.stringify(defaultProperties));
            }}
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Back to default
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
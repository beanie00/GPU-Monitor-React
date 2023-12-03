import { Box, TableCell } from '@mui/material';
import PropTypes from 'prop-types';

DiskUsage.propTypes = {
    diskInfo: PropTypes.string,
};

export function DiskUsage({ diskInfo }) {
    if (diskInfo && typeof diskInfo === "string") {
        let diskTotal = ''
        let diskFree = ''

        diskTotal = diskInfo.split(",")[0].match(/[+-]?([0-9]*[.])?[0-9]+/)
        diskFree = diskInfo.split(",")[1].match(/[+-]?([0-9]*[.])?[0-9]+/)
        if (diskTotal && diskFree) {
            diskTotal = parseInt(diskTotal[0], 10)
            diskFree = parseInt(diskFree[0], 10)
            return (
                <TableCell align="left">
                    <Box sx={{minWidth: 150}}>Total: {diskTotal}G,</Box>
                    <Box sx={{minWidth: 150}}>Free: {diskFree}G</Box>
                </TableCell>
            )
        }
        return (<TableCell align="left"/>)

    }
    return (<TableCell align="left"/>)
}
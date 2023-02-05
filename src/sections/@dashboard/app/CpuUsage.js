import { Box, TableCell } from '@mui/material';
import PropTypes from 'prop-types';

CpuUsage.propTypes = {
    cpuInfo: PropTypes.string,
};

export default function CpuUsage({ cpuInfo }) {
    if (cpuInfo) {
        const cpu = `${cpuInfo.split("Mem")[0].split("us")[0]} us`
        const mem = `Mem ${cpuInfo.split("Mem")[1].split("Swap")[0]}`
        const swap = `Swap ${ cpuInfo.split("Mem")[1].split("Swap")[1]}`

        const reg = /[^0-9.]/g
        let memTotal = parseInt(mem.split("total")[0].split(":")[1].replace("+", "0").replace(reg, ""), 10)
        let memFree = parseInt(mem.split("free")[0].split("total")[1].replace("+", "0").replace(reg, ""), 10)
        let memUsed = parseInt(mem.split("used")[0].split("free")[1].replace("+", "0").replace(reg, ""), 10)
        let memBuff = parseInt(mem.split("buff")[0].split("used")[1].replace("+", "0").replace(reg, ""), 10)

        let swapTotal = parseInt(swap.split("total")[0].split(":")[1].replace("+", "0").replace(reg, ""), 10)
        let swapFree = parseInt(swap.split("free")[0].split("total")[1].replace("+", "0").replace(reg, ""), 10)
        let swapUsed = parseInt(swap.split("used")[0].split("free")[1].replace("+", "0").replace(reg, ""), 10)
        let swapAvail = parseInt(swap.split("avail")[0].split("used")[1].replace("+", "0").replace(reg, "").slice(1), 10)

        if (cpuInfo.includes("KiB")) {
            memTotal = Math.round((memTotal/1000000))
            memFree = Math.round((memFree/1000000))
            memUsed = Math.round((memUsed/1000000))
            memBuff = Math.round((memBuff/1000000))
            swapTotal = Math.round((swapTotal/1000000))
            swapFree = Math.round((swapFree/1000000))
            swapUsed = Math.round((swapUsed/1000000))
            swapAvail = Math.round((swapAvail/1000000))
        } else {
            memTotal = Math.round((memTotal/1000))
            memFree = Math.round((memFree/1000))
            memUsed = Math.round((memUsed/1000))
            memBuff = Math.round((memBuff/1000))
            swapTotal = Math.round((swapTotal/1000))
            swapFree = Math.round((swapFree/1000))
            swapUsed = Math.round((swapUsed/1000))
            swapAvail = Math.round((swapAvail/1000))
        }

        return (
            <TableCell align="left">
                <Box>{cpu}</Box>
                <Box>Mem : {memTotal}G total, {memFree}G free, {memUsed}G used, {memBuff}G buff/cache</Box>
                <Box>Swap : {swapTotal}G total, {swapFree}G free, {swapUsed}G used, {swapAvail}G avail</Box>
            </TableCell>
        )
    }
    return (<TableCell align="left"/>)
}
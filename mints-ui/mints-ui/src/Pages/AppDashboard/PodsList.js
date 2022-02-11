import React from 'react'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button, Tooltip } from '@material-ui/core'
import _ from 'lodash'
import ReplayCircleFilledIcon from '@material-ui/icons/Cached'
import RedoIcon from '@material-ui/icons/Redo'
import RestartAltIcon from '@material-ui/icons/Replay'
import UndoIcon from '@material-ui/icons/Undo'


export default function PodsList(props) {

    // const editItem = (item) => {
    //     props.showEntry({key:_.startCase(item),value:props.items[item]})
    // }

    return (
        <TableContainer >
            <Table  size="small">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="center">
                            <Button variant="contained" color="primary" 
                                onClick={() => props.reload()}
                                startIcon={<ReplayCircleFilledIcon />}
                                > Reload </Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.items.map((item,index) => (
                        item !== '_id' && item !== 'Environment' && 
                        <TableRow key={index}>
                            <TableCell component="td" scope="row">{_.startCase(item.metadata.labels.app)}</TableCell>
                            <TableCell component="td" scope="row">{item.metadata.name}</TableCell>
                            <TableCell component="td" scope="row">{item.status.phase}</TableCell>
                            <TableCell align="right">
                                <Tooltip title='Revert Service to old version' position="left">
                                    <Button size="small" variant="text" color="primary" 
                                    onClick={() => props.action(item,'revert')} ><UndoIcon /></Button>
                                </Tooltip>
                                <Tooltip title='Restart Service' position="top">
                                    <Button size="small" variant="text" color="primary" 
                                    onClick={() => props.action(item,'restart')} ><RestartAltIcon /></Button>
                                </Tooltip>
                                <Tooltip title='Rebuild Service' position="right">
                                    <Button size="small" variant="text" color="primary" 
                                    onClick={() => props.action(item,'rebuild')} ><RedoIcon /></Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button } from '@material-ui/core'
// import AddCircleIcon from '@material-ui/icons/AddCircle'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Subscribers({subscribers, loadLists, onEdit, onDelete}) {

    useEffect(() => {
        loadLists()
    },[])

    return (
        <TableContainer >
            <Table  size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell> 
                        <TableCell>Name</TableCell> 
                        {/* <TableCell >Service Count</TableCell>  */}
                        {/* <TableCell align="right">
                            <Button variant="text" color="primary" 
                            // onClick={() => props.showEntry(props.format,{},props.items.length)}
                            ><AddCircleIcon /></Button>
                        </TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscribers.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell component="td" scope="row">
                                {item._id}
                            </TableCell>
                            <TableCell component="td" scope="row">
                                {item.name}
                            </TableCell>
                            {/* <TableCell component="td" scope="row">
                                {0}
                            </TableCell> */}
                            <TableCell align="right">
                                <Button size="small" variant="text" color="primary" 
                                onClick={() => onEdit(item)} 
                                ><CreateIcon /></Button>
                                <Button size="small" variant="text" color="primary" 
                                onClick={() => onDelete(item)}
                                ><DeleteIcon /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

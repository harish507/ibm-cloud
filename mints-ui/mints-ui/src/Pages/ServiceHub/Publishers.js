/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button } from '@material-ui/core'
// import AddCircleIcon from '@material-ui/icons/AddCircle'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Publishers({publishers, loadLists, onEdit, onDelete}) {

    useEffect(() => {
        loadLists()
    },[])

    // const editItem = (item,index) => {
    //     if (Object.keys(props.format).length === 1) {
    //         let key = Object.keys(props.format)[0]
    //         props.showEntry(props.format,{[key]:item},index)
    //     } else {
    //         // let newItem = {}
    //         // Object.keys(props.format).forEach((key,ind) => {
    //         //     newItem[key] = Object.values(item)[ind]
    //         // })
    //         props.showEntry(props.format,{...item},index)
    //     }
    // }

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
                    {publishers.map((item,index) => (
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

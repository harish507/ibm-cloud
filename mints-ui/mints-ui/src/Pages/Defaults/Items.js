import React from 'react'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button } from '@material-ui/core'
import _ from 'lodash'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Items(props) {

    const editItem = (item) => {
        props.showEntry({key:_.startCase(item),value:props.items[item]})
    }

    return (
        <TableContainer >
            <Table  size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell align="right">
                            <Button variant="text" color="primary" 
                                onClick={() => props.showEntry({key:'',value:''})}
                                ><AddCircleIcon /></Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.items).map((item,index) => (
                        item !== '_id' && item !== 'Environment' && 
                        <TableRow key={index}>
                            <TableCell component="td" scope="row">{_.startCase(item)}</TableCell>
                            <TableCell component="td" scope="row">{props.items[item]}</TableCell>
                            <TableCell align="right">
                                <Button size="small" variant="text" color="primary" 
                                onClick={() => editItem(item)} ><CreateIcon /></Button>
                                <Button size="small" variant="text" color="primary" 
                                onClick={() => props.onDelete(item)} ><DeleteIcon /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

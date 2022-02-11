import React from 'react'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button } from '@material-ui/core'
import _ from 'lodash'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Items(props) {

    const editItem = (item,index) => {
        if (Object.keys(props.format).length === 1) {
            let key = Object.keys(props.format)[0]
            props.showEntry(props.format,{[key]:item},index)
        } else {
            // let newItem = {}
            // Object.keys(props.format).forEach((key,ind) => {
            //     newItem[key] = Object.values(item)[ind]
            // })
            props.showEntry(props.format,{...item},index)
        }
    }

    return (
        <TableContainer >
            <Table  size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {Object.keys(props.format).map((key,ind) => {
                            return <TableCell key={ind}>{_.startCase(key)}</TableCell> })
                        }
                        <TableCell align="right">
                            <Button variant="text" color="primary" 
                            onClick={() => props.showEntry(props.format,{},props.items.length)}
                            ><AddCircleIcon /></Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.items.map((item,index) => (
                        <TableRow key={index}>
                            {Object.keys(props.format).length === 1 &&
                                <TableCell component="td" scope="row">
                                    {item}
                                </TableCell>
                            }
                            {Object.keys(props.format).length > 1 &&
                                Object.values(item).map((val,ind) => {
                                return <TableCell key={ind} component="td" scope="row">
                                    {val}
                                </TableCell>                                        
                                })
                            }
                            <TableCell align="right">
                                <Button size="small" variant="text" color="primary" 
                                onClick={() => editItem(item,index)} ><CreateIcon /></Button>
                                <Button size="small" variant="text" color="primary" 
                                onClick={() => props.onDelete(index)} ><DeleteIcon /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

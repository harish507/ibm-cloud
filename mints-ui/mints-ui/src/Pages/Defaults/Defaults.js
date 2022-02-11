import React, { useState } from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { Grid } from '@material-ui/core'
import Items from './Items'
import Entry from './Entry'
import _ from 'lodash'

export default function Defaults(props) {
    const [method, setMethod] = useState('get')
    const [id, setId] = useState(null)
    const [defaults, setDefaults] = useState({})
    const [entry, setEntry] = useState(null)

    const {uiRef} = props
    const loadData = data => {
        setMethod('')
        setId(data._id)
        delete data._id
        setDefaults(data)
    }
    const showEntry = item => {
        setEntry(item)   
    }
    const onSave = item => {
        if (!item.key || item.key.trim()==='' || !item.value || item.value.trim()==='' ) {
            props.uiRef.current.Error('All fields are mandatory.')
        } else {
            
            item.key = _.replace(_.startCase(item.key),new RegExp(" ","g"),'')
            setDefaults({...defaults, [item.key]:item.value})
            setMethod('put')
            setEntry(null)
        }
    }
    const onDelete = item => {
        props.uiRef.current.Confirm("Are you sure to delete this property ?",
        () => {
            let items = {...defaults}
            item = _.replace(_.startCase(item),new RegExp(" ","g"),'')
            delete items[item]
            setDefaults(items)
            setMethod('put')
            setEntry(null)
        },
        ()=> {}
        )
    }
    const showStatus = () => {
        uiRef.current.Success("Default values updated successfully.")
        setMethod('')
    }

    return (
        <div className="content">
            {method==='get' && 
                <ServiceHelper path='defaults' render={defaults => {
                    return <div>
                    {defaults.payload && loadData(Object.values(defaults.payload)[0])}
                    {uiRef && uiRef.current && uiRef.current.Loading(defaults.loading)}
                </div>
            }} />}
            {method==='put' && 
                <ServiceHelper method="put" path={'defaults/' + id } 
                input = {{defaultValues: defaults}} render={result => {
                return <div>
                    {uiRef && uiRef.current && uiRef.current.Loading(result.loading)}
                    {result.payload && showStatus()}
                </div>
            }} />}
            {Object.keys(defaults).length > 0 &&
            <Grid container spacing={4} alignContent="flex-start" alignItems="flex-start"  >
                {/* <Grid item md={1} sm={12}></Grid> */}
                <Grid item md={12} sm={12}>
                    <Items items={defaults} 
                        showEntry={showEntry}
                        onDelete = {onDelete}
                    />
                    {entry &&
                        <Entry item={entry} disabled={entry.key.length > 0}
                        uiRef ={uiRef} onSave={onSave} onCancel={() => setEntry(null)} />
                    }
                </Grid>
            </Grid>}
        </div>
    )
}


import React, { Component } from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { Grid } from '@material-ui/core'
import List from './List'
import Items from './Items'
import Entry from './Entry'
import _ from 'lodash'

export default class Masters extends Component {

    state= {
        masters: {},
        selected: null,
        entryItem: null, 
        index: 0,
        method: "get",
    }

    selectMaster = (item) => {
        this.setState({selected: null })            
        setTimeout(() => {
            this.setState({selected: item ? this.state.masters[item] : null })
        }, 10);
    }
    showEntry = (format,item,index) => {
        let entryItem =[]
        Object.keys(format).forEach(key => {
            entryItem.push({key,type:format[key],value:item[key]? item[key]:''})
        })
        this.setState({entryItem,index})
    }

    setMasters = (masters) => {
        if (masters && Object.keys(masters).length > 0 && Object.keys(this.state.masters).length === 0) {
            this.setState({masters})
                this.selectMaster(Object.keys(masters)[0])
        }
    }
    save = (master) => {
        let valid = true
        let item = null
        let {selected,index} = this.state

        if (Object.keys(selected.format).length === 1) {
            if (!master[0].value || master[0].value.trim() === '') {
                this.props.uiRef.current.Error("Please enter value for all mandatory fields.")
                valid= false
            }
            item = master[0].value
        } else {
            item = {}
            master.forEach((prop,pInd) => {
                item[prop.key] = prop.value
                if ((!prop.value || prop.value.trim() === '') && pInd === 0) {
                    this.props.uiRef.current.Error("Please enter value for all mandatory fields.")
                    valid = false
                }
            })
        }
        if (valid) {
            if (selected.list.filter((l,li) => li!==index && _.isEqual(l,item) ).length > 0) {
                this.props.uiRef.current.Error("Duplicate entry.")
            } else {
                if (index < selected.list.length) {
                    selected.list[index] = item
                } else {
                    selected.list.push(item)
                }
                this.setState({selected,entryItem: null,method: 'put'})
            }
        }
    }
    delete = (ind) => {
        this.props.uiRef.current.Confirm("Are you sure to delete the selected item ?",
        ()=> {
            let {selected} = this.state
            selected.list.splice(ind,1)
            this.setState({selected,method: 'put'})
        }, ()=>{})
    }
    cancel = () => {
        this.setState({entryItem: null})
    }
    
    showStatus = () => {
        this.props.uiRef.current.Success( this.state.selected.type + " updated successfully")
        this.setState({masters: null})
        setTimeout(() => {
            this.setState({entryItem: null, method: 'get'})
        }, 1000)
    }
    render() {
        const {uiRef} = this.props
        return (
            <div className="content">
                {this.state.method==='get' && 
                    <ServiceHelper path='masters/all' render={masters => {
                    // if(masters && masters.payload) {this.setState({masters: masters.payload})}
                    this.setMasters(masters.payload)
                    return <div>
                        {uiRef && uiRef.current && uiRef.current.Loading(masters.loading)}
                    </div>
                }} />}
                {this.state.method==='put' && this.state.selected && 
                    <ServiceHelper method="put" path={'masters/' + this.state.selected._id } 
                    input = {this.state.selected} render={result => {
                    // if(masters && masters.payload) {this.setState({masters: masters.payload})}
                    //this.setMasters(masters.payload)
                    return <div>
                        {uiRef && uiRef.current && uiRef.current.Loading(result.loading)}
                        {result.payload && result.payload.Success && this.showStatus()}
                    </div>
                }} />}
                {Object.keys(this.state.masters).length > 0 &&
                <Grid container spacing={4} alignContent="flex-start" alignItems="flex-start"  >
                    <Grid item md={2} sm={12}>
                        <List list={Object.keys(this.state.masters)} 
                            selected={this.state.selected ? this.state.selected.type : null}
                            selectMaster={this.selectMaster} />
                    </Grid>
                    <Grid item md={10} sm={12}>
                        {this.state.selected && 
                            <Items items={this.state.selected.list} 
                            format={this.state.selected.format}
                            title={this.state.selected.type.toUpperCase()}
                            showEntry={this.showEntry}
                            onDelete = {this.delete}
                            />}
                        {this.state.entryItem &&
                            <Entry item={this.state.entryItem} type={this.state.selected} 
                            title={this.state.selected.type}
                            uiRef ={uiRef} onSave={this.save} onCancel={this.cancel} />
                        }
                    </Grid>
                </Grid>}
            </div>
        )
    }
}
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import TextBox from '../../Controls/TextBox'
import DropDown from '../../Controls/DropDown'
import RadioSelection from '../../Controls/RadioSelection'
import ObjectEntryControl from '../../Controls/ObjectEntryControl'
import FieldSet from '../../Controls/FieldSet'
import SwitchControl from '../../Controls/SwitchControl'
import { Typography, Button, Grid, List, ListItem, ListItemText } from '@material-ui/core'
import Steps from './Steps'

const initService = {name: '', description: '', application: '', publisher: '' }

export default function Registration({uiRef, loadLists, applications, publishers, subServices, saveSubService}) {
    const [service, setService] = useState(initService)
    const [policies, setPolicies] = useState({'Basic Auth': false, 'Signature Auth': false, 'Token Auth': false})
    const [document, setDocument] = useState(null)
    const [step, setStep] = useState(0)
    
    useEffect(() => {
        loadLists()
    },[])
    useEffect(() => {
        if (applications.length > 0 && publishers.length > 0) {
            setService({...initService, publisher: publishers[0], application: applications[0]})
        // } else {
        //     uiRef.Error('Please provide publisher and application details before registration.')
        }
    },[applications, publishers])

    const handleChange = (key,val) => {
        setService({...service,[key]:val})
    }
    const handlePolicyChange = (key,val) => {
        setPolicies({ ...policies,[key]: val})
        //setService({...service,policies:policies)
    }
    const showDefinition = () => {
        if (service.name.trim() === '' || service.description.trim() ==='' || !service.publisher || !service.application) {
            uiRef.Error('Please provide all the details.')
        } else {
            setStep(1)
            setService({ properties: {}, documents: [], endpoint: '', operation: 'Get', policies: {}, ...service, id: service._id ? service._id : 'new'})
        }
    }
    const goBack = (stp) => {
        //setService({...service, id: null})
        setStep(stp)
    }
    const selectFile = (e) => {
		if (e.target.files.length > 0) {
			setDocument(e.target.files[0])
		}
	}
    const review = () => {
        if (service.endpoint.trim() === '' ) {
            uiRef.Error('Please provide service endpoint.')
        } else if (Object.values(policies).filter(x => x === true ).length === 0) {
            uiRef.Error('Please one or more auth policies.')
        } else if (!document) {
            uiRef.Error('Please provide a service definition document')
        } else {
            setStep(2)
            // saveSubService({...service,policies:policies},document)
        }
    }
    const register = () => {
        if (service.endpoint.trim() === '' ) {
            uiRef.Error('Please provide service endpoint.')
        } else if (Object.values(policies).filter(x => x === true ).length === 0) {
            uiRef.Error('Please one or more auth policies.')
        } else if (!document) {
            uiRef.Error('Please provide a service definition document')
        } else {
            saveSubService({...service,policies:policies},document)
        }
    }

    const listItem = (label,text) => <ListItem alignItems='flex-start' style={{ margin: 0, padding: 0 }}>
				<ListItemText
					primary={
						<React.Fragment>
							<Typography
								component='span'
								variant='body2'
								// className={classes.inline}
								color='textSecondary'
							>
								{label}
							</Typography>
						</React.Fragment>
					}
					secondary={
						<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                component='span'
                                variant='body1'
                                // className={classes.inline}
                                color='textPrimary'
                            >
                                {text}
                            </Typography>
						</div>
					}
				/>
			</ListItem>

    return <div className="content">
        <Steps step={step} />
        {step===0 && <div>
            <DropDown label='Publisher' 
                items={publishers} 
                value={service.publisher} 
                onChange={(val) => handleChange('publisher', val)} 
                keyField='id'
                valueField='name'
            />
            <DropDown label='Application' 
                items={applications} 
                value={service.application} 
                onChange={(val) => handleChange('application', val)} 
                keyField='name'
                valueField='name'
            />
            <TextBox label='Service Name' autoFocus={true} value={service.name} onChange={(e) => handleChange('name', e.target.value)}  />
            <TextBox label='Description'multiline rows={4} value={service.description} onChange={(e) => handleChange('description', e.target.value)}  />
            <div style={{ margin: '20px auto', width: 200}}>
                <Button variant='outlined' color='primary' >Reset</Button>
                <Button variant='contained' color='primary' onClick={showDefinition}  >Continue</Button>
            </div>
        </div>}
        {step===1 && <div>
            <TextBox label='Service Name' disabled autoFocus={true} value={service.name} onChange={(e) => handleChange('name', e.target.value)}  />
            <TextBox label='Endpoint' autoFocus={true} value={service.endpoint} onChange={(e) => handleChange('endpoint', e.target.value)}  />
            <RadioSelection label='Operation' items={['Get','Post','Put','Delete']} value={service.operation} onChange={(e) => handleChange('operation', e.target.value)} />
            <ObjectEntryControl label='Properties' value={service.properties} onChange={(val) => handleChange('properties',val)} />
            <FieldSet label='Policies' bodyStyle={{ display: 'flex',flexDirection: 'row', padding: 10}}>
                {Object.keys(policies).map((policy) => {
                return <div key={policy} style={{ display: 'flex',flexDirection: 'row',marginRight: 20, padding:0, paddingTop: 5}} >
                        <Typography variant='body2' style={{ marginRight: 10 }}>{policy + ': '}</Typography>
                        <SwitchControl checked={policies[policy]} onChange={(e) => handlePolicyChange(policy, e.target.checked)} />;
                    </div>
                })}
            </FieldSet>
            <FieldSet label='Definition Document' bodyStyle={{padding:10, paddingTop: 20, textAlign: 'left'}}>
                <input type='file' id='upload' onChange={selectFile} />
            </FieldSet>
            <div style={{ margin: '20px auto', width: 200}}>
                <Button variant='outlined' color='primary' onClick={() => goBack(0)} >Back</Button>
                <Button variant='contained' color='primary' onClick={review}  >Continue</Button>
            </div>
        </div>}
        {step===2 && <div>
            <Grid container spacing={1}>
                <Grid item md={6}>
                    <List columns>
                        {listItem('Name',service.name)}
                        {listItem('Application',service.application.name)}
                        {listItem('Operation',service.operation)}
                        {listItem('Policies', Object.keys(policies).map((h) => (policies[h] ? <span>{h.trim()}<br /></span> : '')) )}
                        {/* {listItem('Policies', (policies['Basic Auth'] ? 'Basic Auth' + <br /> : '') 
                                            + (policies['Signature Auth'] ? 'Signature Auth' + <br /> : '') 
                                            + (policies['Token Auth'] ? 'Token Auth' + <br /> : '') )} */}
                        {listItem('Document',document ? document.name : '')}
                    </List>                    
                </Grid>
                <Grid item md={6}>
                    <List columns>
                        {listItem('Description',service.description)}
                        {listItem('Publisher',service.publisher.name)}
                        {listItem('Endpoint',service.endpoint)}
                        {listItem('Properties',JSON.stringify(service.properties)
							.replace('{', '')
							.replace('}', '')
							.replace(new RegExp('"', 'g'), ' ')
							.split(',')
							.map((h, i) => {
								return <span>{h.trim()}<br /></span>
							}))}
                    </List>                    
                </Grid>
            </Grid>

            <div style={{ margin: '20px auto', width: 200}}>
                <Button variant='outlined' color='primary' onClick={() => goBack(1)} >Back</Button>
                <Button variant='contained' color='primary' onClick={register}  >Save</Button>
            </div>
        </div>}
        {/* <div>
        <br /><br />
            {JSON.stringify(service)}
        </div> */}
    </div>
}



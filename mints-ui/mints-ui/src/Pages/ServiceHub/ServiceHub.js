import React, { useState, useEffect } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
// import { Configuration, Template, Masters, Defaults, Services, Palettes, MapsRoutes, Applications } from '../'
import UIHelper from '../../Helpers/UIHelper'
import RestHelper from '../../Helpers/RestHelper'
import { Button, Grid } from '@material-ui/core'

import Registration from './Registration'
import Publishers from './Publishers'
import PublisherEntry from './PublisherEntry'
import SubscriberEntry from './SubscriberEntry'
import Subscribers from './Subscribers'
import Subscriptions from './Subscriptions'

const uiRef = React.createRef()

export default function ServiceHub () {
	const [ value, setValue ] = useState(0)
	const [ applications, setApplications ] = useState([])
	const [ publishers, setPublishers ] = useState([])
	const [ subscribers, setSubscribers ] = useState([])
	const [ subscriptions, setSubscriptions ] = useState([])
	const [ subServices, setSubServices ] = useState([])
	const [ publisher, setPublisher ] = useState(null)
	const [ subscriber, setSubscriber ] = useState(null)
	const [ subscription, setSubscription ] = useState(null)

    useEffect(() => {
        //uiRef && uiRef.current && loadLists()
    },[])

    const loadLists = () => {
        uiRef.current.Loading(true)
        RestHelper.get('subscriptionLists')
        .then((result) => {
            if (result && result.Success ) {
                setApplications(result.Result.applications)
                setPublishers(result.Result.publishers)
                setSubscribers(result.Result.subscribers)
                setSubServices(result.Result.subscriptionServices)
                setSubscriptions(result.Result.subscriptions)
            } else {
                uiRef.current.Error(result.Message)
            }
            uiRef.current.Loading(false)
        }).catch((err) => {
            uiRef.current.Loading(false)
            uiRef.current.Error(err)
        })
    }
	const handleChange = (_event, newValue) => {
		setValue(newValue)
	}
    const saveSubscriptionService = (subscription,document) => {
        uiRef.current.Loading(true)
        const formData = new FormData()
        formData.append('file', document)
        formData.append('info', JSON.stringify(subscription))
        RestHelper.post('saveSubscriptionService',formData, RestHelper.headers.fileUploadHeader)
        .then((result) => {
            if (result && result.Success ) {
                uiRef.current.Success('Subscription Service saved successfully.')
                setValue(0)
            } else {
                uiRef.current.Error(result.Message)
            }
            uiRef.current.Loading(false)
        }).catch((err) => {
            uiRef.current.Loading(false)
            uiRef.current.Error(err)
        })
    }

    const savePublisher = (item) => {
        if (!item.name || item.name.trim() === '' ) {
            uiRef.current.Error('Please provide all details.')
        } else {
            uiRef.current.Loading(true)
            if (item._id) {
                RestHelper.put('publishers/' + item._id,item, RestHelper.headers.commonHeader)
                .then((result) => {
                    if (result && result.Success ) {
                        uiRef.current.Success('Publisher saved successfully.')
                        loadLists()
                        if (value === 0) setValue(2)
                    } else {
                        uiRef.current.Error(result.Message)
                    }
                    uiRef.current.Loading(false)
                }).catch((err) => {
                    uiRef.current.Loading(false)
                    uiRef.current.Error(err)
                })
            } else {
                RestHelper.post('publishers',item, RestHelper.headers.commonHeader)
                .then((result) => {
                    if (result && result.Success ) {
                        uiRef.current.Success('Publisher saved successfully.')
                        loadLists()
                        if (value === 0) setValue(2)
                    } else {
                        uiRef.current.Error(result.Message)
                    }
                    uiRef.current.Loading(false)
                }).catch((err) => {
                    uiRef.current.Loading(false)
                    uiRef.current.Error(err)
                })
            }
            setPublisher(null)
        }
    }
    const deletePublisher = (item) => {
        uiRef.current.Confirm('Are you sure you want to delete publisher ' + item.name,
            ()=>{
                uiRef.current.Loading(true)
                RestHelper.delete('publishers/' + item._id)
                .then((result) => {
                    if (result && result.Success ) {
                        uiRef.current.Success('Publisher deleted successfully.')
                        loadLists()
                    } else {
                        uiRef.current.Error(result.Message)
                    }
                    uiRef.current.Loading(false)
                }).catch((err) => {
                    uiRef.current.Loading(false)
                    uiRef.current.Error(err)
                })

            },
            ()=>{}
        )

    }
    const saveSubscriber = (item) => {
        if (!item.name || item.name.trim() === '' ) {
            uiRef.current.Error('Please provide all details.')
        } else {
            uiRef.current.Loading(true)
            if (item._id) {
                RestHelper.put('subscribers/' + item._id,item, RestHelper.headers.commonHeader)
                .then((result) => {
                    if (result && result.Success ) {
                        uiRef.current.Success('Subscriber saved successfully.')
                        loadLists()
                        if (value === 0) setValue(3)
                    } else {
                        uiRef.current.Error(result.Message)
                    }
                    uiRef.current.Loading(false)
                }).catch((err) => {
                    uiRef.current.Loading(false)
                    uiRef.current.Error(err)
                })
            } else {
                RestHelper.post('subscribers',item, RestHelper.headers.commonHeader)
                .then((result) => {
                    if (result && result.Success ) {
                        uiRef.current.Success('Subscriber saved successfully.')
                        loadLists()
                        if (value === 0) setValue(3)
                    } else {
                        uiRef.current.Error(result.Message)
                    }
                    uiRef.current.Loading(false)
                }).catch((err) => {
                    uiRef.current.Loading(false)
                    uiRef.current.Error(err)
                })
            }
            setSubscriber(null)
        }
    }
    const deleteSubscriber = (item) => {
        uiRef.current.Confirm('Are you sure you want to delete subscriber ' + item.name,
            ()=>{
                uiRef.current.Loading(true)
                RestHelper.delete('subscribers/' + item._id)
                .then((result) => {
                    if (result && result.Success ) {
                        uiRef.current.Success('Subscriber deleted successfully.')
                        loadLists()
                    } else {
                        uiRef.current.Error(result.Message)
                    }
                    uiRef.current.Loading(false)
                }).catch((err) => {
                    uiRef.current.Loading(false)
                    uiRef.current.Error(err)
                })

            },
            ()=>{}
        )

    }



    
    const saveSubscription = (item) => {
        if (!item.name || item.name.trim() === '' ) {
            uiRef.current.Error('Please provide all details.')
        } else {
            uiRef.current.Loading(true)
            RestHelper.post('saveSubscription',item, RestHelper.headers.commonHeader)
            .then((result) => {
                if (result && result.Success ) {
                    uiRef.current.Success('Subscription saved successfully.')
                    loadLists()
                } else {
                    uiRef.current.Error(result.Message)
                }
                uiRef.current.Loading(false)
            }).catch((err) => {
                uiRef.current.Loading(false)
                uiRef.current.Error(err)
            })
        }
    }
	
	return (
		<React.Fragment>
			<UIHelper ref={uiRef} />
				<div className='content'>
					<Paper>
						<Grid container spacing={0}>
                            <Grid item md={1}>

                            </Grid>
                            <Grid item md={8}>
                                <Tabs
                                    value={value}
                                    centered
                                    indicatorColor='secondary'
                                    textColor='secondary'
                                    onChange={handleChange}
                                >
                                    <Tab label='Registration' value={1} />
                                    <Tab label='Publishers' value={2} />
                                    <Tab label='Subscribers' value={3} />
                                    <Tab label='Manage' value={4} />
                                </Tabs>
                            </Grid>
                            <Grid item md={3} style={{paddingTop: 10}}>
                                {/* <Button variant='outlined' color='primary' >Add Service</Button>                                 */}
                                <Button variant='outlined' color='primary' onClick={() => setPublisher({name: ''})} >Add Publisher</Button>
                                <Button variant='outlined' color='primary' onClick={() => setSubscriber({name: ''})} >Add Subscriber</Button>
                            </Grid>
                        </Grid>
					</Paper>
                    <Grid container>
                        <Grid item md={3}></Grid>
                        <Grid item md={6}>
                            {value === 1 && 
                                <Registration 
                                    uiRef={uiRef.current} 
                                    loadLists= {loadLists}
                                    applications={applications} 
                                    publishers={publishers}
                                    subServices={subServices}
                                    saveSubService={saveSubscriptionService}
                                />}
                            {value === 2 && 
                                <Publishers 
                                    uiRef={uiRef.current} 
                                    loadLists= {loadLists}
                                    publishers={publishers}
                                    onEdit={(item) => setPublisher(item)}
                                    onDelete={(item) => deletePublisher(item)}
                                />}
                            {value === 3 && 
                                <Subscribers 
                                    uiRef={uiRef.current} 
                                    loadLists= {loadLists}
                                    subscribers={subscribers}
                                    onEdit={(item) => setSubscriber(item)}
                                    onDelete={(item) => deleteSubscriber(item)}
                                />}
                            {value === 4 && 
                                <Subscriptions 
                                    uiRef={uiRef.current} 
                                    loadLists= {loadLists}
                                    subscriptions={subscriptions} 
                                    onCancel={() => setSubscription(null)}
                                    ooSave={saveSubscription}
                                />}
                        </Grid>
                        <Grid item md={3}>
                            {publisher && <PublisherEntry publisher={publisher}
                                            publishers={publishers}
                                            onCancel={() => setPublisher(null)}
                                            onSave={savePublisher}
                                        />}
                            {subscriber && <SubscriberEntry subscriber={subscriber}
                                            subscribers={subscribers}
                                            onCancel={() => setSubscriber(null)}
                                            onSave={saveSubscriber}
                                        />}

                        </Grid>
                    </Grid>
				</div>

		</React.Fragment>
	)
}

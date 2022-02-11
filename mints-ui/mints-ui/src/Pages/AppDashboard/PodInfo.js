/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import RestHelper from '../../Helpers/RestHelper'
import PodsList from './PodsList'
import UIHelper from '../../Helpers/UIHelper'

const uiRef = React.createRef()

export default function PodInfo() {
    // const [result, setResult ] = useState(null)
    const [pods, setPods ] = useState([])

    const list_url = 'https://dev.azure.com/miraclelabsbentonville0830/MFT%20Explorer/_apis/pipelines/60/runs?api-version=6.1-preview.1'
    const exec_url = 'https://dev.azure.com/miraclelabsbentonville0830/MFT%20Explorer/_apis/pipelines/59/runs?api-version=6.1-preview.1'
    const body = {  "templateParameters" : {"inputName" : "initiate"}}
    const headers = {auth: {
        username: '',
        password: '34b7mvmlbvcls77eeb7ajbhs75asw7jnpb2ypzau2loof3im5n4q'
    }}

    const reload = () => {
        uiRef.current.Loading(false)
        RestHelper.postUrl(list_url, body, { ...RestHelper.headers.commonHeader, ...headers }  )
            .then(data => {
                setTimeout(() =>loadList(),60000)
                //alert(JSON.stringify(data))
                //setResult(data)
            })
            . catch(err => {
                uiRef.current.Error(err.Message)
                alert(JSON.stringify(err))
                //setResult(err)
            })
    }
    const loadList = () => {
        RestHelper.post('viewFile', { path: '/', filename: 'pods_list.json' })
        .then(data => {
            setPods(JSON.parse(data.Result).items)
            uiRef.current.Loading(false)
        })
        . catch(err => {
            uiRef.current.Error(err.Message)
            alert(JSON.stringify(err))
            setPods([])
        })
    }
    const updateCmdAction = (pod, action) => {
        uiRef.current.Loading(true)
        let command = 'kubectl'
        switch (action) {
            case 'restart': 
                command += ' delete ' + pod.metadata.name
                break
            default:
        }
        RestHelper.post('editFile', { path: '/', filename: 'job-test.sh', content: command })
        .then(data => {
            if (data && data.Result) {
                uiRef.current.Loading(false)
                setTimeout(() =>exec_cmd(),100)
            }
        })
        . catch(err => {
            uiRef.current.Error(err.Message)
            alert(JSON.stringify(err))
            setPods([])
        })
    }
    const exec_cmd = () => {
        uiRef.current.Loading(true)
        RestHelper.postUrl(exec_url, body, { ...RestHelper.headers.commonHeader, ...headers }  )
            .then(data => {
                setTimeout(() =>loadList(),20000)
                //alert(JSON.stringify(data))
                //setResult(data)
            })
            . catch(err => {
                uiRef.current.Error(err.Message)
                alert(JSON.stringify(err))
                //setResult(err)
            })
    }

    useEffect(() =>{
        loadList()
    }, [])

    return <div>
        <UIHelper ref={uiRef} />
        <PodsList items={pods} reload={reload} action={updateCmdAction} />
    </div>
}

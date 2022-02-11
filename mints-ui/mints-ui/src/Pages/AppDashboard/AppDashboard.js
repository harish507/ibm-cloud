import React from 'react';
import SideBar from './SideBar'
import PodInfo from './PodInfo'


export default function AppDashboard() {
    return <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{flexDirection: 'column', width: 250, backgroundColor: '#ccc'}}>
            <SideBar />
        </div>
        <div style={{flexDirection: 'column', padding: 10}}>
            <PodInfo />
        </div>
    </div>
}

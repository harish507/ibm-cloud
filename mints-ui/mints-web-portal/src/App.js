import './App.css'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from './Controls/Button'
import TextBox from './Controls/TextBox'
import GeoLocationHelper from './Helpers/GeoLocationHelper'
import DbHelper from './Helpers/DbHelper'

function useQuery () {
	return new URLSearchParams(useLocation().search)
}

function App () {
	const location = GeoLocationHelper()
	const [ empId, setEmpId ] = useState('')
	const [ wbs, setWbs ] = useState('')
	const [ status, setStatus ] = useState({ success: true, message: '' })
	const [ lastClock, setLastClock ] = useState(null)
	let query = useQuery()

	useEffect(() => {
		// let uid = localStorage.getItem('userId')
		let wb = query.get('wbs')
		let uid = query.get('empId')
		if (wb && uid) {
			setWbs(wb)
			setEmpId(uid)
			getUserLastClock(wb, uid)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const clockIn = () => {
		if (location.loaded && location.coordinates && wbs !== '' && empId !== '') {
			DbHelper.userClockIn({
				wbs,
				empId,
				clockInTime: new Date(Date.now()),
				clockInLocation: location.coordinates
			})
				.then((result) => {
					// localStorage.setItem('userId', userId)
					setStatus({ success: true, message: 'Clock In Success' })
					getUserLastClock(wbs, empId)
				})
				.catch((error) => setStatus({ success: false, message: JSON.stringify(error) }))
		} else {
			setStatus({ success: false, message: 'Enable Geo location services' })
		}
	}
	const clockOut = () => {
		if (location.loaded && location.coordinates && wbs !== '' && empId !== '' && lastClock) {
			DbHelper.userClockOut({
				_id: lastClock._id,
				wbs,
				empId,
				clockOutTime: new Date(Date.now()),
				clockOutLocation: location.coordinates
			})
				.then((result) => {
					getUserLastClock(wbs, empId)
					setStatus({ success: true, message: 'Clock out Success' })
				})
				.catch((error) => setStatus({ success: false, message: JSON.stringify(error) }))
		} else {
			setStatus({ success: false, message: 'Enable Geo location services' })
		}
	}

	const getUserLastClock = (wb, uid) => {
		if (uid !== '') {
			DbHelper.userLastClock(wb, uid)
				.then((result) => {
					setStatus({ success: true })
					if (!result) {
						setLastClock(null)
						// } else if (result.clockOutTime === undefined) {
						// 	setLastClock(result)
					} else {
						setLastClock(result)
					}
				})
				.catch((error) => setStatus({ success: false, message: JSON.stringify(error) }))
		}
	}

	return (
		<div className='App'>
			<header className='App-header'>
				<p>Time Clock</p>
				<div className='text-left d-flex'>
					<div className='inline-block mr-auto pt-1'>
						<TextBox
							label='WBS'
							value={wbs}
							readOnly
							onChange={(e) => setWbs(e.target.value)}
							//onBlur={(e) => getUserLastClock(e.target.value)}
						/>
						<TextBox
							label='Emp ID'
							value={empId}
							readOnly
							onChange={(e) => setEmpId(e.target.value)}
							//onBlur={(e) => getUserLastClock(e.target.value)}
						/>
					</div>
				</div>
				<div className='text-left d-flex'>
					<div className='inline-block mr-auto  mt-3'>
						{!lastClock && <Button label='Clock In' className='btn btn-primary' onClick={clockIn} />}
						{lastClock &&
						lastClock.clockOutTime && (
							<Button label='Clock In' className='btn btn-primary' onClick={clockIn} />
						)}
						{lastClock &&
						lastClock.clockInTime &&
						!lastClock.clockOutTime && (
							<Button label='Clock Out' className='btn btn-primary' onClick={clockOut} />
						)}
					</div>
				</div>
				{lastClock && (
					<div className='text-left d-flex'>
						<div className='inline-block mr-auto pt-1'>
							{lastClock.clockInTime && (
								<span className='label label-primary'>Clock IN : {lastClock.clockInTime} </span>
							)}
							{lastClock.clockOutTime && (
								<span className='label label-primary'>Clock Out : {lastClock.clockOutTime} </span>
							)}
						</div>
					</div>
				)}
				{status.message !== '' && (
					<div className='text-left d-flex'>
						<div className='inline-block mr-auto pt-1'>
							<span className={status.success ? 'label label-success' : 'label label-error'}>
								{status.message}
							</span>
						</div>
					</div>
				)}
				{(empId === '' || wbs === '') && (
					<div className='text-left d-flex'>
						<div className='inline-block mr-auto pt-1'>
							<span>WBS and Emp ID are required</span>
						</div>
					</div>
				)}
				{/* <div className='text-left d-flex'>
					<div className='inline-block mr-auto pt-1'>
						{location.loaded ? JSON.stringify(location.coordinates) : 'Location data not available yet.'}
					</div>
				</div> */}
			</header>
		</div>
	)
}

export default App

import React, { useState } from 'react'
import { Button, Grid } from '@material-ui/core'
import TextBox from '../Controls/TextBox'
import RadioSelection from '../Controls/RadioSelection'
import FieldSet from '../Controls/FieldSet'

export default function MapDetails (props) {
	const [ map, setMap ] = useState(props.map)
	const handleChange = (key, value) => {
		setMap({ ...map, [key]: value })
	}
	const selectFile = (key, e) => {
		if (e.target.files.length > 0) {
			setMap({ ...map, [key]: e.target.files[0] })
		}
	}

	return (
		<div style={{ paddingLeft: 100 }}>
			<Grid container spacing={1} alignContent='flex-start' alignItems='flex-start' style={{ padding: 10 }}>
				<Grid item sm={5} xs={12}>
					<TextBox
						label='Map name'
						value={map.name}
						autoFocus={true}
						disabled={map.id && map.id !== '' ? true : false}
						onChange={(e) => handleChange('name', e.target.value)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={1} alignContent='flex-start' alignItems='flex-start' style={{ padding: 10 }}>
				<Grid item sm={5} xs={12}>
					<TextBox
						label='Project name'
						value={map.project}
						disabled={map.id && map.id !== '' ? true : false}
						onChange={(e) => handleChange('project', e.target.value)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={1} alignContent='flex-start' alignItems='flex-start' style={{ padding: 10 }}>
				<Grid item md={3} sm={6} xs={12}>
					<RadioSelection
						items={[ 'XML', 'JSON' ]}
						disabled={map.id && map.id !== '' ? [ 'XML', 'JSON' ] : null}
						label='Source Type'
						value={map.sourceType}
						onChange={(e) => handleChange('sourceType', e.target.value)}
					/>
				</Grid>
				<Grid item md={3} sm={6} xs={12}>
					<RadioSelection
						items={[ 'XML', 'JSON' ]}
						disabled={map.id && map.id !== '' ? [ 'XML', 'JSON' ] : null}
						label='Target Type'
						value={map.targetType}
						onChange={(e) => handleChange('targetType', e.target.value)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={1} alignContent='flex-start' alignItems='flex-start' style={{ padding: 10 }}>
				<Grid item md={3} sm={6} xs={12}>
					<FieldSet label='Source Definition'>
						<input type='file' id='sourceFile' onChange={(e) => selectFile('sourceFile', e)} />
						{map.id && map.id !== '' && <p>{map.sFile}</p>}
					</FieldSet>
				</Grid>
				<Grid item md={3} sm={6} xs={12}>
					<FieldSet label='Target Definition'>
						<input type='file' id='targetFile' onChange={(e) => selectFile('targetFile', e)} />
						{map.id && map.id !== '' && <p>{map.tFile}</p>}
					</FieldSet>
				</Grid>
			</Grid>
			<br />
			<br />
			<Grid container spacing={1} style={{ padding: 30, textAlign: 'center' }}>
				<Grid item sm={map.id && map.id !== '' ? 6 : 6} xs={12}>
					<Button
						variant='contained'
						color='primary'
						onClick={() => (window.location.href = '/map/' + map.project + '/' + map.id)}
					>
						Reset
					</Button>
					{/* &nbsp;&nbsp;
					{map.id &&
					map.id !== '' && (
						<Button variant='contained' color='primary' onClick={() => props.skipUpload()}>
							use old definitions
						</Button>
					)} */}
					&nbsp;&nbsp;
					<Button variant='contained' color='primary' onClick={() => props.saveDetails(map)}>
						Continue
					</Button>
				</Grid>
			</Grid>
		</div>
	)
}

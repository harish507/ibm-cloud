import React from 'react'
import { Fab, Grid } from '@material-ui/core'
// import TextBox from '../../Controls/TextBox'
import FieldSet from '../../Controls/FieldSet'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

export default function Entry (props) {
	const [ selected, setSelected ] = React.useState(null)
	const [ name, setName ] = React.useState('')

	const selectFile = (e) => {
		if (e.target.files.length > 0) {
			setSelected(e.target.files[0])
			if (name.trim() === '') {
				setName(e.target.files[0].name)
			}
		}
	}

	const uploadFile = (e) => {
		if (selected && name) {
			props.uploadFile(selected, name)
			document.getElementById('upload').value = ''
			setSelected(null)
			setName('')
		} else {
			props.uiRef.Error('Please select a file and provide a file name to upload.')
		}
	}

	return (
		<FieldSet label='Upload a Map/Property file'>
			<Grid container spacing={1} alignContent='center' alignItems='center'>
				<Grid item md={8} xs={12}>
					<input type='file' id='upload' onChange={selectFile} />
				</Grid>
				<Grid item md={2} xs={12}>
					<Fab variant='round' size='small' onClick={uploadFile} color='primary'>
						<CloudUploadIcon />
					</Fab>
				</Grid>
			</Grid>
		</FieldSet>
	)
}

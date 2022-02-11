import React, { useState } from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Fab } from '@material-ui/core'
import Items from './Items'
import FolderItems from './FolderItems'
import Entry from './Entry'
import PathInfo from './PathInfo'
import FieldSet from '../../Controls/FieldSet'
import CreateFolder from './CreateFolder'
import AddIcon from '@material-ui/icons/CreateNewFolder'
import TextBox from '../../Controls/TextBox'

const folderName = 'New Folder'
export default function MapsRoutes({ uiRef }) {
	const [ volume, setVolume ] = useState({ error: false, path: '/', files: [], folders: [] })
	const [ method, setMethod ] = useState('get')
	const [ entryItem, setEntryItem ] = useState(null)
	const [ file, setFile ] = useState(null)
	const [ content, setContent ] = useState(null)
	const [ folder, setFolder ] = useState(false)
	const [ addFolder, setAddFolder ] = useState(null)
	const [ saveFile, setSaveFile ] = useState(null)

	const showError = (info) => {
		uiRef.Error(info)
		setVolume({ ...volume, error: true })
	}
	const showStatus = (status) => {
		uiRef.Success(status)
		setMethod('get')
		setEntryItem(null)
		setFolder(false)
		setSaveFile(null)
	}
	const openFolder = (folder) => {
		setMethod('')
		setTimeout(() => {
			setVolume({ ...volume, path: volume.path + folder + '/' })
			setMethod('get')
		}, 10)
	}
	const refresh = () => {
		setMethod('')
		setTimeout(() => {
			setMethod('get')
		}, 10)
	}
	const moveUp = () => {
		setMethod('')
		setTimeout(() => {
			let path = volume.path.split('/').slice(0, volume.path.split('/').length - 2)
			//if (!_.startsWith(path, '/')) path = '/' + path
			//alert(path.join('/'))
			setVolume({ ...volume, path: path.join('/') + '/' })
			setMethod('get')
		}, 10)
	}
	const viewFile = (name) => {
		setMethod('view')
		setFile(name)
	}
	const showFile = (content) => {
		setMethod('')
		setContent(content)
	}

	const uploadFile = (_file, _name) => {
		try {
			const formData = new FormData()
			formData.append('file', _file, _name)
			formData.append('info', JSON.stringify({ path: volume.path, filename: _name }))
			setMethod('post')
			setEntryItem(formData)
		} catch (error) {
			uiRef.Error(error)
		}
	}

	const deleteFile = (name) => {
		uiRef.Confirm(
			"Are you sure to delete this file '" + name + "'?",
			() => {
				setMethod('delete')
				setFile(name)
			},
			() => {}
		)
	}
	const fileDownload = (item) => {
		setMethod('download')
		setFile(item)
	}
	const showDownloadFile = (fileContent)=>{
		const element = document.createElement('a')
		const fileText = new Blob([ fileContent ], {
			type: 'text/plain;charset-utf-8'
		})
		element.href = URL.createObjectURL(fileText)
		element.download = file
		document.body.appendChild(element)
		element.click()
		setMethod('')
	}
	const createFolder = () => {
		setFolder(true)
		setAddFolder(folderName)
	}
	const saveFolder = (folderName) => {
		setAddFolder(folderName)
		setMethod('create')
	}
	const handleChange = (value) => {
		setAddFolder(value)
	}
	const handleChangeContent = (value) => {
		setContent(value)
	}
	const onSaveFile = (content) => {
		setSaveFile(content)
		setMethod('editFile')
	}
	const deleteFolder = (foldername) => {
		uiRef.Confirm(
			"Are you sure to delete this folder '" + foldername + "'?",
			() => {
				setMethod('deleteFolder')
				setFolder(foldername)
			},
			() => {}
		)
		setFolder(false)
	}

	return (
		<Grid container spacing={2}>
			<Grid item md={12}>
				<Typography variant="h4">File Manager</Typography>
				{method === 'get' && (
					<ServiceHelper
						path={'filesAndFolders?path=' + volume.path}
						render={(info) => {
							return (
								<div>
									{info.payload && setVolume(info.payload) && setMethod('')}
									{info.error && showError(info.error)}
									{uiRef && uiRef.Loading(info.loading)}
								</div>
							)
						}}
					/>
				)}
				{method === 'delete' && (
					<ServiceHelper
						method="post"
						path="deleteFile"
						input={{ path: volume.path, filename: file }}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showStatus('Map/Property file deleted successfully')}
								</div>
							)
						}}
					/>
				)}

				{method === 'view' && (
					<ServiceHelper
						method="post"
						path="viewFile"
						input={{ path: volume.path, filename: file }}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{result.error && setMethod('')}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showFile(result.payload)}
								</div>
							)
						}}
					/>
				)}

				{method === 'post' &&
				entryItem !== null && (
					<ServiceHelper
						method="post"
						path="files"
						optHeaders={{ 'Content-type': 'multipart/form-data' }}
						input={entryItem}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showStatus('Map/Property file uploaded successfully')}
								</div>
							)
						}}
					/>
				)}

				{method === 'create' &&  (
					<ServiceHelper
						method="post"
						path="createFolder"
						input={{ path: volume.path, foldername: addFolder }}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showStatus('Map/Property folder created successfully')}
								</div>
							)
						}}
					/>
				)}
				{method === 'editFile' && file && 
				saveFile && (
					<ServiceHelper
						method="post"
						path="editFile"
						input={{ path: volume.path, filename: file, content: saveFile }}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showStatus('File updated successfully')}
								</div>
							)
						}}
					/>
				)}
				{method === 'download' && (
					<ServiceHelper
						method="post"
						path="viewFile"
						input={{ path: volume.path, filename: file }}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{result.error && setMethod('')}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showDownloadFile(result.payload)}
								</div>
							)
						}}
					/>
				)}
				{method === 'deleteFolder' && (
					<ServiceHelper
						method="post"
						path="deleteFolder"
						input={{ path: volume.path, foldername: folder }}
						render={(result) => {
							return (
								<div>
									{result.error && uiRef.Error(result.error)}
									{uiRef && uiRef.Loading(result.loading)}
									{result.payload && showStatus('Map/Property folder deleted successfully')}
								</div>
							)
						}}
					/>
				)}
				{content && (
					<Dialog open={content ? true : false} onClose={() => setContent(null)} maxWidth="md" fullWidth >
						<DialogTitle>{file}</DialogTitle>
						<form>
							<DialogContent style ={{height:400}}>
									{content !== null && (
										<TextBox
											multiline
											rows='22'
											value={content}
											onChange={(e) => handleChangeContent(e.target.value)}
										/>
									)}
							</DialogContent>
							</form>
							<DialogActions>
								<Button onClick={() => setContent(null)} color="primary">
									Close
								</Button>
								<Button color="primary" variant="contained" onClick={() => onSaveFile(content)}>
									Save
								</Button>
							</DialogActions>
						
					</Dialog>
				)}
			</Grid>
			<Grid item md={6}>
				<PathInfo path={volume.path} moveUp={moveUp} refresh={refresh} />
			</Grid>
			<Grid item md={5}>
				{volume.path !== '/.camel/' && <Entry uiRef={uiRef} uploadFile={uploadFile} />}
			</Grid>
			<Grid item md={1}>
				<FieldSet label="Options" style={{ minHeight: 60 }}>
					<Grid container spacing={1} alignContent="center" alignItems="center">
						<Grid item md={12}>
							<Fab variant="extended" size="small" color="primary" onClick={createFolder}>
								<AddIcon />
							</Fab>
						</Grid>
					</Grid>
				</FieldSet>
			</Grid>
			<Grid item sm={12}>
				<FieldSet label="Folders">
					{volume.folders.length === 0 && <Typography variant="body1">No folders in this path.</Typography>}
					{volume.folders.length > 0 && (
						<FolderItems items={volume.folders} openFolder={openFolder} onDelete={deleteFolder} />
					)}
				</FieldSet>
			</Grid>
			<Grid item md={12}>
				<FieldSet label="Files">
					{volume.files.length === 0 && <Typography variant="body1">No files in this path.</Typography>}
					{volume.files.length > 0 && (
						<Items
							items={volume.files}
							update={true}
							onDelete={deleteFile}
							onShow={viewFile}
							uiRef={uiRef}
							content={content}
							fileDownload={fileDownload}
						/>
					)}
				</FieldSet>
			</Grid>
			{folder === true &&<CreateFolder
				item={folder}
				folder={addFolder}
				saveFolder={saveFolder}
				handleChange={handleChange}
				onCancel={() => setFolder(false)}
			/>}
		</Grid>
	)
}

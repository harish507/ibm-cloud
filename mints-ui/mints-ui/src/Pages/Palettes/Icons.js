import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FaIcon from '../Template/FaIcon'
import TextBox from '../../Controls/TextBox'

const faIcons = require('@fortawesome/free-solid-svg-icons')

export default function Icons (props) {
	const [ icon, setIcon ] = React.useState(props.icon)
	const [ search, setSearch ] = React.useState(props.icon)

	const selectIcon = (value) => {
		setIcon(value)
	}

	const submitForm = (e) => {
		e.preventDefault()
		props.updateIcon(icon)
	}

	return (
		<div>
			<Dialog open={icon ? true : false} onClose={props.onCancel} maxWidth='sm' fullWidth>
				<DialogTitle>
					<TextBox label='Search Icon' value={search} onChange={(e) => setSearch(e.target.value)} />
				</DialogTitle>
				<form>
					<DialogContent style={{ minHeight: 350, height: 350, overflow: 'auto' }}>
						<div>
							{Object.keys(faIcons)
								.filter((x) => x.toLowerCase().includes(search.toLowerCase()))
								.map((i) => {
									return (
										i !== '' &&
										faIcons[i].icon && (
											<Button
												style={{ textTransform: 'none' }}
												color={icon === i ? 'primary' : 'default'}
												variant={icon === i ? 'contained' : 'outlined'}
												onClick={() => selectIcon(i)}
											>
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														width: 100,
														overflow: 'hidden',
														textAlign: 'center',
														alignItems: 'center',
														alignContent: 'center',
														justifyContent: 'center'
													}}
												>
													<FaIcon key={i} icon={i} size='2x' />
													<span>{i}</span>
												</div>
											</Button>
										)
									)
								})}
							{/* {Object.keys(faIcons.fas).filter((x) => x.toLowerCase().includes(search.toLowerCase())).map((i) => {
								return (
									i !== '' &&
									faIcons.fas[i].icon && (
										<Button
											color='default'
											variant={icon === i ? 'contained' : 'text'}
											onClick={() => props.updateIcon(i)}
										>
											<FaIcon key={i} icon={i} size='2x' />
										</Button>
									)
								)
							})} */}
						</div>
					</DialogContent>
					<DialogActions>
						<Button onClick={props.onCancel} color='primary' variant='outlined'>
							Cancel
						</Button>
						<Button type='submit' onClick={submitForm} color='primary' variant='contained'>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	)
}

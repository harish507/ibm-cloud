import React from 'react'
import { Button, Grid, makeStyles } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import DescriptionIcon from '@material-ui/icons/Description'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

const useStyles = makeStyles((theme) => ({
	button: {
		padding: 8,
		paddingLeft: 20,
		paddingRight: 0,
		margin: 0,
		border: '1px solid #aaa',
		borderLeft: '5px solid ' + theme.palette.primary.main,
		borderRadius: 5,
		display: 'flex',
		width: '100%',
		justifyContent: 'flex-start',
		justifyItems: 'center',
		backgroundColor: '#fff',
		textTransform: 'none',
		'&:hover': {
			boxShadow: '2px 2px #999'
		}
	},
	icon: {
		position: 'relative',
		right: 60,
		top: 12,
		padding: 0,
		margin: 0,
		marginRight: 20,
		float: 'right',
		maxWidth: 10,
		maxHeight: 10,
		minWidth: 10,
		minHeight: 10
	}
}))

export default function Items (props) {
	const classes = useStyles();
	return (
		<Grid container spacing={1}>
			{props.items.map((item, index) => {
				return (
					<Grid item container key={index} md={4} xs={12}>
						<Grid item md={10} xs={12}>
							<Button
								className={classes.button}
								size='small'
								variant='text'
								color='default'
								onClick={() => props.onShow(item)}
							> 
								<DescriptionIcon style={{ marginRight: 10 }} />
								{item}
							</Button>
						</Grid>
						<Grid item md={2} xs={12} style={{display:'Flex'}}>
							{props.update && (
								<Button
									size='small'
									variant='text'
									color='secondary'
									className={classes.icon}
									onClick={() => props.onDelete(item)}
								>
									<DeleteIcon />
								</Button>
							)}
							
							{props.update && (<Button
								size='small'
								variant='text'
								color='primary'
								className={classes.icon}
								onClick={() => props.fileDownload(item)}
							>
							<CloudDownloadIcon />
							</Button>)}
						</Grid>
						
						
					</Grid>
				)
			})}
		</Grid>
	)
}

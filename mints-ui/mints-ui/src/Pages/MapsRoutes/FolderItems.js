import React from 'react'
import { Button, Grid, makeStyles } from '@material-ui/core'
import FolderIcon from '@material-ui/icons/FolderOpen'
import DeleteIcon from '@material-ui/icons/Delete'

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
		right: 0,
		top: 12,
		padding: 0,
		margin: 0,
		marginRight: 60,
		float: 'right',
		maxWidth: 10,
		maxHeight: 10,
		minWidth: 10,
		minHeight: 10
	}
}))

export default function FolderItems(props) {
	const classes = useStyles()

	return (
		<Grid container spacing={2}>
			{props.items.map((item, index) => {
				return (
					<Grid item container key={index} md={3} xs={12}>
						<Grid item md={10} xs={12}>
							<Button
								className={classes.button}
								size="small"
								variant="text"
								color="default"
								onClick={() => props.openFolder(item)}
							>
								<FolderIcon style={{ marginRight: 10 }} />
								{item}
							</Button>
						</Grid>
						<Grid item md={1} xs={12}>
							<Button
								size="small"
								variant="text"
								color="secondary"
								className={classes.icon}
								onClick={() => props.onDelete(item)}
							>
								<DeleteIcon />
							</Button>
						</Grid>
					</Grid>
				)
			})}
		</Grid>
	)
}

import React from 'react'
import TemplatePicture from './TemplatePicture'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	button: {
		padding: 0,
		margin: 0,
		width: 210,
		overflow: 'hidden',
		border: '1px solid ' + theme.palette.primary.main,
		///borderBottom: '2px solid ' + theme.palette.primary.main,
		borderRadius: 10,
		backgroundColor: '#fff',
		boxShadow: '2px 2px #999',
		cursor: 'pointer',
		'&:hover': {
			fontWeight: 500,
			boxShadow: '4px 4px #999',
			//border: '2px solid ' + theme.palette.secondary.main,
			backgroundColor: '#fff'
		}
	},
	selectedButton: {
		padding: 0,
		margin: 0,
		width: 210,
		overflow: 'hidden',
		border: '1px solid ' + theme.palette.secondary.main,
		///borderBottom: '2px solid ' + theme.palette.primary.main,
		borderRadius: 10,

		backgroundColor: '#fff',
		boxShadow: '2px 2px #999',
		cursor: 'pointer',
		'&:hover': {
			fontWeight: 500,
			boxShadow: '4px 4px #999',
			//border: '2px solid ' + theme.palette.secondary.main,
			backgroundColor: '#fff'
		}
	},
	title: {
		backgroundColor: theme.palette.primary.main,
		color: '#fff',
		height: 30,
		paddingTop: 10
	},
	selectedTitle: {
		backgroundColor: theme.palette.secondary.main,
		color: '#fff',
		height: 30,
		paddingTop: 10
	}
}))

export default function TemplateButton (props) {
	const { tpl } = props
	const classes = useStyles()

	return (
		<button
			variant='text'
			className={tpl.id === props.templateId ? classes.selectedButton : classes.button}
			onClick={props.onClick}
		>
			<div>
				<div
					style={{
						padding: tpl.palettes.length === 2 ? 40 : tpl.palettes.length === 3 ? 25 : 10,
						height: tpl.palettes.length === 2 ? 100 : tpl.palettes.length === 3 ? 130 : 160,
						width: '85%',
						overflow: 'hidden'
					}}
				>
					<TemplatePicture template={tpl} />
				</div>
				<div className={tpl.id === props.templateId ? classes.selectedTitle : classes.title}>
					<span style={{ textTransform: 'initial' }}>{tpl.name}</span>
				</div>
			</div>
		</button>
	)
}

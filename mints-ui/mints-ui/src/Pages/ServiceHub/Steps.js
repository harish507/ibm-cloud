import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import EditIcon from '@material-ui/icons/Edit'
import ViewListIcon from '@material-ui/icons/ViewList'
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide'
import PublishIcon from '@material-ui/icons/Publish'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import RateReviewIcon from '@material-ui/icons/RateReview'
import StepConnector from '@material-ui/core/StepConnector'
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";

const ColorlibConnector = withStyles({
	alternativeLabel: {
		top: 20
	},
	active: {
		'& $line': {
			backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
		}
	},
	completed: {
		'& $line': {
			backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
		}
	},
	line: {
		height: 3,
		border: 0,
		backgroundColor: '#42a5f5', //'#eaeaf0',
		borderRadius: 1
	}
})(StepConnector)

const useColorlibStepIconStyles = makeStyles({
	root: {
		backgroundColor: '#42a5f5',
		zIndex: 1,
		color: '#fff',
		width: 40,
		height: 40,
		display: 'flex',
		borderRadius: '50%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	active: {
		backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
		boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
	},
	completed: {
		backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
	}
})

function ColorlibStepIcon (props) {
	const classes = useColorlibStepIconStyles()
	const { active, completed } = props

	const icons = {
		1: <EditIcon />,
		2: <ViewListIcon />,
		4: <RateReviewIcon />,
		3: <KeyboardHideIcon />,
		5: <PublishIcon />,
		6: <CheckCircleOutlineIcon />
	}

	return (
		<div
			className={clsx(classes.root, {
				[classes.active]: active,
				[classes.completed]: completed
			})}
		>
			{icons[String(props.icon)]}
		</div>
	)
}

ColorlibStepIcon.propTypes = {
	active: PropTypes.bool,
	completed: PropTypes.bool,
	icon: PropTypes.node
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	button: {
		marginRight: theme.spacing(1)
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	}
}))

function getSteps () {
	return [ 'Service Info', 'Service Definition', 'Review' ]
}

export default function CustomizedSteppers (props) {
	const classes = useStyles()
	const [ activeStep, setActiveStep ] = React.useState(0)
	const steps = getSteps()

	React.useEffect(
		() => {
			setActiveStep(props.step)
		},
		[ props.step ]
	)
	return (
		<div className={classes.root} style={{marginBottom: 20}}>
			<Stepper
				alternativeLabel
				activeStep={activeStep}
				connector={<ColorlibConnector />}
				style={{ margin: 0, padding: 0 }}
			>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
		</div>
	)
}

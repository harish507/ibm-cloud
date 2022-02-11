import React from 'react'
import { Button } from '@material-ui/core'
// import HelpIcon from '@material-ui/icons/Help'
// import { Steps } from 'intro.js-react'

// const newPalette = {
// 	group: 'Inputs & Outputs',
// 	name: '',
// 	type: 'inlet',
// 	icon: 'faQuestion',
// 	properties: []
// }
//const _initialStep = 0
// var _steps = [
// 	{
// 		element: '.intro-1',
// 		intro: 'New Palettes Field to be added'
// 	},
// 	{
// 		element: '.intro-2',
// 		intro: 'List of palettes name'
// 	}
// ]

export default function Items (props) {
	// const [ stepsEnabled, setStepsEnabled ] = useState(false)
	// const [ initialStep ] = useState(0)
	// const [ steps ] = useState(_steps)

	// const selectPalette = (ind) => {
	// 	if (ind < props.items.length) {
	// 		props.showPalette(props.items[ind])
	// 	} else {
	// 		props.showPalette({ ...newPalette })
	// 	}
	// }

	// const startIntro = () => {
	// 	selectPalette(props.items.length)
	// 	setStepsEnabled(true)
	// }
	// const onStepChange = (currentStep) => {}
	// const onExit = () => {
	// 	props.showPalette(null)
	// 	setStepsEnabled(false)
	// }

	return (
		<React.Fragment>
			{/* <Steps
				enabled={stepsEnabled}
				steps={steps}
				initialStep={initialStep}
				onChange={onStepChange}
				onExit={onExit}
			/>
			<Button align='right' onClick={startIntro}>	
				<HelpIcon />
			</Button> */}
			<div className='palette-group'>
				<Button
					style={{ textTransform: 'none', width: '100%', padding: 3, margin: 0 }}
					className='intro-1'
					variant={props.palette && !props.palette._id ? 'contained' : 'text'}
					onClick={() => props.showPalette(props.items.length)}
				>
					New Palette
				</Button>
			</div>
			<div className='palette-group'>
				<div className={[ 'palette-group-header color-light' ]}>Palettes</div>
				{props.items &&
				props.items.length > 0 && (
					<div className='palette-group-content' style={{ display: 'flex', flexDirection: 'column' }}>
						{props.items.map((item, index) => (
							<Button
								className='intro-2'
								key={index}
								color='default'
								variant={props.palette && props.palette.name === item.name ? 'contained' : 'text'}
								style={{ textTransform: 'none', padding: 5, margin: 0 }}
								scope='row'
								onClick={() => props.showPalette(index)}
							>
								{item.name}
							</Button>
						))}
					</div>
				)}
			</div>
		</React.Fragment>
	)
}

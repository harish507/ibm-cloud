import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import { Configuration, Template, Masters, Defaults, Services, Palettes, MapsRoutes, Applications,Welcome } from '../'
import UIHelper from '../../Helpers/UIHelper'

const uiRef = React.createRef()

export default function Admin ({ page }) {
	const [ value, setValue ] = React.useState(false)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<React.Fragment>
			<UIHelper ref={uiRef} />
			{!page && (
				<div className='content'>
					<Paper>
						<Tabs
							value={value}
							centered
							indicatorColor='secondary'
							textColor='secondary'
							onChange={handleChange}
						>
							{/* <Tab label='Templates' value={0} /> */}
							<Tab label='Masters' value={1} />
							<Tab label='Defaults' value={2} />
							<Tab label='Services' value={3} />
							<Tab label='Palettes' value={4} />
							<Tab label='Maps & Properties' value={5} />
						</Tabs>
					</Paper>
					{value === 0 && <Template uiRef={uiRef.current} />}
					{value === 1 && <Masters uiRef={uiRef} />}
					{value === 2 && <Defaults uiRef={uiRef} />}
					{value === 3 && <Services uiRef={uiRef.current} />}
					{value === 4 && <Palettes uiRef={uiRef.current} />}
					{value === 5 && <MapsRoutes uiRef={uiRef.current} />}
					{value === 6 && <Welcome uiRef={uiRef.current} />}
				</div>
			)}
			{page && (
				<div className='content'>
					{page === 'configuration' && <Configuration uiRef={uiRef.current} />}
					{page === 'templates' && <Template uiRef={uiRef.current} />}
					{page === 'masters' && <Masters uiRef={uiRef} />}
					{page === 'defaults' && <Defaults uiRef={uiRef} />}
					{page === 'services' && <Services uiRef={uiRef.current} />}
					{page === 'palettes' && <Palettes uiRef={uiRef.current} />}
					{page === 'mapsRoutes' && <MapsRoutes uiRef={uiRef.current} />}
					{page === 'applications' && <Applications uiRef={uiRef.current} />}
					{page === 'welcome' && <Welcome uiRef={uiRef.current} />}
				</div>
			)}
		</React.Fragment>
	)
}

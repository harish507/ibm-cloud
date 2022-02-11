import React from 'react'
import ToolBar from './ToolBar'
import Target from './Target'
import { Grid } from '@material-ui/core'
import Properties from './Properties'

export default function Palettes (props) {
	return (
		<Grid container spacing={2}>
			<Grid item md={2} sm={3} xs={12} className='intro-tmp-palettes'>
				<ToolBar palettes={props.palettes} processItem={props.addNode} />
			</Grid>
			{/* <Grid item md={5} >
                <Target nodes={props.nodes} 
                    removeNode = {props.removeNode}
                    moveNode={props.moveNode} />
            </Grid> */}
			<Grid item md={7} sm={5} xs={12} className='intro-tmp-target'>
				<div className='palette-group'>
					<div className='palette-group-header color-light'>Drag your palettes</div>
					<div className='palette-group-content'>
						<Target nodes={props.nodes} removeNode={props.removeNode} moveNode={props.moveNode} />
					</div>
				</div>
			</Grid>
			<Grid item md={3} sm={4} xs={12} className='intro-tmp-properties'>
				<div className='palette-group'>
					<div className='palette-group-header color-light'>Properties</div>
					<div className='palette-group-content' style={{ minHeight: 455 }}>
						<Properties nodes={props.nodes} hideProps={props.hideProps} setHideProps={props.setHideProps} />
					</div>
				</div>
			</Grid>
		</Grid>
	)
}

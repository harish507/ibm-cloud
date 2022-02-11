import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
// import SubdirectoryArrowLeftIcon  from '@material-ui/icons/SubdirectoryArrowLeft'
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight'

import FaIcon from './FaIcon'

export default function TargetItem (props) {
	const { node } = props
	return (
		<React.Fragment>
			<Grid container spacing={0}>
				{props.index > 0 && (
					<div style={{ marginLeft: 40 * (props.index - 1) + 5, color: '#aaa' }}>
						<SubdirectoryArrowRightIcon fontSize='large' />
					</div>
				)
				// <Grid item md={props.index} className="target-arrow" >
				//     <SubdirectoryArrowRightIcon fontSize="large" />
				// </Grid>
				}
				<Grid item md={3}>
					<Grid container spacing={0} className={'target-item ' + node.type}>
						{/* <Grid item md={1} sm={3} /> */}
						<Grid item md={2} sm={3} style={{ paddingLeft: 10 }}>
							<FaIcon icon={node.icon} />
						</Grid>
						<Grid item md={7} sm={6} style={{ paddingTop: 3 }}>
							<Typography component='span' variant='body1'>
								{node.name}
							</Typography>
						</Grid>
						{props.handleRemove && (
							<Grid item md={2} sm={3} style={{ paddingTop: 3 }}>
								<Button
									className='target-close'
									variant='text'
									color='inherit'
									style={{ margin: 0, padding: 0 }}
									onClick={props.handleRemove}
								>
									<CloseIcon />
								</Button>
							</Grid>
						)}
						<Grid item md={1} sm={3} />
					</Grid>
				</Grid>
				{/* { props.index > 0 && (props.index % 2) === 0 && 
                    <Grid item md={1} className="target-arrow" >
                        <SubdirectoryArrowLeftIcon fontSize="large"  />
                    </Grid>} */}
			</Grid>
		</React.Fragment>
	)
}

import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import FaIcon from '../Template/FaIcon'
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight'

export default function TemplatePicture (props) {
	return (
		<div className='target-item-picture'>
			{/* { (props.index % 2) > 0  &&
                <Grid item md={1} >
                    <SubdirectoryArrowRightIcon fontSize="medium" />
                </Grid>} */}
			{props.template.palettes.map((node, index) => {
				return (
					<div key={index} style={{ width: 300, display: 'flex', flexDirection: 'row', marginBottom: 2 }}>
						<div style={{ width: index * 25, textAlign: 'right', color: '#999' }}>
							{index > 0 && <SubdirectoryArrowRightIcon fontSize='small' />}
						</div>
						<Grid container spacing={1} style={{ width: 125 }} className={'target-item-small1'}>
							<Grid item md={4}>
								<div className={node.type} style={{ borderRadius: 50, padding: 1 }}>
									<FaIcon size='lg' icon={node.icon} />
								</div>
							</Grid>
							<Grid item md={8} style={{ textAlign: 'left', verticalAlign: 'middle' }}>
								<Typography variant='body2' style={{ color: '#666' }} noWrap>
									{node.name}
								</Typography>
							</Grid>
						</Grid>
					</div>
				)
			})}
			{/* { props.index > 0 && (props.index % 2) === 0 && 
                <Grid item md={1}  >
                    <SubdirectoryArrowLeftIcon fontSize="medium"  />
                </Grid>} */}
		</div>
	)
}

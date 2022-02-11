import React from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
import Wizard from './Wizard'
import UIHelper from '../../Helpers/UIHelper'

export default function Integration (props) {
	const { match: { params } } = props
	const uiRef = React.useRef()

	return (
		<div className='content'>
			<ServiceHelper
				path='masters'
				render={(data) => {
					return (
						<ServiceHelper
							path='defaults'
							render={(defaults) => {
								return (
									<ServiceHelper
										path='userExits'
										render={(exits) => {
											//alert(JSON.stringify(exits.payload))
											return (
												<ServiceHelper
													path='applications'
													render={(config) => {
														return (
															<ServiceHelper
																path={'ibmMqConfig/v0'}
																render={(mqConfig) => {
																	return (
																		<React.Fragment>
																			<UIHelper ref={uiRef} />
																			{!data.loading &&
																				!data.error &&
																				!defaults.loading &&
																				!defaults.error &&
																				!exits.loading &&
																				!exits.error &&
																				mqConfig.payload &&
																				config.payload && (
																					<React.Fragment>
																						{params.id === undefined && (
																							<Wizard
																								uiRef={uiRef.current}
																								masters={data.payload}
																								defaults={defaults.payload}
																								appConfig={config.payload}
																								userExits={exits.payload}
																								mqConfig={mqConfig.payload}
																							/>
																						)}

																						{params.id !== undefined && (
																							<ServiceHelper
																								path={'integrations/' + params.id}
																								render={(details) => {
																									return (
																										<Wizard
																											uiRef={uiRef.current}
																											details={details.payload}
																											masters={data.payload}
																											defaults={defaults.payload}
																											appConfig={config.payload}
																											userExits={exits.payload}
																											mqConfig={mqConfig.payload}
																										/>
																									)
																								}}
																							/>
																						)}
																					</React.Fragment>
																				)}

																			{uiRef.current && uiRef.current.Loading(data.loading)}

																			{data.error && <error>Error processing request</error>}
																			{data.error && uiRef.current.Error(data.error)}
																		</React.Fragment>
																	)
																}}
															/>
														)
													}}
												/>
											)
										}}
									/>
								)
							}}
						/>
					)
				}}
			/>
		</div>
	)
}

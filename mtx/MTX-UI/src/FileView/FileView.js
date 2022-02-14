import React, { useState, useEffect } from 'react'
import RestHelper from '../Helpers/RestHelper'

export default function FileView (props) {
	const [ file, setFile ] = useState('')

	useEffect(
		() => {
			//alert(props.id)
			if (props.id !== undefined) {
				RestHelper.get('file/' + props.project + '/' + props.id)
					.then((obj) => {
						if (obj && obj.Success) {
							setFile('')
							setTimeout(() => {
								setFile(obj.Result)
							}, 10)
						} else {
							props.uiRef.Error(obj.Message)
						}
					})
					.catch((err) => props.uiRef.Error(err))
			} else {
				setFile('')
			}
		},
		[ props.id, props.project, props.uiRef ]
	)

	return (
		<div>
			<h3>{props.project + ' > ' + props.id}</h3>
			<div style={{ padding: 30 }}>
				<pre>{file}</pre>
			</div>
		</div>
	)
}

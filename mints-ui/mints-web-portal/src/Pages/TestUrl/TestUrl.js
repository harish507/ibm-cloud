import React, { useState } from 'react'
import { Grid } from '@material-ui/core/'
import TextBox from '../../Controls/TextBox'
import RadioButtons from '../../Controls/RadioButtons'
import Button from '../../Controls/Button'
import RestHelper from '../../Helpers/RestHelper'

function isHtml (obj) {
	try {
		//Using W3 DOM2 (works for FF, Opera and Chrome)
		return obj instanceof HTMLElement
	} catch (e) {
		//Browsers not supporting W3 DOM2 don't have HTMLElement and
		//an exception is thrown and we end up here. Testing some
		//properties that all elements have (works on IE7)
		return (
			typeof obj === 'object' &&
			obj.nodeType === 1 &&
			typeof obj.style === 'object' &&
			typeof obj.ownerDocument === 'object'
		)
	}
}

export default function TestUrl () {
	const [ url, setUrl ] = useState('')
	const [ method, setMethod ] = useState('GET')
	const [ body, setBody ] = useState('')
	const [ response, setResponse ] = useState(null)

	const getResponse = (e) => {
		e.preventDefault()
		switch (method) {
			case 'GET':
				return RestHelper.get('/url?url=' + url, body)
					.then(({ Result, Message }) => {
						if (Result) {
							let result = Result.Result ? Result.Result : Result
							setResponse(isHtml(result) ? result : JSON.stringify(result, null, 4))
						} else {
							setResponse(Message)
						}
					})
					.catch((error) => setResponse(error.Message ? error.Message : JSON.stringify(error)))
			case 'POST':
				return RestHelper.post('/url?url=' + url, body, 'xml')
					.then((result) => setResponse(result.Result ? result.Result : JSON.stringify(result)))
					.catch((error) => setResponse(error.Message ? error.Message : JSON.stringify(error)))
			case 'PUT':
				return RestHelper.put('/url?url=' + url, body)
					.then((result) => setResponse(result.Result ? result.Result : JSON.stringify(result)))
					.catch((error) => setResponse(error.Message ? error.Message : JSON.stringify(error)))
			case 'DELETE':
				return RestHelper.delete('/url?url=' + url, body)
					.then((result) => setResponse(result.Result ? result.Result : JSON.stringify(result)))
					.catch((error) => setResponse(error.Message ? error.Message : JSON.stringify(error)))
			default:
				return null
		}
	}

	return (
		<div className='content'>
			<Grid container spacing={2}>
				{/* <Grid item md={2} style={{ display: 'flex', flexDirection: 'column' }}>
					urls
				</Grid> */}
				<Grid item md={12}>
					<form style={{ flex: 1, display: 'flex', flexDirection: 'row' }} onSubmit={getResponse}>
						<Grid container spacing={2}>
							<Grid item md={6}>
								<RadioButtons
									style={{ width: 100 }}
									label='Method'
									items={[ 'GET', 'POST', 'PUT', 'DELETE' ]}
									value={method}
									onChange={(val) => setMethod(val)}
								/>
								<Grid container spacing={2}>
									<Grid item md={10}>
										<TextBox label='Url' value={url} onChange={(e) => setUrl(e.target.value)} />
									</Grid>
									<Grid item md={2}>
										<Button style={{ height: 30, width: 30 }} label='Go' onClick={getResponse} />
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={6}>
								<TextBox
									multiline
									rows='3'
									label='Body'
									value={body}
									onChange={(e) => setBody(e.target.value)}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
				<Grid item md={6}>
					<div
						style={{
							flex: 1,
							width: '100%',
							minHeight: 400
						}}
					>
						{response && <div dangerouslySetInnerHTML={{ __html: response }} />}
					</div>
				</Grid>
				<Grid item md={6}>
					<div
						style={{
							flex: 1,
							width: '100%',
							minHeight: 400
						}}
					>
						{response && <div>{JSON.stringify(response, null, 4)}</div>}
					</div>
				</Grid>
			</Grid>
		</div>
	)
}

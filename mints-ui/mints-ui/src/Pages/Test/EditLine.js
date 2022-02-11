import React, { useState } from 'react'
import _ from 'lodash'

const keywords = [ 'Given', 'variable', 'And', 'When', 'Then' ]

export default function EditLine (props) {
	const [ keys, setKeys ] = useState([])
	React.useEffect(
		() => {
			if (keys.length > 0) return
			let list = []
			props.item.text.split(' ').forEach((k, i) => list.push({ text: k, val: replaceAll(k, '%%%', '"') }))
			// if (props.details) {
			// 	list.forEach((l, i) => {
			// 		if (l.val.trim() === '"INTID"') {
			// 			l.val = '"' + props.details.id + '"'
			// 		}
			// 		if (l.val.trim() === '"COUNTRY"') {
			// 			l.val = '"' + props.details.country + '"'
			// 		}
			// 		if (l.val.trim() === '"ENVIRONMENT"') {
			// 			l.val = '"' + props.details.environment + '"'
			// 		}
			// 	})
			// }
			setKeys(list)
			props.update(list.map((i) => i.val).join(' '))
		},
		[ props, props.source, keys ]
	)

	const changeValue = (ind, val) => {
		let list = [ ...keys ]
		list[ind].val = '"' + val + '"'
		setKeys(list)
		if (val.trim().length > 0) {
			props.update(list.map((i) => i.val).join(' '))
		} else {
			props.update('')
		}
	}
	const replaceAll = (source, inText, outText) => {
		inText = inText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		return source.replace(new RegExp(inText, 'g'), outText)
	}

	return (
		<div>
			{/* <p>{props.children}</p> */}
			{/* {keys.length > 0 && <p>{keys.join('-')}</p>} */}
			{keys.length > 0 &&
				keys.map((key, ind) => {
					return (
						<span key={ind}>
							{!_.startsWith(key.text, '%%%') ? (
								<span>{
									
									(keywords.includes(key.val) ? '' : _.startsWith(key.val, '"<') ? _.lowerCase(replaceAll(key.val, '"', '')
										.replace('<', '').replace('>', '')) + ' ' : replaceAll(key.val, '"', ' ') + ' ')
								}
								</span>
							) : (
								<input
									type='text'
									style={{ width: 100 }}
									value={replaceAll(key.val, '"', '')}
									onChange={(e) => changeValue(ind, e.target.value)}
								/>
							)}
						</span>
					)
				})}
		</div>
	)
}

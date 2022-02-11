import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import  {faSignInAlt}  from '@fortawesome/free-solid-svg-icons'

export default function FaIcon (props) {
	return (
		<FontAwesomeIcon
			size={props.size ? props.size : 'sm'}
			color={props.color ? props.color : 'primary'}
			icon={require('@fortawesome/free-solid-svg-icons')[props.icon]}
		/>
	)
}

import React, { createContext, useState } from 'react'

const UserContext = createContext()

export const UserContextProvider = (props) => {
	const [ user, setUser ] = useState(null) //{ name: 'Mints Admin', role: 'Administrator' }
	const login = (info) => {
		if (info) {
			sessionStorage.setItem('user', JSON.stringify(info))
			setUser(info)
		}
	}
	const logout = () => {
		setUser(null)
		setTimeout(() => {
			sessionStorage.user = null
			sessionStorage.removeItem('user')
			window.location.href = '/'
		}, 10)
	}
	return <UserContext.Provider value={{ user, login, logout }}>{props.children}</UserContext.Provider>
}

export default UserContext

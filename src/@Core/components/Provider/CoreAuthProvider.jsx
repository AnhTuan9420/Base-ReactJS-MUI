import React, { useContext, useState } from 'react'
// import PropTypes from 'prop-types'
const CoreAuthContext = React.createContext()

export const useCoreAuthContext = () => useContext(CoreAuthContext)

const CoreAuthProvider = props => {
	const [auth, setAuth] = useState({
		user: null,
		isLogged: false,
		isLoading: false
	})
	return (
		<CoreAuthContext.Provider
			value={{
				...auth,
				setAuth
			}}
		>
			{props.children}
		</CoreAuthContext.Provider>
	)
}

//CoreAuthProvider.defaultProps = {}

//CoreAuthProvider.propTypes = {}

export default React.memo(CoreAuthProvider)

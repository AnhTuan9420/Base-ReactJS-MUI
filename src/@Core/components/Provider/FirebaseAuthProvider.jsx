// import { authFirebase } from '@Core/helper/Firebase'

import React, { useContext, useEffect, useState } from 'react'
// import PropTypes from 'prop-types'

import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { errorMsg, successMsg } from '@Core/helper/Message'
import { authService } from '@App/Social/services/authService'
import { getSocialUser, setFirebaseToken, setTraveloUser } from '@Core/helper/Session'

import { hideLoadingPage, showLoadingPage } from '@Core/helper/System'
import { CoreLoadingFullPage } from '@Core/components/Loading/CoreLoadingFullPage'

const FirebaseAuthContext = React.createContext()

export const useFirebaseAuthContext = () => useContext(FirebaseAuthContext)

const FirebaseAuthProvider = props => {
	const [auth, setAuth] = useState()
	const [authLoading, setAuthLoading] = useState(true)
	const [authRole, setAuthRole] = useState('guest')
	// useEffect(() => {
	// 	// const user = authFirebase.currentUser
	// 	onAuthStateChanged(authFirebase, user => {
	// 		if (user) {
	// 			// User is signed in, see docs for a list of available properties
	// 			// https://firebase.google.com/docs/reference/js/firebase.User
	// 			setAuth(user)
	// 			setAuthLoading(false)
	// 			setAuthRole('user')
	// 			// ...
	// 		} else {
	// 			// User is signed out
	// 			// ...
	// 			setAuth(null)
	// 			setAuthRole('guest')
	// 			setAuthLoading(false)
	// 		}
	// 	})
	// }, [])

	const handleSignInFirebase = async (mail, password) => {
		showLoadingPage()
		hideLoadingPage()
	}

	const handleSignout = async () => {
		try {
			showLoadingPage()
			authService.logout(getSocialUser())
			// await signOut(authFirebase)
			setAuth(null)
			setAuthRole('guest')

			successMsg('Logout success')
			localStorage.clear()
			sessionStorage.clear()
			hideLoadingPage()
			return true
		} catch (e) {
			errorMsg(error)
		}
		hideLoadingPage()
	}

	return (
		<FirebaseAuthContext.Provider
			value={{
				handleSignInFirebase,
				handleSignout,
				auth,
				authLoading,
				authRole
			}}
		>
			{authLoading ? (
				<CoreLoadingFullPage />
			) : (
				<>
					{props.children}
					<div id="firebaseui-auth-container" />
				</>
			)}
		</FirebaseAuthContext.Provider>
	)
}

//FirebaseAuthProvider.defaultProps = {}

//FirebaseAuthProvider.propTypes = {}

export default React.memo(FirebaseAuthProvider)

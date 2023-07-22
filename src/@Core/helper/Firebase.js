// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { LOCAL_STORAGE, setDataSession, setFirebaseToken } from './Session'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const envConfig = import.meta.env
const firebaseConfig = {
	apiKey: envConfig.VITE_FIREBASE_API_KEY,
	authDomain: envConfig.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: envConfig.VITE_FIREBASE_PROJECT_ID,
	storageBucket: envConfig.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: envConfig.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: envConfig.VITE_FIREBASE_APP_ID,
	measurementId: envConfig.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
export const authFirebase = getAuth()

// export const handleSignInAnonymous = () => {
// 	return signInAnonymously(authFirebase)
// 		.then(res => {
// 			// Signed in..
// 			// console.log('============= res', res)
// 			setFirebaseToken(res?.user?.stsTokenManager)
// 			return res
// 		})
// 		.catch(error => {
// 			const errorCode = error.code
// 			const errorMessage = error.message
// 			// ...
// 			console.log('=============  error', error)
// 		})
// }

export default firebaseApp

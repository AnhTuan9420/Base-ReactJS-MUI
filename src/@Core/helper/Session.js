import { get } from 'lodash'
import Cookie from 'js-cookie'
export const SESSION_STORAGE = 'session'
export const LOCAL_STORAGE = 'local'
export const COOKIE = 'cookies'

export function setDataSession(type, key, data) {
	if (typeof Storage !== 'undefined') {
		if (!key) return false
		// process data
		// save to storegae
		data = JSON.stringify(data)
		if (type === SESSION_STORAGE) {
			sessionStorage.setItem(key, data)
			return true
		}

		if (type === LOCAL_STORAGE) {
			localStorage.setItem(key, data)
			return true
		}
	}
	return null
	// console.log('This Browser dont supported storeage');
}

export function getDataSession(type, key) {
	if (typeof Storage !== 'undefined') {
		// process data
		let value = ''
		let data = ''
		if (type === SESSION_STORAGE) {
			value = sessionStorage.getItem(key)
		}

		if (type === LOCAL_STORAGE) {
			value = localStorage.getItem(key)
		}

		if (type === COOKIE) {
			value = Cookie.get(key)
		}

		try {
			data = JSON.parse(value) || null
		} catch (err) {
			data = value
		}
		return data
	}
	// console.log('This browser does not support local storage');
	return null
}

export function removeDataSession(type, key) {
	if (typeof Storage !== 'undefined') {
		if (type === SESSION_STORAGE) {
			sessionStorage.removeItem(key)
		}
		if (type === LOCAL_STORAGE) {
			localStorage.removeItem(key)
		}
	}
	// console.log('This browser does not support local storage');
}

export const setFirebaseToken = data => {
	setDataSession(LOCAL_STORAGE, 'firebaseToken', data)
}

export const getFirebaseToken = () => {
	return getDataSession(LOCAL_STORAGE, 'firebaseToken')
}

export const setTraveloUser = data => {
	setDataSession(LOCAL_STORAGE, 'travelo_user', data)
}

export const getSocialUser = key => {
	const data = getDataSession(LOCAL_STORAGE, 'social_user') ?? null
	if (key) {
		return get(data, key)
	}
	return data
}

export const getToken = key => {
	const data = getDataSession(COOKIE, 'token') ?? null
	if (key) {
		return get(data, key)
	}
	return data
}


export const clearSession = () => {
	localStorage.clear()
	sessionStorage.clear()
	Cookie.remove('token')
	Cookie.remove('refresh_token')
}

export const getUserId = () => {
	return getSocialUser('user_id')
}

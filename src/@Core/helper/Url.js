import { get } from 'lodash'

export const getQueryUrlObject = key => {
	const params = new URLSearchParams(window.location.search)
	const result = {}
	// eslint-disable-next-line
	for (let entry of params) {
		// each 'entry' is a [key, value] tupple
		const [key, value] = entry
		result[key] = value
	}
	if (key) {
		return get(result, key)
	}
	return result
}

export const isValidUrl = str => {
	let url
	try {
		url = new URL(str)
	} catch (e) {
		console.error(e)
		return false
	}
	return url.protocol === 'http:' || url.protocol === 'https:'
}

export function isLocalhost() {
	return window.location.origin.indexOf('localhost') > -1 || window.location.origin.indexOf('127.0.0.1') > -1
}

// export const getS3Url = path => {
// 	if (startsWith(path, 'http') || startsWith(path, 'https')) {
// 		return path
// 	}
// 	return path ? env.SERVICE_URL.s3 + path : path
// }

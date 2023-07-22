import Cookie from 'js-cookie'

// const auth = getAuth()
const excludeAuthenApi = []
const authToken = async requestConfig => {
	// console.log('============= auth', auth)
	const token = Cookie.get('token')
	let idToken = null
	// if (auth?.currentUser) {
	// 	idToken = await getIdToken(auth?.currentUser)
	// }

	const { url, notAuth } = requestConfig
	if (excludeAuthenApi.includes(url) || notAuth) {
		return requestConfig
	}
	// const authToken = getFirebaseToken()
	requestConfig.headers.Authorization = `Bearer ${token}`

	// requestConfig.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdGllcyI6W10sImJpel9hcHBfc2hvcnRfY29kZSI6ImhlbGxvd29ybGQxIiwiY29tcGFueV9jb2RlIjoiQVBVUyIsImNvbXBhbnlfaWQiOjEsImNvcmVfYXV0aG9yaXRpZXMiOlsiUF9URVNUX0FERCIsIlBfVEVTVF9FRElUIiwiUF9URVNUX1ZJRVciXSwiZW52IjoiRE9DS0VSIiwiZXhwIjo0MDcwODgzNjAwLCJpZCI6ImFhMWY0ZDhmLTE5ZjAtNGE2MC04MTg5LTBkOTVhNDBmYTVlYyIsIm9yaWdfaWF0IjoxNjIzMzM3ODQ2LCJ1c2VyX2lkIjoxfQ.8_vualJsNRH0xWhQWyPHUz024rjRi4_v5JDOaG-Zuj8`

	return requestConfig
}

export const globalApiMiddleware = {
	auth: authToken
}

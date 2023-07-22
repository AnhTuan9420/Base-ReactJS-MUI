import { authService } from '@App/Social/services/authService'
import Axios from 'axios'
import Qs from 'qs'
import Cookies from 'js-cookie'
import { clearSession } from '@Core/helper/Session'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'

export const createInstance = (baseUrl = null, middleware = () => {}) => {
	const options = {
		baseURL: baseUrl,
		timeout: 30000,
		headers: {
			'X-Requested-With': 'XMLHttpRequest'
		},
		withCredentials: true,
		paramsSerializer: {
			serialize: params => Qs.stringify(params, { arrayFormat: 'brackets' })
		}
	}

	const instance = Axios.create(options)

	instance.interceptors.request.use(
		async requestConfig => {
			await Promise.all(middleware(requestConfig))
			return requestConfig
		},
		requestError => {
			// console.log(requestError)
			return Promise.reject(requestError)	
		}
	)

	// Add a response interceptor
	instance.interceptors.response.use(
		response => {
			if (response?.data) {
				const { data } = response
				if (data.errors) {
					// hideLoadingPage()
					return Promise.reject(data)
				}
				if (data.error_message) {
					// hideLoadingPage()
					return Promise.reject(data)
				}
				if (data?.data && !data?.total && !data?.current_page) {
					return data?.data
				}
				return data
			}
		},
		async error => {
			// hideLoadingPage()
			// console.log('============= error', error)
			if(error?.response?.data?.error_code == 401 && error?.response?.data?.error_message === 'トークンの有効期限が切れています'){
				const refreshToken = Cookies.get('refresh_token')
				const res = await authService.refreshToken({token:refreshToken})
				Cookies.set('token', res?.account?.idToken, { expires: 1 / 24 })
				Cookies.set('refresh_token', res?.account?.refreshToken, { expires: 30 })	
				error.config.headers = {
					Authorization: "Bearer " + res?.account?.idToken,
				  }
				  return instance(error.config);
			}else {	
				if(error?.response?.data?.error_code == 401 && error?.response?.data?.error_message === 'リフレッシュトークンの有効期限が切れています'){
					clearSession()
					window.open(ROUTER_SOCIAL.auth.login, "_self")
				}
				if (error?.response?.data) {
					const { data } = error?.response
					if (data?.error_message) {
						return Promise.reject(data)
					}
				}
				return Promise.reject(error)
			}

		}
	)
	return instance
}

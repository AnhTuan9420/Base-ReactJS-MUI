import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Auth extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	login = data => {
		const endpoint = '/api/auth/customer/login'
		return this.request.post(endpoint, data)
	}

	loginProvider = data => {
		const endpoint = '/api/auth/business/login'
		return this.request.post(endpoint, data)
	}

	refreshToken = token => {
		const endpoint = 'api/auth/customer/refreshToken'
		return this.request.post(endpoint, token)
	}

	registerEmail = data => {
		const endpoint = '/api/auth/customer/mail-registration'
		return this.request.post(endpoint, data)
	}

	verifyEmail = data => {
		const endpoint = '/api/customer/profile/code-registration'
		return this.request.post(endpoint, data)
	}

	logout = data => {
		const endpoint = '/api/logout'
		return this.request.post(endpoint, data)
	}

	removeAccount = () => {
		const endpoint = '/api/customer/withdrawal'
		return this.request.get(endpoint)
	}

	sendEmailResetPassword = (data) => {
		const endpoint = '/api/auth/mail/reset-password'
		return this.request.post(endpoint, data)
	}

	resetPassword = data => {
		const endpoint = '/api/customer/forgot-password'
		return this.request.post(endpoint, data)
	}

	settingPassword = data => {
		const endpoint = '/api/user/passwordSetting'
		return this.request.post(endpoint, data)
	}

	changeMail = data => {
		const endpoint = '/api/customer/send-code-change-email'
		return this.request.post(endpoint, data)
	}

	createUserProfile = data => {
		const endpoint = '/api/customer/confirm-profile'
		return this.request.get(endpoint, { params: data })
	}

	sendEmailRegister = data => {
		const endpoint = '/api/customer/profile/mail-registration'
		return this.request.get(endpoint, { params: data })
	}

	createProfileToB = data => {
		const endpoint = '/api/business/confirm-profile'
		return this.request.get(endpoint, { params: data })
	}

	sendEmailRegisterToB = data => {
		const endpoint = '/api/business/profile/mail-registration'
		return this.request.get(endpoint, { params: data })
	}

	verifyEmailToB = data => {
		const endpoint = '/api/business/profile/code-registration'
		return this.request.post(endpoint, data)
	}

}

export const authService = new Auth()

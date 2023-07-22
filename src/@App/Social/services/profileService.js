import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Profile extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	getUserProfile = (userId) => {
		const endpoint = '/api/customer/profile'
		return this.request.get(endpoint, userId)
	}

	getBusinessProfile = (userId) => {
		const endpoint = '/api/business/profile'
		return this.request.get(endpoint, userId)
	}

	getProfileAvatar = () => {
		const endpoint = '/api/profileAvatar'
		return this.request.get(endpoint)
	}

	getUserProfileAvatar = (userId) => {
		const endpoint = '/api/userProfile/avatar'
		return this.request.get(endpoint, userId)
	}

	/*
	* @params: abc
	*/
	updateUserProfile = (data) => {
		const endpoint = '/api/customer/change-profile'
		return this.request.post(endpoint, data)
	}

	updateUserProfileAvatar = (data) => {
		const endpoint = '/api/userProfile/avatar/create'
		return this.request.post(endpoint, data)
	}

	changeMail = data => {
		const endpoint = '/api/customer/change-email'
		return this.request.post(endpoint, data)
	}

	sendCodeChangeEmail = data => {
		const endpoint = '/api/customer/send-code-change-email'
		return this.request.post(endpoint, data)
	}

	changePassword = (data) => {
		const endpoint = '/api/customer/change-password'
		return this.request.post(endpoint, data)
	}

	changeReceivingAddress = (data) => {
		const endpoint = '/api/customer/change-receiving-address'
		return this.request.post(endpoint, data)
	}

	getDoorrevoID = () => {
		const endpoint = '/api/customer/special-plan-id'
		return this.request.get(endpoint)
	}

	createDoorrevoID = (data) => {
		const endpoint = '/api/customer/special-plan-id'
		return this.request.post(endpoint, data)
	}

	deleteDoorrevoID = (door_revo_id) => {
		const endpoint = `/api/customer/special-plan-id?door_revo_id=${door_revo_id}`
		return this.request.delete(endpoint)
	}

	changePhone = (data) => {
		const endpoint = '/api/customer/change-phone'
		return this.request.post(endpoint, data)
	}

}

export const profileService = new Profile()

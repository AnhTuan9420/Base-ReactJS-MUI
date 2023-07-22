import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Inquiry extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	create = (data) => {
		const endpoint = '/api/customer/inquiry'
		return this.request.post(endpoint, data)
	}

	inquiryFacility = (data) => {
		const endpoint = '/api/customer/inquiry-facility'
		return this.request.post(endpoint, data)
	}
}

export const inquiryService = new Inquiry()

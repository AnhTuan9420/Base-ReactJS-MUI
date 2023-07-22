import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Notification extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	getList = (query = {}) => {
		const params = {
			...query
		}
		const endpoint = '/api/customer/information'
		return this.request.get(endpoint, { params: params })
	}

	getDetail = notification_id => {
		const endpoint = `/api/customer/information/${notification_id}`
		return this.request.get(endpoint)
	}

	updateStatus = notification_id => {
		const endpoint = `/api/customer/information-destination/${notification_id}`
		return this.request.put(endpoint)
	}
}

export const notificationsService = new Notification()

import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class History extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	listHistory = (params) => {
		const endpoint = '/api/customer/history-payment'
		// const params = {
		// 	order_by: 'DESC',
		// 	order_name: 'id',
		// 	per_page: 10,
		// 	page : 1
		// }
		return this.request.get(endpoint, { params: params })
	}

	historyDetail = (history_id) => {
		const endpoint = `/api/customer/history-payment/${history_id}`
		return this.request.get(endpoint)
	}

	refunds = (history_id) => {
		const endpoint = `/api/customer/history-payment/refunds/${history_id}`
		return this.request.post(endpoint)
	}

	inforRefunds = (history_id) => {
		const endpoint = `/api/customer/refunds/${history_id}`
		return this.request.get(endpoint)
	}

	getQuotePDFData = (code_id) => {
		const endpoint = `/api/booking-information/export-invoice-completed?code_id=${code_id}`
		return this.request.get(endpoint)
	}

	updateBooking = (history_id, data) => {
		const endpoint = `/api/customer/update-booking/${history_id}`
		return this.request.put(endpoint, data)
	}

}

export const historyService = new History()

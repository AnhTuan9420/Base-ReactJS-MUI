import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'
import moment from 'moment'

class Facility extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	getListFacility = (params) => {
		const endpoint = '/api/facility'
		return this.request.get(endpoint, {params})
	}

	facilityDetail = (facility_id) => {
		const endpoint = `/api/facility/${facility_id}`
		return this.request.get(endpoint)
	}

	getListFavorite = (params) => {
		const endpoint = '/api/customer/favorite-facility'
		return this.request.get(endpoint, {params: params})
	}

	favorite = (data) => {
		const endpoint = '/api/customer/favorite-facility'
		return this.request.post(endpoint, data)
	}

	unFavorite = (favorite_id) => {
		const endpoint = `/api/customer/favorite-facility/${favorite_id}`
		return this.request.delete(endpoint)
	}

	getRentalPlan = (facility_id) => {
		const endpoint = `/api/rental-plan?facility_id=${facility_id}`
		return this.request.get(endpoint)
	}

	booking = (data) => {
		const endpoint = '/api/booking-information'
		return this.request.get(endpoint, {params: data})
	}

	payment = (data) => {
		const endpoint = '/api/customer/payment'
		return this.request.post(endpoint, data)
	}

	timeBookingHistory = (history_id, facility_id, init_date) => {
		const start_date = moment(init_date).format('YYYY-MM-DD')
		const endpoint = `/api/time-booking/facility?history_id=${history_id}&facility_id=${facility_id}&start_date=${start_date}`
		return this.request.get(endpoint)
	}

	timeBookingFacility = (facility_id, init_date) => {
		const start_date = moment(init_date).format('YYYY-MM-DD')
		const endpoint = `/api/time-booking/facility?facility_id=${facility_id}&start_date=${start_date}`
		return this.request.get(endpoint)
	}

	invoice = (codeId) => {
		const endpoint = `/api/invoice/completed?code_id=${codeId}`
		return this.request.get(endpoint)
	}

	bookingCompleted = (data) => {
		const endpoint = '/api/payment/completed'
		return this.request.post(endpoint, data)
	}

	isFavorite = (facility_id) => {
		const endpoint = `/api/customer/favorite?facility_id=${facility_id}`
		return this.request.get(endpoint)
	}

	getInvoiceData = (data) => {
		const endpoint = '/api/booking-information/export-invoice?'
		return this.request.get(endpoint, {params: data})
	}

}

export const facilityService = new Facility()

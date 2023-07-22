import { createInstance } from './axios'
import { globalApiMiddleware } from './middleware'

class BaseService {
	BASE_URL = import.meta.env.BASE_URL

	BASE_ENDPOINT = ''

	pimaryKey = 'id'

	paramsGet = {
		orderBy: 'close_to_date',
		sortedBy: 'desc'
	}

	request = null

	APPLY_MIDDLEWARE = {
		...globalApiMiddleware
	}

	constructor(params) {
		this.setRequest()
	}

	setRequest() {
		this.request = createInstance(this.BASE_URL, this.middleware)
	}

	/**
	 * Apply middleware request instance axios
	 * @param {requestConfig : axios} requestConfig
	 */
	middleware = requestConfig => {
		const arr = Object.values(this.APPLY_MIDDLEWARE).map(m => {
			if (typeof m === 'function') {
				return m(requestConfig)
			}
			return m
		})
		return arr
	}

	/**
	 * Get all resource for paginate
	 * @param {}
	 * @returns
	 */
	list = (query = {}, config = {}) => {
		const params = { ...this.paramsGet, ...query }
		return this.request.get(this.BASE_ENDPOINT, { params, ...config })
	}

	/**
	 * Get specific of resource
	 * @param {int} id
	 * @param {object} config
	 * @returns
	 */
	find = (id, config = {}) => {
		const api = `${this.BASE_ENDPOINT}/${id}`
		return this.request.get(api, config)
	}

	/**
	 * Store a newly created resource in storage.
	 * @param {object} data
	 * @param {object} config
	 * @returns
	 */
	create = (data = {}, config = {}) => {
		return this.request.post(this.BASE_ENDPOINT, data, config)
	}

	/**
	 * Update the specified resource in storage.
	 * @param {object} data
	 * @param {object} config
	 * @returns
	 */
	update = (data = {}, config = {}) => {
		const { pimaryKey } = this
		return this.request.put(`${this.BASE_ENDPOINT}/${data[pimaryKey]}`, data, config)
	}

	save = (data = {}, config = {}) => {
		const { pimaryKey } = this
		if (data.hasOwnProperty(pimaryKey) && data[pimaryKey]) {
			return this.update(data, config)
		}
		return this.create(data, config)
	}

	/**
	 * Remove the specified resource from storage.
	 * @param {int} id
	 * @param {object} config
	 * @returns
	 */
	delete = (id, config = {}) => {
		const api = `${this.BASE_ENDPOINT}/${id}`
		return this.request.delete(api, config)
	}
}

export default BaseService

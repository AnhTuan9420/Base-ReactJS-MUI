import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Top extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	BASE_ENDPOINT = '/api/'

	constructor(props) {
		super(props)
		this.setRequest()
	}

	home = user_id => {
		const endpoint = '/api/home'
		const data = {
			user_id: user_id
		}

		return this.request.post(endpoint, data)
	}
}

export const topService = new Top()

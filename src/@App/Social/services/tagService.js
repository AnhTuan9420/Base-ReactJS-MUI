import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Tags extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	constructor(props) {
		super(props)
		this.setRequest()
	}

	getListTagList= () => {
		const endpoint = '/api/tags'
		return this.request.get(endpoint)
	}

	tagDetail = (tag_id) => {
		const endpoint = `/api/tags/${tag_id}`
		return this.request.get(endpoint)
	}

}

export const tagService = new Tags()

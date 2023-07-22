import { env } from '@App/env'
import BaseService from '@Core/api/BaseService'

class Event extends BaseService {
	BASE_URL = env.WEB_BASE_URL

	BASE_ENDPOINT = '/api/event'

	constructor(props) {
		super(props)
		this.setRequest()
	}

	searchEvent = params => {
		const endpoint = '/api/event'
		return this.request.get(endpoint, { ...params })
	}

	getEntry = () => {
		// const endpoint = '/api/event/entry'
		// return this.request.get(endpoint)
		return {
			avatar: '/img/event/Image.png',
			title: 'サイクリストに人気の清滝峠からくろんど池へ走道清滝峠からくろんど池へ走道',
			tags: [
				'＃初心者におすすめ',
				'＃形式最高',
				'＃急勾配コースあり',
				'＃温泉あり',
				'＃獲得標高1000m以上',
				'＃秋におすすめ'
			],
			// partner: data structure
			// ['氏名', '氏名カナ', '性別', '生年月', 'メールアドレス']
			partner: ['サイクル　三郎', 'サイクル　サブロウ', '男性', '2000/01', 'mitsuo.ohno@sports-it.jp'],
			fee: '3,000円（税込）'
			// category: [
			// 	{ value: 1, text: 'Seaコース110Km（まちの駅やながわ発着）' },
			// 	{ value: 2, text: 'Seaコース110Km（まちの駅やながわ発着）' },
			// 	{ value: 3, text: 'Seaコース110Km（まちの駅やながわ発着）' }
			// ]
		}
	}

	eventEntry = data => {
		const endpoint = '/api/event/entry'

		return this.request.post(endpoint, data)
	}

	favorite = event_id => {
		const endpoint = '/api/event/fav'
		const data = {
			user_id: 1,
			event_id
		}
		// return Promise.resolve({
		// 	is_success: true,
		// 	data: {
		// 		eventFavorited: {
		// 			user_id: 1,
		// 			event_id: 1,
		// 			is_favorited: true
		// 		}
		// 	}
		// })
		return this.request.post(endpoint, data)
	}

	listEventTag = params => {
		const endpoint = '/api/event/tag'
		return this.request.get(endpoint, { params })
	}

	reviews = event_id => {
		const endpoint = '/api/event/review'
		const params = {
			event_id: event_id
		}

		return this.request.get(endpoint, { params })
	}


	ListEventSpecial = () => {
		const endpoint = '/api/event/specialFeature'

		return this.request.get(endpoint)
	}

	detailEventSpecial = special_feature_id => {
		const endpoint = `/api/event/specialFeature/${special_feature_id}`

		return this.request.get(endpoint)
	}
}

export const eventService = new Event()

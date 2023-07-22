const getFakeData = () => {
	const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

	const fakeData = data.map(item => {
		return {
			id:item,
			image: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=750&h=550&dpr=2',
			name: '施設名が入ります。サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプル',
			address: '東京渋谷駅徒歩7分',
			description:
				'すべてのイベントは、その土地のサイクリング環境を十分に下調べしたプロの「イベントクリエイター」が設計！スタート地点までのアクセスや駐車場、観光スポットすべてのイベントは、その土地のサイクリング環境を十分に下調べしたプロの「イベントクリエイター」が設計！スタート地点までのアクセスや駐車場、観光スポット',
			tags: ['急勾配コースあり', '急勾配コースあり']
		}
	})

	return fakeData
}

export default getFakeData
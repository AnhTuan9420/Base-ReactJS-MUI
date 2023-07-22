import { ROUTER_SOCIAL } from './constants'

export const menuAboutUserConfig = [
	{
		title: 'マイページ',
		url: ROUTER_SOCIAL.user.info
	},
	{
		title: 'お気に入り',
		url: ROUTER_SOCIAL.event.favorite
	},
	{
		title: '利用履歴',
		url: ROUTER_SOCIAL.event.history
	}
]

export const menuBeforeLoginConfig = [
	{
		title: '施設検索',
		url: ROUTER_SOCIAL.event.search
	},
	{
		title: '施設を利用する',
		url: ROUTER_SOCIAL.event.event_top
	}
]

export const menuAboutAppConfig = [
	{
		title: 'よくある質問',
		url: ROUTER_SOCIAL.questions
	},
	{
		title: 'お問い合わせ',
		url: ROUTER_SOCIAL.inquiry
	},
	{
		title: 'プライバシーポリシー',
		url: ROUTER_SOCIAL.privacy
	},
	{
		title: 'キャンセルポリシー',
		url: ROUTER_SOCIAL.cancellation
	},
	{
		title: '利用規約',
		url: ROUTER_SOCIAL.terms
	}
]

export const userInfoMenus = [
	{
		title: 'マイページ',
		url: ROUTER_SOCIAL.user.info
	},
	{
		title: 'ニックネームの変更',
		url: ROUTER_SOCIAL.user.change_nick_name
	},
	{
		title: '電話番号の変更',
		url: ROUTER_SOCIAL.user.change_phone
	},
	{
		title: 'メールアドレスの変更',
		url: ROUTER_SOCIAL.user.change_email
	},
	{
		title: 'パスワードの変更',
		url: ROUTER_SOCIAL.user.change_password
	},
	{
		title: '見積書・領収書の宛名の変更',
		url: ROUTER_SOCIAL.user.change_address
	},
	{
		title: '特別プランIDの編集',
		url: ROUTER_SOCIAL.user.edit_id
	}
]

export const userInfoMenuMobile = [
	{
		title: 'マイページ',
		url: ROUTER_SOCIAL.user.info
	},
	{
		title: 'ニックネームの変更',
		url: ROUTER_SOCIAL.user.change_nick_name
	},
	{
		title: '見積書・領収書の宛名の変更',
		url: ROUTER_SOCIAL.user.change_address
	},
	{
		title: 'パスワードの変更',
		url: ROUTER_SOCIAL.user.change_password
	},
	{
		title: '特別プランIDの編集',
		url: ROUTER_SOCIAL.user.edit_id
	},
	{
		title: '電話番号の変更',
		url: ROUTER_SOCIAL.user.change_phone
	},
	{
		title: 'メールアドレスの変更',
		url: ROUTER_SOCIAL.user.change_email
	}
]

export const deleteAccount = {
	title: '退会',
	url: ROUTER_SOCIAL.user.delete_acount
}

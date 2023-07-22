import React from 'react'

import { ROUTER_SOCIAL } from './constants'

const LazyLogin = React.lazy(() => import('../pages/Auth/Login'))
const LazyLoginProvider = React.lazy(() => import('../pages/Auth/LoginProvider'))
const LazySendOTPToEmail = React.lazy(() => import('../pages/Auth/Register/SendOTPToEmail'))
const LazyEventDetail = React.lazy(() => import('../pages/FacilityDetail'))
//ToC
const LazyRegisterProfile = React.lazy(() => import('../pages/Auth/Register/RegisterProfile'))
const LazyRegisterConfirm = React.lazy(() => import('../pages/Auth/Register/RegisterConfirm'))
const LazyVerificationCodes = React.lazy(() => import('../pages/Auth/Register/VerificationCodes'))
const LazyRegisterSuccess = React.lazy(() => import('../pages/Auth/Register/RegisterSuccess'))

// Event
const LazyEventSearch = React.lazy(() => import('../pages/Facility'))
const LazyEventFavorite = React.lazy(() => import('../pages/Facility/ListFavorite'))
const LazyEventTop = React.lazy(() => import('../pages/Home/Top'))
const LazyEventTeaser = React.lazy(() => import('../pages/Home/Teaser'))
const LazyHistoryList = React.lazy(() => import('../pages/History'))
const LazyItemSelection = React.lazy(() => import('../pages/FacilityDetail/Entry/ItemSelection'))
const LazyEnterInformation = React.lazy(() => import('../pages/FacilityDetail/Entry/EnterUserInformation'))


export const routerTraveloConfig = [
	{
		path: ROUTER_SOCIAL.event.search,
		element: <LazyEventSearch />,
		breadcrumb: 'イベント検索'
	},
	{
		path: ROUTER_SOCIAL.auth.login,
		element: <LazyLogin />,
		breadcrumb: 'ログイン'
	},
	{
		path: ROUTER_SOCIAL.auth.login_provider,
		element: <LazyLoginProvider />,
	},
	{
		path: ROUTER_SOCIAL.auth.register.send_otp_to_email,
		element: <LazySendOTPToEmail />,
		breadcrumb: 'アカウント登録'
	},
	{
		path: ROUTER_SOCIAL.auth.register.profile,
		element: <LazyRegisterProfile />,
		breadcrumb: '会員登録'
	},
	{
		path: ROUTER_SOCIAL.auth.register.confirm,
		element: <LazyRegisterConfirm />,
		breadcrumb: '登録内容の確認'
	},
	{
		path: ROUTER_SOCIAL.auth.register.verification_codes,
		element: <LazyVerificationCodes />,
		breadcrumb: '認証コード入力'
	},
	{
		path: ROUTER_SOCIAL.auth.register.success,
		element: <LazyRegisterSuccess />,
		breadcrumb: '会員登録完了'
	},
	{
		path: `${ROUTER_SOCIAL.event.detail}`,
		element: <LazyEventDetail />,
		breadcrumb: 'イベント検索'
	},
	{
		path: ROUTER_SOCIAL.event.favorite,
		element: <LazyEventFavorite />,
		breadcrumb: 'お気に入り'
	},
	{
		path: ROUTER_SOCIAL.event.event_top,
		element: <LazyEventTop />
	},
	{
		path: ROUTER_SOCIAL.event.teaser,
		element: <LazyEventTeaser />
	},
	{
		path: ROUTER_SOCIAL.event.history,
		element: <LazyHistoryList />,
		breadcrumb: '利用履歴'
	},
	{
		path: ROUTER_SOCIAL.entry.item_selection,
		element: <LazyItemSelection />,
		breadcrumb: 'オプションアイテム選択'
	},
	{
		path: ROUTER_SOCIAL.entry.enter_information,
		element: <LazyEnterInformation />,
		breadcrumb: '利用者情報入力'
	},
]

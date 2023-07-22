export const TRANSLATE_SOCIAL = {
	auth: 'auth',
	notification: 'notification',
	event: 'event',
	user_info: 'user-info',
	inquiry: 'inquiry',
	cycinfo: 'cycinfo'
}
export const ROUTER_SOCIAL = {
	auth: {
		login: '/login',
		login_provider: '/login-provider',
		email_reset_password: '/email-reset-password',
		email_notification_reset_password: '/email-notification-reset-password',
		reset_password: '/reset-password',
		reset_password_success: '/reset-password-success',
		register: {
			profile: '/register-profile',
			confirm: '/confirm-register',
			verification_codes: '/verification-codes',
			success: '/register_success',
			send_otp_to_email: '/send-otp-to-email'
		},
		change_email: '/change-email',
		change_email_verification_codes: '/change-email-verification-codes',
		change_email_success: '/change-email-success',
		delete_account: 'delete-account'
	},
	terms: '/terms',
	privacy: '/privacy',
	inquiry: '/inquiry-for-manage',
	confirm_inquiry_manage: '/confirm-inquiry-manage',
	send_inquiry_manage_success: '/send-inquiry-manage-success',
	inquiry_for_facility: '/inquiry-for-facility',
	confirm_inquiry_facility: '/confirm-inquiry-facility',
	send_inquiry_facility_success: '/send-inquiry-facility-success',
	questions: '/questions',
	law: '/law',
	cancellation: '/cancellation',
	verification_terms: '/terms-of-use-privacy',
	maintenance: '/maintenance',

	cancellation_of_reservation: {
		reservation_confirmation: '/reservation-confirmation',
		cancellation_fee_confirmation: '/cancellation-fee-confirmation',
		reservation_canceled: '/reservation-canceled'
	},

	entry: {
		item_selection: '/item-selection',
		enter_information: '/enter-information',
		fee_confirmation: '/fee-confirmation',
		reservation_success: '/payment-completed'
	},

	event: {
		list: '/event-list',
		detail: '/facility-detail',
		favorite: '/facility-favorite',
		search: '/facility',
		history: '/history',
		history_detail: '/history-detail',
		event_top: '/',
		event_top_detail: '/event-top-detail',
		your_facility: '/your-facility',
		teaser:'/teaser'
	},
	user: {
		info: '/my-page',
		edit: '/user-edit-info',
		edit_avatar: '/user-edit-avatar',
		change_nick_name: '/user-change-nick-name',
		change_email: '/user-change-email',
		change_password: '/user-change-password',
		change_address: '/user-change-address',
		edit_id: '/user-edit-id',
		delete_acount: '/user-delete-acount',
		change_phone: '/user-change-phone'
	}
}

export const typeSearchEvent = {
	search: 'SEARCH',
	event_type: 'EVENT_TYPE',
	price: 'PRICE',
	event_date: 'EVENT_DATE',
	tag_popular: 'TAG_POPULAR'
}

export const authRole = {
	user: 'user',
	admin: 'admin',
	guest: 'guest'
}

export const mobileViewPage = {
	terms: 'terms',
	faq: 'faq',
	privacy: 'privacy',
	inquiry: 'inquiry',
	confirm: 'confirm',
	success: 'success',
	inquiry_facility: 'inquiry-facility',
	confirm_facility: 'confirm-facility',
	success_facility: 'success-facility',
	email_reset_password: 'email-reset-password',
	email_notification_reset_password: 'email-notification-reset-password',
}

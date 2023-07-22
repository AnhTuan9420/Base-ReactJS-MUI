import { toast } from 'react-toastify'
export const successMsg = msg => {
	if (msg)
		toast.success(msg, {
			position: toast.POSITION.TOP_CENTER,
			icon: false,
			hideProgressBar: true,
			autoClose: 3000
		})
}

export const errorMsg = (error, defaultMsg = 'データの取得に失敗') => {
	if (error instanceof Error) {
		toast.error(error.message, {
			position: toast.POSITION.TOP_CENTER,
			icon: false,
			hideProgressBar: true,
			autoClose: 3000
		})
		return false
	} else if (error?.error_message) {
		toast.error(error.error_message, {
			position: toast.POSITION.TOP_CENTER,
			icon: false,
			hideProgressBar: true,
			autoClose: 3000
		})
		return false
	} else if (typeof error === 'string') {
		// NotificationManager.error(msg)
		toast.error(error, {
			position: toast.POSITION.TOP_CENTER,
			icon: false,
			hideProgressBar: true,
			autoClose: 3000
		})
	} else {
		toast.error(defaultMsg, {
			position: toast.POSITION.TOP_CENTER,
			icon: false,
			hideProgressBar: true,
			autoClose: 3000
		})
	}
}

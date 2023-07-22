import { isLocalhost } from '@Core/helper/Url'

export const env = {
	WEB_BASE_URL: isLocalhost() ? '/' : import.meta.env.VITE_API_URL
}

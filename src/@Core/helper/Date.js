import { format, isValid } from 'date-fns'

export const formatDate = (string, withFormat = 'dd/MM/yyyy', locale) => {
	return string && isValid(new Date(string)) ? format(new Date(string), withFormat) : null
}

export const formatTime= (time) => {
	if (time === 0 ) {
		return '00'
	}
}
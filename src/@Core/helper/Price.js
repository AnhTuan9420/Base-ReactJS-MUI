import currency from 'currency.js'
// currency.settings.separator = ' '
// currency.settings.decimal = '.'
// currency.settings.symbol = '¥'
// currency.settings.formatWithSymbol = true

const Price = value => currency(value, { symbol: '¥', formatWithSymbol: true, precision: 0 })
export default Price

export const formatPrice = (priceString, delimiter = ',') => {
	if (!priceString) {
		return 0
	}

	return priceString.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${delimiter}`)
}

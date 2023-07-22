import { ThemeProvider } from '@mui/material/styles'

import React from 'react'

import defaultTheme from './defaultTheme'
// import PropTypes from 'prop-types'

const CoreAppTheme = props => {
	const theme = {
		...defaultTheme
	}
	// console.log('============= theme', theme)
	return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

//CoreAppTheme.defaultProps = {}

//CoreAppTheme.propTypes = {}

export default React.memo(CoreAppTheme)

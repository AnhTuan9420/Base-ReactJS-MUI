import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useRouteError } from 'react-router-dom'
// import PropTypes from 'prop-types'

const CoreErrorPage = props => {
	const error = useRouteError()

	return (
		<Box id="error-page">
			<Typography variant="h1">Oops!</Typography>
			<Typography>Sorry, an unexpected error has occurred.</Typography>
			<Typography>
				<i>{error.statusText || error.message}</i>
			</Typography>
		</Box>
	)
}

//CoreErrorPage.defaultProps = {}

//CoreErrorPage.propTypes = {}

export default React.memo(CoreErrorPage)

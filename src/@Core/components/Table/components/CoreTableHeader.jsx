import React from 'react'
import TableRow from '@mui/material/TableRow'
import PropTypes from 'prop-types'

import { styled } from '@mui/material/styles'

const TableHeaderRow = styled(TableRow)(({ theme }) => {
	return {
		'& th': {
			fontSize: 14,
			padding: 8,
			fontWeight: 500,
			color: theme.palette.text.primary,
			'&:first-of-type': {
				paddingLeft: 20
			},
			'&:last-of-type': {
				paddingRight: 20
			}
		}
	}
})

const CoreTableHeader = ({ children, ...rest }) => {
	return <TableHeaderRow {...rest}>{children}</TableHeaderRow>
}

export default CoreTableHeader
CoreTableHeader.propTypes = {
	children: PropTypes.node
}

import { TableCell } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

// import PropTypes from 'prop-types'
const StyledTableCell = styled(TableCell)(() => ({
	fontSize: 14,
	padding: 8,
	'&:first-of-type': {
		paddingLeft: 20
	},
	'&:last-of-type': {
		paddingRight: 20
	}
}))
const CoreTableCell = props => {
	return <StyledTableCell>{props.children}</StyledTableCell>
}

//CoreTableCell.defaultProps = {}

//CoreTableCell.propTypes = {}

export default React.memo(CoreTableCell)

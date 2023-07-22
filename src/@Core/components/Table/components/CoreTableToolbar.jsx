import { Box } from '@mui/material'
import { useDebounceEffect } from 'ahooks'
import React from 'react'
import { useForm } from 'react-hook-form'
// import CoreInputSearch from '../../Input/CoreInputSearch'
// import PropTypes from 'prop-types'

const CoreTableToolbar = props => {
	const { handleFetchData } = props

	const { control, watch } = useForm({
		defaultValues: {
			search: ''
		}
	})

	const watchSearch = watch('search')

	useDebounceEffect(
		() => {
			handleFetchData({ search: watchSearch })
		},
		[watchSearch],
		500
	)
	return <Box className="mx-8 my-4">{/* <CoreInputSearch control={control} name="search" /> */}</Box>
}

//CoreTableToolbar.defaultProps = {}

//CoreTableToolbar.propTypes = {}

export default React.memo(CoreTableToolbar)

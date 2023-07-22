import { FormHelperText, Icon, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { forwardRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useController } from 'react-hook-form'
// import PropTypes from 'prop-types'
import { ja } from 'date-fns/esm/locale'

const CoreDatePicker = ({
	className = '',
	label = '',
	control,
	name = '',
	defaultValue,
	rules,
	required = false,
	helperText,
	placeholder = '',
	icon = false,
	...resProps
}) => {
	const {
		field: { onChange, onBlur, value, ref },
		fieldState: { error }
	} = useController({
		control,
		name,
		defaultValue,
		rules
	})

	const CustomInput = forwardRef(({ value, onClick }, ref) => (
		<TextField
			fullWidth
			variant="outlined"
			value={value}
			onClick={onClick}
			InputProps={{
				endAdornment: <Icon>{!icon ? 'calendar_month' : icon} </Icon>
			}}
			ref={ref}
			error={!!error}
			inputProps={{
				readOnly: true
			}}
			placeholder={placeholder}
		/>
	))

	const renderLabel = () => {
		return (
			<Typography component="div" variant="body2" className="flex items-center mb-4">
				{label} {required ? <Typography className="text-error mx-8">必須</Typography> : ''}
			</Typography>
		)
	}

	return (
		<Box
			className={className}
			sx={{
				'& .react-datepicker': {
					fontSize: '1.1rem',
					'& .react-datepicker__month': {
						margin: 1
					}
				}
			}}
		>
			{renderLabel()}
			<ReactDatePicker
				locale={ja}
				selected={value}
				onChange={date => onChange(date)}
				customInput={<CustomInput />}
				withPortal
				ref={ref}
				onCalendarClose={onBlur}
				{...resProps}
				// dateFormat="Pp"
			/>
			{helperText && <FormHelperText>{helperText}</FormHelperText>}
			{error && error.message && <FormHelperText error>{error.message}</FormHelperText>}
		</Box>
	)
}

//CoreDatePicker.defaultProps = {}

//CoreDatePicker.propTypes = {}

export default React.memo(CoreDatePicker)

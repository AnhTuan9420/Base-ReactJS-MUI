import { FormHelperText, InputLabel, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useController } from 'react-hook-form'
import PropTypes from 'prop-types'

const CoreInput = props => {
	const {
		className,
		control,
		name,
		label,
		placeholder,
		InputLabelProps,
		inputProps,
		InputProps,
		required,
		readOnly,
		type,
		multiline,
		minRows,
		variant,
		hidden,
		helperText,
		allowTranslation,
		disabled,
		rules,
		input,
		inputLogin,
		defaultValue,
		...restProps
	} = props
	const {
		field: { onChange, onBlur, value, ref },
		fieldState: { error }
	} = useController({
		control,
		name,
		defaultValue,
		rules
	})

	let { transform } = props

	if (type === 'number') {
		transform = {
			input: value => value,
			output: e => {
				const output = e.target.value
				return Number.isNaN(output) ? 0 : Number(output)
			}
		}
	}

	const renderLabel = () => {
		return (
			<Typography component="div" variant="body2" className="flex items-center mb-4">
				{label} {required ? <Typography className="text-error mx-8">必須</Typography> : ''}
			</Typography>
		)
	}

	return (
		<Box className={className}>
			{label && renderLabel()}
			<TextField
				fullWidth
				type={type === 'number' ? 'text' : type}
				// label={renderLabel()}
				placeholder={placeholder}
				onChange={e => onChange(transform.output(e))}
				onBlur={onBlur}
				value={transform.input(value)}
				variant={variant}
				inputRef={ref}
				multiline={multiline}
				minRows={minRows}
				disabled={disabled}
				error={!!error}
				InputLabelProps={{
					shrink: placeholder ? true : undefined,
					required,
					...InputLabelProps
				}}
				inputProps={{
					readOnly,
					...inputProps
				}}
				// eslint-disable-next-line react/jsx-no-duplicate-props
				InputProps={{
					...InputProps,
					...(type === 'number' && {
						inputComponent: NumberFormatCustom
					})
				}}
				sx={
					input
						? {
								'@media screen and (min-width: 600px)': {
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '20px',
										lineHeight: '160%',
										paddingY: '12px !important',
										paddingX: '16px !important'
									}
								},
								'@media screen and (max-width: 600px)': {
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '140%',
										paddingY: '17px !important',
										paddingX: '16px !important'
									}
								}
						  }
						: {} || inputLogin
						? {
								'@media screen and (min-width: 600px)': {
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '160%',
										paddingY: '17px !important',
										paddingX: '12px !important',
										fontFamily: 'Hiragino Sans',
									},
									'.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '160%',
										paddingY: '17px !important',
										paddingX: '12px !important',
										height: '22px'
									},
									'.css-1hd0dte-MuiInputBase-root-MuiOutlinedInput-root': {
										paddingRight: '4px'
									},
								},
								'@media screen and (max-width: 600px)': {
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '140%',
										paddingY: '17px !important',
										paddingX: '16px !important'
									},
									'.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '140%',
										paddingY: '17px !important',
										paddingX: '16px !important'
									},
									'.css-1hd0dte-MuiInputBase-root-MuiOutlinedInput-root': {
										paddingRight: '2px'
									},
								}
						  }
						: {} || {}
				}
				{...restProps}
			/>
			{helperText && <FormHelperText>{helperText}</FormHelperText>}
			{error && error.message && <FormHelperText error>{error.message}</FormHelperText>}
		</Box>
	)
}

CoreInput.defaultProps = {
	className: null,
	label: null,
	placeholder: null,
	transform: {
		input: value => value,
		output: e => e
	},
	InputLabelProps: null,
	inputProps: null,
	InputProps: null,
	required: false,
	type: 'text',
	multiline: false,
	minRows: 5,
	disabled: false,
	allowTranslation: false
}

CoreInput.propTypes = {
	className: PropTypes.string,
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	transform: PropTypes.object,
	InputLabelProps: PropTypes.object,
	inputProps: PropTypes.object,
	InputProps: PropTypes.object,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	type: PropTypes.string,
	multiline: PropTypes.bool,
	minRows: PropTypes.number,
	disabled: PropTypes.bool,
	hidden: PropTypes.bool,
	helperText: PropTypes.any,
	rules: PropTypes.object,
	allowTranslation: PropTypes.bool
}

export default React.memo(CoreInput)

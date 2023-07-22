import { Autocomplete, CircularProgress, FormHelperText, TextField, Typography } from '@mui/material'
import { useRequest } from 'ahooks'
import { find, get, isObject, map } from 'lodash'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const CoreAutocomplete = props => {
	const {
		className,
		control,
		name,
		options,
		label,
		placeholder,
		InputLabelProps,
		inputProps,
		InputProps,
		shrink,
		required,
		readOnly,
		fetchOptions,
		filter,
		valuePath,
		labelPath,
		loading,
		returnValueType,
		multiple,
		disabled,
		helperText,
		isCreateable,
		AutoCompleteClassName,
		rules,
		defaultValue,
		...restProps
	} = props

	const { t } = useTranslation('common')

	const getValueOption = useCallback(
		value => {
			if (multiple) {
				if (isCreateable) {
					return value
				}
				const values = map(value, v => {
					if (!isObject(v)) {
						const option =
							find(options, item => {
								return get(item, valuePath) === v
							}) ?? null
						return option
					}
					return v
				}).filter(Boolean)
				return values
			}

			if (returnValueType === 'enum') {
				return find(options, item => get(item, valuePath) === value) ?? null
			}

			return value
		},
		[options]
	)

	// console.log('============= getValueOption()', getValueOption())

	const renderLabel = () => {
		return (
			<Typography component="div" variant="body2" className="flex items-center mb-4">
				{label} {required ? <Typography className="text-error mx-8">必須</Typography> : ''}
			</Typography>
		)
	}

	return (
		<div className={className}>
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {
					return (
						<>
							{renderLabel()}
							<Autocomplete
								className={AutoCompleteClassName}
								multiple={multiple}
								isOptionEqualToValue={(option, value) => {
									if (value instanceof Object) {
										return get(option, valuePath) === get(value, valuePath)
									}
									return get(option, valuePath) === value
								}}
								getOptionLabel={option => {
									return get(option, labelPath) ?? ''
								}}
								loading={loading}
								options={options}
								// noOptionsText={t('form.autocomplete.no_options')}
								noOptionsText={null}
								disabled={disabled}
								onChange={(_, value) => {
									return returnValueType === 'enum'
										? onChange(multiple ? value.map(v => get(v, valuePath)) : get(value, valuePath))
										: onChange(value)
								}}
								onBlur={onBlur}
								value={getValueOption(value)}
								renderOption={(props, option) => (
									<li {...props} key={option[valuePath]}>
										{get(option, labelPath)}
									</li>
								)}
								renderInput={params => (
									<>
										<TextField
											{...params}
											placeholder={placeholder || t('form.autocomplete.placeholder', { label })}
											inputRef={ref}
											error={!!error}
											helperText={error && error.message}
											InputLabelProps={{
												...params.InputLabelProps,
												shrink: true,
												required,
												...InputLabelProps
											}}
											inputProps={{
												...params.inputProps,
												readOnly,
												...inputProps
											}}
											// eslint-disable-next-line react/jsx-no-duplicate-props
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{loading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputProps.endAdornment}
													</>
												),
												...InputProps
											}}
										/>
										{helperText && <FormHelperText>{helperText}</FormHelperText>}
									</>
								)}
								{...restProps}
							/>
						</>
					)
				}}
				rules={rules}
			/>
		</div>
	)
}

CoreAutocomplete.defaultProps = {
	className: null,
	options: [],
	label: null,
	placeholder: null,
	InputLabelProps: null,
	inputProps: null,
	InputProps: null,
	required: false,
	readOnly: false,
	// filter: () => {},
	valuePath: 'value',
	labelPath: 'label',
	returnValueType: 'option',
	isCacheKey: true,
	cacheKey: undefined,
	isCreateable: false
}

CoreAutocomplete.propTypes = {
	className: PropTypes.string,
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.array,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	InputLabelProps: PropTypes.object,
	inputProps: PropTypes.object,
	InputProps: PropTypes.object,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	fetchOptions: PropTypes.func,
	// filter: PropTypes.func,
	disableClearable: PropTypes.bool,
	disabled: PropTypes.bool,
	valuePath: PropTypes.string,
	labelPath: PropTypes.string,
	returnValueType: PropTypes.oneOf(['option', 'enum']),
	multiple: PropTypes.bool,
	isCacheKey: PropTypes.bool,
	cacheKey: PropTypes.string,
	helperText: PropTypes.any,
	filterOptions: PropTypes.func,
	getOptionLabel: PropTypes.func,
	isCreateable: PropTypes.bool,
	AutoCompleteClassName: PropTypes.string,
	rules: PropTypes.object,
	defaultValue: PropTypes.any
}

export default React.memo(CoreAutocomplete)

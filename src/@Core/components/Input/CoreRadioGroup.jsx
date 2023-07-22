import { Divider, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Controller } from 'react-hook-form'

const CoreRadioGroup = props => {
	const {
		className,
		control,
		name,
		legendLabel,
		options,
		labelInValue,
		labelProps,
		row,
		hasDivider,
		required,
		labelPlacement,
		helperText,
		...restProps
	} = props
	return (
		<div className={className}>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
					return (
						<>
							{legendLabel && (
								<FormLabel component="legend" required={required} error={!!error}>
									{legendLabel}
								</FormLabel>
							)}
							<RadioGroup
								row={row}
								name={name}
								onChange={onChange}
								value={value}
								ref={ref}
								{...restProps}
							>
								{options.map(item => {
									return (
										<>
											<FormControlLabel
												key={item.value}
												value={labelInValue ? JSON.stringify(item) : item.value}
												control={<Radio color="primary" />}
												label={labelProps ? item[labelProps] : item.name}
												disabled={Boolean(item?.disabled)}
												labelPlacement={labelPlacement}
											/>
											{hasDivider && <Divider className="my-8" />}
										</>
									)
								})}
							</RadioGroup>
							{error && error.message && <FormHelperText error={!!error}>{error.message}</FormHelperText>}
							{helperText && <FormHelperText>{helperText}</FormHelperText>}
						</>
					)
				}}
			/>
		</div>
	)
}

CoreRadioGroup.defaultProps = {
	className: null,
	legendLabel: null,
	row: false,
	labelInValue: false
}

CoreRadioGroup.propTypes = {
	className: PropTypes.string,
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	legendLabel: PropTypes.string,
	row: PropTypes.bool,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
			label: PropTypes.any.isRequired,
			disabled: PropTypes.bool
		})
	).isRequired,
	labelInValue: PropTypes.bool,
	required: PropTypes.bool,
	helperText: PropTypes.any
}

export default React.memo(CoreRadioGroup)

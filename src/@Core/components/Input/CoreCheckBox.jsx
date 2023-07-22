import { Checkbox, FormControlLabel, FormHelperText, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Controller, useController } from 'react-hook-form'

const CoreCheckbox = props => {
	const {
		className,
		control,
		name,
		label,
		labelClassName,
		labelPlacement = 'end',
		defaultValue,
		...restProps
	} = props

	return (
		<div className={className}>
			<FormControlLabel
				className={labelClassName}
				labelPlacement={labelPlacement}
				control={
					<Controller
						control={control}
						name={name}
						render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
							return (
								<>
									<Checkbox
										color="primary"
										onChange={e => onChange(e.target.checked)}
										checked={Boolean(value)}
										ref={ref}
										{...restProps}
									/>
									{error && error.message && <FormHelperText error>{error.message}</FormHelperText>}
								</>
							)
						}}
					/>
				}
				label={<Typography>{label}</Typography>}
			/>
		</div>
	)
}

CoreCheckbox.defaultProps = {
	className: null
}

CoreCheckbox.propTypes = {
	className: PropTypes.string,
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.any.isRequired,
	labelClassName: PropTypes.string
}

export default React.memo(CoreCheckbox)

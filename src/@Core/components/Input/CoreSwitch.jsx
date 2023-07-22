import { Switch, FormControlLabel, FormHelperText, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Controller, useController } from 'react-hook-form'
import { styled } from '@mui/material/styles'

const CoreCheckbox = props => {
	const { className, control, name, label, labelClassName, required, ...restProps } = props

	const AntSwitch = styled(Switch)(({ theme }) => ({
		width: 28,
		height: 16,
		padding: 0,
		display: 'flex',
		'&:active': {
			'& .MuiSwitch-thumb': {
				width: 15
			},
			'& .MuiSwitch-switchBase.Mui-checked': {
				transform: 'translateX(9px)'
			}
		},
		'& .MuiSwitch-switchBase': {
			padding: 2,
			'&.Mui-checked': {
				transform: 'translateX(12px)',
				color: '#fff',
				'& + .MuiSwitch-track': {
					opacity: 1,
					backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'transparent',
					border: 'solid 1px #458C50'
				},
				'.MuiSwitch-thumb': {
					backgroundColor: '#458C50'
				}
			}
		},
		'& .MuiSwitch-thumb': {
			boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
			width: 12,
			height: 12,
			borderRadius: 6,
			transition: theme.transitions.create(['width'], {
				duration: 200
			}),
			backgroundColor: '#858585'
		},
		'& .MuiSwitch-track': {
			borderRadius: 16 / 2,
			opacity: 1,
			backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'transparent',
			boxSizing: 'border-box',
			border: 'solid 1px #858585'
		}
	}))

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
				render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
					return (
						<>
							{renderLabel()}
							<AntSwitch
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

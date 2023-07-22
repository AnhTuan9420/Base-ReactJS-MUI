import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { ROUTER_SOCIAL, TRANSLATE_SOCIAL } from '@App/Social/configs/constants'
import { authService } from '@App/Social/services/authService'
import CoreInput from '@Core/components/Input/CoreInput'
import { errorMsg, successMsg } from '@Core/helper/Message'
import { LOCAL_STORAGE, setDataSession } from '@Core/helper/Session'
import Yup from '@Core/helper/Yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
// import PropTypes from 'prop-types'

const SendOTPToEmail = props => {
	const { t } = useTranslation(TRANSLATE_SOCIAL.auth)
	const navigate = useNavigate()
	const {
		control,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			email: ''
		},
		resolver: yupResolver(
			Yup.object({
				email: Yup.string().email().required().min(3)
			})
		)
	})

	const onSubmit = handleSubmit(async data => {
		try {
			const res = await authService.registerEmail(data)
			successMsg('Register email successfully !')
			setDataSession(LOCAL_STORAGE, 'email', res?.email)
			setDataSession(LOCAL_STORAGE, 'token', res?.token)
			navigate(ROUTER_SOCIAL.auth.register.verification_codes)
		} catch (e) {
			errorMsg(e)
		}
	})

	const handleStartWithoutRegistration = () => {
		if (typeof flutterChannel !== 'undefined') {
			flutterChannel.postMessage('SKIP_REG')
		}
		navigate(ROUTER_SOCIAL.event.event_top)
	}

	return (
		<EventContentPage
			content={
				<form onSubmit={onSubmit}>
					<Box className="px-12">
						<Typography variant="h1" className="text-center my-40">
							{t('title.register')}
						</Typography>
						<Typography variant="h3" className="sm:text-left sm:mb-36 mb-20">
							{t('label.send_code_to_email')}
						</Typography>
						<Typography variant="h3" className="flex">
							{t('label.email_address')}{' '}
							<Typography variant="h3" className="ml-8" color="error">
								{t('label.require')}
							</Typography>
						</Typography>
						<CoreInput
							control={control}
							name="email"
							className="w-full sm:mb-60 mb-20"
							placeholder={t('placeholder.email_reset_password')}
						/>
						<Box className="text-center">
							<LoadingButton
								loading={isSubmitting}
								type="submit"
								variant="contained"
								className="w-full sm:w-2/3 text-14 py-12 px-60 rounded-4 sm:mb-80 mb-40"
								// onClick={() => navigate(ROUTER_SOCIAL.auth.register.verification_codes)}
							>
								{t('btn.send_code')}
							</LoadingButton>
						</Box>

						<Box className="text-center">
							<Button
								className="text-center underline underline-offset-3 rounded-full text-14 mb-20 font-bold"
								color="primary"
								// onClick={handleSignInAnonymous}
								onClick={handleStartWithoutRegistration}
							>
								{t('label.start_without_registration')}
							</Button>
						</Box>
						<Box className="text-center">
							<LoadingButton
								className="text-center underline underline-offset-3 rounded-full text-14 font-bold mb-60"
								color="primary"
								onClick={() => navigate(ROUTER_SOCIAL.auth.login)}
							>
								{t('label.go_to_login')}
							</LoadingButton>
						</Box>
					</Box>
				</form>
			}
		/>
	)
}

// SendOTPToEmail.defaultProps = {}

// SendOTPToEmail.propTypes = {}

export default React.memo(SendOTPToEmail)

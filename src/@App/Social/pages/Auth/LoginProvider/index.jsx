import { ROUTER_SOCIAL, TRANSLATE_SOCIAL } from '../../../configs/constants'
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EventContentPage from '../../../components/Layout/EventContentPage'
import { getSocialUser, setDataSession } from '@Core/helper/Session'
import CoreInput from '@Core/components/Input/CoreInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Yup from '@Core/helper/Yup'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { authService } from '@App/Social/services/authService'
import { successMsg } from '@Core/helper/Message'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { LoadingButton } from '@mui/lab'
import iconInquiry from '@App/Social/assets/iconInquiry.png'

const LoginProvider = props => {
	const navigate = useNavigate()
	const user = getSocialUser()

	const {
		control,
		handleSubmit,
		formState: { isSubmitting, errors, isDirty },
		setError
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			email: '',
			password: ''
		}
		// resolver: yupResolver(
		// 	Yup.object({
		// 		email: Yup.string()
		// 			.required('このフィールドは必須です。')
		// 			.email('メールアドレスの形式が正しくありません。'),
		// 		password: Yup.string()
		// 			.required('このフィールドは必須です。')
		// 			.min(8, 'パスワードの形式が正しくありません。')
		// 			.max(20, 'パスワードの形式が正しくありません。')
		// 	})
		// )
	})

	const { t } = useTranslation(TRANSLATE_SOCIAL.auth)
	const [viewPassword, setViewPassword] = useState(false)

	const onSubmit = handleSubmit(async data => {
		try {
			const res = await authService.loginProvider(data)
			setDataSession('local', 'social_user', {
				id: res?.account?.id,
				email: res?.account?.email,
				name: res?.account?.name
				// role: res?.account?.role
			})
			Cookies.set('token', res?.account?.idToken, { expires: 1 / 24 })
			Cookies.set('refresh_token', res?.account?.refreshToken, { expires: 30 })
			successMsg('ログインしました。')
			navigate(ROUTER_SOCIAL.event.event_top)
		} catch (error) {
			if (error?.error_message?.includes('password')) {
				setError('password', error)
			}
			if (error?.error_message?.includes('email')) {
				setError('email', error)
			}
		}
	})

	return (
		<EventContentPage
			hasBreadcrumb={false}
			maxWidth={800}
			auth={true}
			content={
				<>
					<form onSubmit={onSubmit} className="sm:pt-[56px] pt-[32px] sm:px-0 px-16 sm:pb-[56px] pb-[322px]">
						<Box className="bg-white sm:px-[124px] px-16 ">
							<Typography className="sm:pt-[56px] pt-[24px] sm:pb-[32px] pb-32 text-center text-24 sm:text-32 text-[#000000] font-semibold sm:leading-[140%]">
								施設提供者用のアカウントでログイン
							</Typography>

							<Typography className="mb-8 text-16 sm:text-20 text-[#000000] sm:leading-[160%] leading-[140%] font-semibold">
								{t('title.email_address')}
							</Typography>
							<CoreInput
								control={control}
								name="email"
								className="w-full"
								placeholder={'メールアドレスを入力'}
								inputLogin={true}
							/>
							{errors?.email?.error_message ? (
								<Typography className="text-16 text-[#d83443] mt-[3px]">
									{errors?.email?.error_message ===
									'emailこのフィールドは必須です。 (and 1 more error)'
										? errors?.email?.error_message?.substring(5)?.replace(' (and 1 more error)', '')
										: errors?.email?.error_message?.substring(5)}
								</Typography>
							) : null}

							<Typography className="mb-8 mt-16 text-16 sm:text-20 text-[#000000] sm:leading-[160%] leading-[140%] font-semibold">
								{t('title.password')}
							</Typography>
							<CoreInput
								control={control}
								name="password"
								type={viewPassword ? 'text' : 'password'}
								className="w-full"
								placeholder={'半角英数8文字以上'}
								inputLogin={true}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											{viewPassword ? (
												<IconButton onClick={() => setViewPassword(false)}>
													<VisibilityOutlinedIcon color="primary" />
												</IconButton>
											) : (
												<IconButton onClick={() => setViewPassword(true)}>
													<VisibilityOffOutlinedIcon color="primary" />
												</IconButton>
											)}
										</InputAdornment>
									)
								}}
							/>
							{errors?.password?.error_message ? (
								<Typography className="text-16 text-[#d83443] mt-[3px]">
									{errors?.password?.error_message?.substring(8)}
								</Typography>
							) : null}
							<Box className="text-center mt-32">
								<LoadingButton
									loading={isSubmitting}
									variant="contained"
									color="primary"
									className="sm:w-[400px] w-full sm:h-56 h-[58px] sm:text-20 text-16 sm:py-12 py-[18px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
									type="submit"
									disabled={!isDirty}
									fullWidth
								>
									{t('btn.login')}
								</LoadingButton>
							</Box>

							<Box className="justify-center sm:mt-32 mt-[17px] flex ">
								<Typography
									onClick={() => navigate(ROUTER_SOCIAL.auth.email_reset_password)}
									color="primary"
									className="cursor-pointer sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]"
								>
									パスワードをお忘れの場合はこちら
								</Typography>
								<img src={iconInquiry} className="ml-12 h-12 self-center" />
							</Box>

							<Typography className="text-center sm:mt-32 mt-[25px] text-[#222222] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
								ログインできない方はこちらからお問い合わせください
							</Typography>

							<Box className="text-center sm:mt-4 mt-8 sm:pb-[56px] pb-[24px]">
								<Button
									loading={isSubmitting}
									variant="outlined"
									color="primary"
									className="sm:w-400 w-full sm:h-56 h-[58px] sm:text-[20px] text-[16px] sm:leading-[160%] sm:py-12 py-[18px] px-0 leading-[140%] shadow-none font-semibold border-solid border-1 rounded-[4px]"
									fullWidth
									onClick={() => navigate(ROUTER_SOCIAL.inquiry)}
								>
									お問い合わせ
								</Button>
							</Box>
						</Box>
					</form>
				</>
			}
		/>
	)
}

export default React.memo(LoginProvider)

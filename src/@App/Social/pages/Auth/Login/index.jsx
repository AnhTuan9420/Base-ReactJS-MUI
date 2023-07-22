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
import { errorMsg, successMsg } from '@Core/helper/Message'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { LoadingButton } from '@mui/lab'
import iconInquiry from '@App/Social/assets/iconInquiry.png'

const Login = props => {
	const navigate = useNavigate()
	const user = getSocialUser()

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
		watch
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			email: '',
			password: ''
		},
		resolver: yupResolver(
			Yup.object({
				email: Yup.string()
					.required('このフィールドは必須です。')
					.email('メールアドレスの形式が正しくありません。')
					.min(3, 'メールアドレスの形式が正しくありません。'),
				password: Yup.string()
					.required('このフィールドは必須です。')
					.min(8, 'パスワードの形式が正しくありません。')
					.max(20, '半角英数字記号8〜32文字で入力してください。')
			})
		)
	})

	const watchUsername = watch('email')
	const watchPassword = watch('password')

	const { t } = useTranslation(TRANSLATE_SOCIAL.auth)
	const [viewPassword, setViewPassword] = useState(false)

	const onSubmit = handleSubmit(async data => {
		try {
			const res = await authService.login(data)
			setDataSession('local', 'social_user', {
				id: res?.account?.id,
				email: res?.account?.email,
				name: res?.account?.name
			})
			Cookies.set('token', res?.account?.idToken, { expires: 1 / 24 })
			Cookies.set('refresh_token', res?.account?.refreshToken, { expires: 30 })
			successMsg('ログインしました。')
			navigate(ROUTER_SOCIAL.event.event_top)
		} catch (error) {
			errorMsg(error)
		}
	})

	const togglePasswordVisibility = () => {
		// var passwordInput = document.getElementById('password')

		// if (passwordInput.type === 'password') {

		// }
		setViewPassword(true)
	}

	return (
		<EventContentPage
			hasBreadcrumb={false}
			maxWidth={800}
			auth={true}
			content={
				<>
					<form onSubmit={onSubmit} className="sm:pt-[56px] pt-[32px] sm:px-0 px-16 sm:pb-[56px] pb-[32px]">
						<Box className="bg-white sm:px-[124px] px-16 ">
							<Typography className="sm:pt-[56px] pt-[24px] sm:pb-[40px] pb-32 text-center text-24 sm:text-32 text-[#000000] font-semibold sm:leading-[140%]">
								{t('title.login')}
							</Typography>

							<Typography className="mb-8 text-16 sm:text-20 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								{t('title.email_address')}
							</Typography>
							<CoreInput
								control={control}
								name="email"
								className="w-full"
								placeholder={'メールアドレスを入力'}
								inputLogin={true}
							/>
							<Typography className="mb-8 mt-16 text-16 sm:text-20 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								{t('title.password')}
							</Typography>
							<CoreInput
								id="password"
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
												<IconButton onClick={togglePasswordVisibility}>
													<VisibilityOffOutlinedIcon color="primary" />
												</IconButton>
											)}
										</InputAdornment>
									)
								}}
							/>
							<Box className="text-center mt-32">
								<LoadingButton
									loading={isSubmitting}
									variant="contained"
									color="primary"
									className="sm:w-[400px] w-full sm:h-56 h-[58px] sm:text-20 text-16 sm:py-12 py-[18px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
									type="submit"
									disabled={false}
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

							<Box className="text-center sm:mt-4 mt-8">
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

							<Typography className="text-center mb-16 sm:mt-32 mt-[25px] text-[#000000] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
								施設提供者用のアカウントを持っている方で
								<br />
								施設を予約したい場合は下のボタンでログイン
							</Typography>

							<Box className="text-center sm:pb-[56px] pb-[24px]">
								<Button
									variant="contained"
									color="primary"
									className="sm:w-[400px] w-full sm:h-56 h-[58px] sm:text-20 text-16 sm:py-12 py-[18px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
									fullWidth
									onClick={() => navigate(ROUTER_SOCIAL.auth.login_provider)}
								>
									施設提供者アカウントでログインする
								</Button>
							</Box>
						</Box>
					</form>
					<form className="sm:px-0 px-16 sm:pb-[56px] pb-[140px]">
						<Box className="bg-white sm:px-[124px] px-16 ">
							<Typography className=" sm:pt-[56px] pt-[24px] sm:pb-[40px] pb-32 text-center text-20 sm:text-[26px] text-[#000000] font-semibold sm:leading-[140%]">
								アカウントをお持ちでない方は
								<br />
								こちらより会員登録
								<br className="sm:hidden block" />
								へお進みください
							</Typography>

							<Box className="text-center sm:pb-[56px] pb-[24px]">
								{/* <a href={import.meta.env.VITE_CMS_REGISTER_URL} target='_blank'> */}
								<Button
									variant="contained"
									color="primary"
									className="sm:w-[400px] w-full sm:h-56 h-[58px] sm:text-20 text-16 sm:py-12 py-[18px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
									disabled={false}
									fullWidth
									onClick={() => navigate(ROUTER_SOCIAL.auth.register.profile)}
								>
									会員登録
								</Button>
								{/* </a> */}
							</Box>
						</Box>
					</form>
				</>
			}
		/>
	)
}

export default React.memo(Login)

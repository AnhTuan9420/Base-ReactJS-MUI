import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { ROUTER_SOCIAL, TRANSLATE_SOCIAL } from '@App/Social/configs/constants'
import { authService } from '@App/Social/services/authService'
import CoreInput from '@Core/components/Input/CoreInput'
import { errorMsg, successMsg } from '@Core/helper/Message'
import { getDataSession, removeDataSession, SESSION_STORAGE, setDataSession } from '@Core/helper/Session'
import Yup from '@Core/helper/Yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
// import PropTypes from 'prop-types'

const VerificationCodes = props => {
	const { t } = useTranslation(TRANSLATE_SOCIAL.auth)
	const navigate = useNavigate()
	const [resend, setResend] = useState(false)

	const dataSendEmail = getDataSession(SESSION_STORAGE, 'profile')

	const {
		control,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			code: ''
		},
		resolver: yupResolver(
			Yup.object({
				code: Yup.string().required('これは必要項目です。')
			})
		)
	})

	const onSubmit = handleSubmit(async data => {
		const dataSubmit = { ...data, ...dataSendEmail }
		try {
			const res = await authService.verifyEmail(dataSubmit)
			if (res) {
				removeDataSession(SESSION_STORAGE, 'profile')
			}
			successMsg('アカウント登録完了。')
			navigate(ROUTER_SOCIAL.auth.register.success)
		} catch (e) {
			errorMsg(e)
		}
	})

	const handleResendEmail = async () => {
		try {
			setResend(true)
			const data = await authService.sendEmailRegister(dataSendEmail)
			if (data) {
				setResend(false)
			}
			setDataSession(SESSION_STORAGE, 'profile', data?.profile)
			successMsg('確認コードを正常に再送信します。')
		} catch (error) {
			errorMsg(error)
		}
	}

	const convertEmail = () => {
		if (mail_address) {
			const ext = mail_address.split('@')[1]
			return '******@' + ext
		}
		return '******@gmail.com'
	}

	return (
		<EventContentPage
			maxWidth={1000}
			auth={true}
			content={
				<form onSubmit={onSubmit} className="sm:pt-[72px] pt-[64px] sm:px-0 px-16 sm:pb-[220px] pb-[114px]">
					<Box className="bg-white sm:px-[100px] px-16 ">
						<Typography className="sm:pt-[56px] pt-[24px] pb-32 text-center text-24 sm:text-32 text-[#222222] font-semibold sm:leading-[140%]">
							認証コード入力
						</Typography>
						<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#222222]">
							上記のメールアドレスに認証コードを送信しました。
							<br />
							メールで受信した認証コードを以下に入力してください。
						</Typography>

						<Box className="sm:flex justify-between sm:mt-40 mt-24 w-[100%]">
							<Typography className="font-semibold sm:text-20 text-16 sm:w-[30%] text-[#222222] sm:leading-[160%] leading-[140%]">
								メールアドレス
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] sm:w-[70%] break-all text-end leading-[140%] font-light text-[#222222]">
								{dataSendEmail?.email}
							</Typography>
						</Box>

						<Typography className="sm:mt-40 mt-24 mb-8 font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
							認証コード
						</Typography>
						<CoreInput
							control={control}
							name="code"
							className="w-full"
							placeholder={t('placeholder.verification_code')}
							input={true}
						/>

						<Box className="text-center sm:mt-32 mt-[33px]">
							<LoadingButton
								loading={isSubmitting}
								variant="contained"
								color="primary"
								className="sm:w-[400px] w-full sm:text-20 text-16 sm:py-12 py-[17px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
								type="submit"
							>
								アカウントを登録する
							</LoadingButton>
						</Box>
						<Box className="text-center mt-16 sm:pb-[56px] pb-[24px]">
							<LoadingButton
								loading={resend === true}
								variant="outlined"
								color="primary"
								className="sm:w-400 w-full sm:text-[20px] text-[16px] sm:leading-[160%] sm:py-[12px] px-0 py-[17px] leading-[140%] shadow-none font-semibold border-solid border-1 rounded-[4px]"
								onClick={handleResendEmail}
							>
								認証コードを再送信する
							</LoadingButton>
						</Box>
					</Box>
				</form>
			}
		/>
	)
}

// VerificationCodes.defaultProps = {}

// VerificationCodes.propTypes = {}

export default React.memo(VerificationCodes)

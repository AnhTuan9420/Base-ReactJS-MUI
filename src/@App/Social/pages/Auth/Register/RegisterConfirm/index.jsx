import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { authService } from '@App/Social/services/authService'
import { successMsg, errorMsg } from '@Core/helper/Message'
import { SESSION_STORAGE, getDataSession, setDataSession } from '@Core/helper/Session'

const RegisterConfirm = props => {
	const dataProfile = getDataSession(SESSION_STORAGE, 'profile')
	const navigate = useNavigate()
	const [submit, setSubmit] = useState(false)
	const handleSendEmail = async () => {
		try {
			setSubmit(true)
			const dataSendEmail = await authService.sendEmailRegister(dataProfile)
			setDataSession(SESSION_STORAGE, 'profile', dataSendEmail?.profile)
			successMsg('確認コードが正常に送信されました。')
			navigate(ROUTER_SOCIAL.auth.register.verification_codes)
		} catch (error) {
			errorMsg(error)
		}
	}

	return (
		<EventContentPage
			maxWidth={1000}
			auth={true}
			content={
				<Box className="sm:pt-[72px] pt-[64px] sm:px-0 px-16 sm:pb-[220px] pb-[112px]">
					<Box className="bg-white sm:px-[100px] px-16 ">
						<Typography className="sm:pt-[56px] pt-[24px] pb-32 text-center text-24 sm:text-32 text-[#222222] font-semibold sm:leading-[140%]">
							登録内容の確認
						</Typography>

						<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#0B0B0B]">
							下記の内容でお間違いなければ、入力いただいたメールアドレス宛に認証コードを送信いたします。
						</Typography>

						<Typography className="sm:mt-32 mt-[24px] font-semibold sm:leading-[140%] text-[20px] sm:text-[26px] text-[#222222]">
							基本情報
						</Typography>
						<Divider className="mb-20" />

						<Box className="sm:flex justify-between">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
								ニックネーム
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#222222]">
								{dataProfile?.name}
							</Typography>
						</Box>

						<Box className="sm:flex justify-between sm:mt-24 mt-16">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
								電話番号
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#222222]">
								{dataProfile?.phone_no}
							</Typography>
						</Box>

						<Box className="sm:flex justify-between sm:mt-24 mt-16 w-[100%]">
							<Typography className="font-semibold sm:w-[30%] sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]	">
								メールアドレス
							</Typography>
							<Typography className="text-16 sm:text-20 sm:w-[70%] sm:text-end  sm:leading-[160%] break-all leading-[140%] font-light text-[#222222]">
								{dataProfile?.email}
							</Typography>
						</Box>

						<Typography className="sm:mt-32 mt-[24px] font-semibold sm:leading-[140%] text-[20px] sm:text-[26px] text-[#222222]">
							見積書・領収書の宛名
						</Typography>
						<Divider className="mb-20" />

						<Box className="sm:flex justify-between w-[100%]">
							<Typography className="font-semibold sm:w-[30%] sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
								会社名・組織名
							</Typography>
							<Typography className="text-16 sm:text-20 sm:w-[70%] sm:text-end  break-all sm:leading-[160%] leading-[140%] font-light text-[#222222]">
								{dataProfile?.company_name}
							</Typography>
						</Box>

						<Box className="sm:flex justify-between sm:mt-24 mt-16 w-[100%]">
							<Typography className="font-semibold sm:text-20 sm:w-[30%] text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
								個人名
							</Typography>
							<Typography className="text-16 sm:text-20 sm:w-[70%] sm:text-end break-all sm:leading-[160%] leading-[140%] font-light text-[#222222]">
								{dataProfile?.personal_name}
							</Typography>
						</Box>

						<Box className="text-center sm:mt-32 mt-[24px] sm:pb-[56px] pb-[24px]">
							<LoadingButton
								loading={submit === true}
								variant="contained"
								color="primary"
								className="sm:w-[400px] w-full sm:text-20 text-16 sm:py-12 py-[17px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
								onClick={handleSendEmail}
							>
								認証コードを送信する
							</LoadingButton>
						</Box>
					</Box>
				</Box>
			}
		/>
	)
}

// RegisterProfile.defaultProps = {}

// RegisterProfile.propTypes = {}

export default React.memo(RegisterConfirm)

import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { ROUTER_SOCIAL, TRANSLATE_SOCIAL } from '@App/Social/configs/constants'
import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tickKYC from '@App/Social/assets/tickKYC.png'
// import PropTypes from 'prop-types'

const RegisterSuccess = props => {
	const navigate = useNavigate()
	
	return (
		<EventContentPage
			maxWidth={1000}
			auth={true}
			content={
				<Box className="sm:pt-[72px] pt-[64px] sm:px-0 px-16 sm:pb-[220px] pb-[139px]">
					<Box className="bg-white sm:px-[100px] px-16 ">
						<Typography className="sm:pt-[56px] pt-[24px] pb-32 text-center text-24 sm:text-32 text-[#222222] font-semibold sm:leading-[140%]">
							会員登録完了
						</Typography>
						<img className="mx-auto" src={tickKYC} />

						<Typography className="mt-32 sm:mb-8 mb-[24px] text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#0B0B0B] ">
							会員登録が完了しました。
						</Typography>

						<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#0B0B0B] ">
							以下の機能が使用できるようになります。
							<br />
							・施設のお気に入り登録
							<br />
							・施設の利用予約
						</Typography>

						<Box className="text-center mt-32 sm:pb-[56px] pb-[24px]">
							<LoadingButton
								variant="contained"
								color="primary"
								className="sm:w-[400px] w-full sm:text-20 text-16 sm:py-12 py-[17px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
								type="submit"
								onClick={() => navigate(ROUTER_SOCIAL.auth.login)}
							>
								ログインして利用を開始する
							</LoadingButton>
						</Box>
					</Box>
				</Box>
			}
		/>
	)
}

// SendOTPToEmail.defaultProps = {}

// SendOTPToEmail.propTypes = {}

export default React.memo(RegisterSuccess)

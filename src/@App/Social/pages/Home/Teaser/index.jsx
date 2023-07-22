import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import logo from '@App/Social/assets/logoHomePage.svg'
import teaser_logo from '@App/Social/assets/teaser_logo.svg'
import teaser_image4 from '@App/Social/assets/teaser_image4.svg'
import teaser_image5 from '@App/Social/assets/teaser_image5.png'
import teaser_mobile_image5 from '@App/Social/assets/teaser_mobile_image5.png'
import teaser_image6 from '@App/Social/assets/teaser_image6.png'
import teaser_image7 from '@App/Social/assets/teaser_image7.png'
import teaser_header from '@App/Social/assets/teaser_header.png'
import teaser_mobile_header from '@App/Social/assets/teaser_mobile_header.png'
import Equipment from './components/Equipment'
import Rateplan from './components/Rateplan'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import Contract from './components/Contract'
import { profileService } from '@App/Social/services/profileService'
import { useRequest } from 'ahooks'

const Teaser = props => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')

	const {
		data: profile,
		run: getProfile,
		loading
	} = useRequest(profileService.getBusinessProfile, {
		manual: true
	})

	useEffect(() => {
		getProfile()
	}, [])

	return (
		<Box className="w-full">
			<Box className="sm:flex h-auto sm:h-[724px] bg-[#FFFFFF] ">
				<Box className="sm:w-[60%] sm:text-center sm:mt-[90px] mt-[57px] lg:px-0 sm:px-[24px] px-16">
					<img src={isMobile ? teaser_logo : logo} className="sm:mx-auto" />
					<Typography className="sm:mt-32 mt-24 text-[#222222] text-[40px] font-semibold sm:leading-[180%] leading-[120%]">
						施設管理の
						<br className="sm:hidden block" />
						無人化を実現する
					</Typography>
					<Box className="sm:flex sm:justify-center ">
						{isMobile ? (
							<Typography className="lg:w-[520px] mt-8 text-start text-20 font-semibold leading-[160%] text-[#222222]">
								「ドアれぼ」を導入することで
								<br />
								施設の設備管理を完全無人化でき
								<br />
								施設の再利用の加速を実現します。
							</Typography>
						) : (
							<Typography className="lg:w-[520px] text-start text-20 font-semibold leading-[160%] text-[#222222]">
								「ドアれぼ」で施設管理の面倒な受付業務を無くして
								<br />
								施設貸出を革命しましょう
							</Typography>
						)}
					</Box>
					<Box className="text-center sm:mt-72 mt-56 sm:mb-0 mb-32">
						<a href={profile?.role === 'business' ? ROUTER_SOCIAL.event.search : import.meta.env.VITE_CMS_LOGIN_URL} target={profile?.role === 'business' ? "_self"  : "_blank"}>
							<Button
								variant="contained"
								color="primary"
								className="sm:w-auto w-full sm:text-20 text-16 sm:py-16 py-[17px] lg:px-[100px] sm:px-20 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF] "
								type="submit"
							>
								{isMobile ? '会員登録をして掲載を始める' : '会員登録をして施設の掲載を始める'}
							</Button>
						</a>
					</Box>
				</Box>
				<Box className="sm:w-[40%]">
					<img src={isMobile ? teaser_mobile_header : teaser_header} className="w-full h-full" />
				</Box>
			</Box>

			<Equipment />

			<Box className="text-center sm:mt-[72px] mt-[50px] sm:mb-[72px] mb-[50px]">
				<Typography className="sm:text-[32px] text-[24px] font-semibold text-[#222222]">
					スマートロックをドアへ設置
				</Typography>
				<img src={teaser_image4} className="lg:w-[800px] w-full mx-auto sm:mt-[32px] mt-16 sm:px-0 px-16" />

				<Typography className="sm:mt-[108px] mt-[32px] sm:text-[32px] text-[24px] font-semibold text-[#222222] sm:leading-[140%] leading-[100%]">
					WEBアプリや
					<br className="sm:hidden block" />
					スマートフォンアプリで集客
				</Typography>
				<img
					src={isMobile ? teaser_mobile_image5 : teaser_image5}
					className="mx-auto sm:mt-[32px] mt-16 sm:px-0 px-16"
				/>

				<Typography className="sm:mt-[108px] mt-[32px] sm:text-[32px] text-[24px] sm:leading-[140%] leading-[100%] font-semibold text-[#222222]">
					簡単に掲載情報の
					<br className="sm:hidden block" />
					公開・非公開設定や編集が可能
				</Typography>
				<img src={teaser_image6} className="lg:w-[800px] w-full mx-auto sm:mt-[32px] mt-16 sm:px-0 px-16" />

				<Typography className="sm:mt-[72px] mt-[32px] sm:text-[32px] text-[24px] font-semibold text-[#222222]">
					売上・予約の管理もデジタル化
				</Typography>
				<img src={teaser_image7} className="lg:w-[800px] w-full mx-auto sm:mt-[32px] mt-16 sm:px-0 px-16" />
			</Box>

			<Rateplan />

			<Contract />
		</Box>
	)
}
export default React.memo(Teaser)

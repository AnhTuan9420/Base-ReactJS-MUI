import { Box, Typography, Button, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import { useNavigate } from 'react-router-dom'
import SearchFacilityForm from './components/SearchFacilityForm'
import FacilitySlide from './components/FacilitySlide'
import homeBG from '@App/Social/assets/homeBG.png'
import logo from '@App/Social/assets/logoHomePage.svg'
import logoMobile from '@App/Social/assets/logoHomePageMobile.svg'
import { getSocialUser } from '@Core/helper/Session'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { facilityService } from '@App/Social/services/facilityService'
import { useRequest } from 'ahooks'
import { ShowLoginDialog } from '@App/Social/components/LoginDialog'
import InforHome from './components/InforHome'
import book1 from '@App/Social/assets/book1.png'
import book2 from '@App/Social/assets/book2.png'
import book3 from '@App/Social/assets/book3.png'
import arrow from '@App/Social/assets/arrow.png'
import arrowMobile from '@App/Social/assets/arrowMobile.png'
import imageBottom from '@App/Social/assets/imageBottom.png'
import imageBottomMobile from '@App/Social/assets/imageBottomMobile.png'

const HomeTop = props => {
	const navigate = useNavigate()
	const user = getSocialUser()
	const isMobile = useMediaQuery('(max-width:600px)')

	const { handleOpen, renderShowLoginDialog } = ShowLoginDialog()


	const handleShowLoginDialog = () => {
		handleOpen()
	}

	const {
		data: facility,
		run: getFacility,
		loading: loadingFacility
	} = useRequest(facilityService.getListFacility, {
		manual: true
	})

	useEffect(() => {
		getFacility({ created_at: 2 })
	}, [])

	return (
		<Box className="w-full">
			<Box className="h-[407px] sm:h-[504px] relative" sx={{ backgroundImage: `url('${homeBG}')` }}>
				<Box className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] sm:min-w-max min-w-[355px]">
					<img src={isMobile ? logoMobile : logo} className="sm:mb-36 mb-40 mx-auto sm:mt-[89px] mt-[62px]" />
					<Typography className="text-[#222222] text-center font-semibold sm:text-64 text-[39px] break-all leading-[120%] mb-8">
						クリエイティブを
						<br className="sm:block md:hidden block" />
						もっと身近にする
					</Typography>
					<Typography className="text-[#222222] text-center font-semibold sm:text-[26px] text-20 leading-[150%] sm:mb-[140px] mb-[80px]">
						レンタルスペースで、
						<br className="sm:hidden block" />
						あなたのアイデアを形にしよう
					</Typography>
				</Box>
			</Box>

			<SearchFacilityForm />

			<InforHome />

			<FacilitySlide facilities={facility?.data ?? []} loadingFacility={loadingFacility} />

			<Box className="sm:mb-[56px] mb-24 max-w-[1234px] sm:mx-auto text-center">
				<Typography className="mb-24 sm:text-[32px] text-[24px] font-semibold text-[#000000] pb-12 border-b-[2px] border-[#00A0E9] inline-block">
					ドアれぼを使って施設を予約する
				</Typography>

				<Box className="sm:px-0 px-16">
					<Typography className="text-[#000000] text-16 leading-[140%] sm:hidden block">
						ドアれぼはコワーキングスペースやレンタルスペース・会議質等の施設利用予約アプリです。
					</Typography>
					<Typography className="text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%] sm:mb-56 mb-24">
						用途に合わせて様々な施設を予約し、利用することができます。
						<br />
						施設の鍵は利用時間に合わせて自動で開閉するため、鍵管理は不要です。
					</Typography>

					<Box className="flex flex-col sm:flex-row items-center sm:gap-x-10 justify-center">
						<Box className="sm:flex sm:flex-col flex-row sm:w-full sm:gap-x-0 ">
							<img src={book1} className="sm:h-[342px] h-[318px]" />
							<Typography className="text-[#222222] sm:text-[26px] text-20 font-semibold sm:leading-[140%] sm:mt-24 mt-16">
								施設を探す
							</Typography>
						</Box>

						<img src={isMobile ? arrowMobile : arrow} className="sm:my-0 my-[40px]" />

						<Box className="sm:flex sm:flex-col flex-row items-center justify-center sm:w-full sm:gap-x-0 ">
							<img src={book2} className="sm:h-[342px] h-[318px]" />
							<Typography className="text-[#222222] sm:text-[26px] text-20 font-semibold sm:leading-[140%] sm:mt-24 mt-16">
								{isMobile ? '予約する' : '予約・支払いをする'}
							</Typography>
						</Box>

						<img src={isMobile ? arrowMobile : arrow} className="sm:my-0 my-[40px]" />

						<Box className="sm:flex sm:flex-col flex-row items-center sm:w-full sm:gap-x-0">
							<img src={book3} className="sm:h-[342px] h-[318px]" />
							<Typography className="text-[#222222] sm:text-[26px] text-20 font-semibold sm:leading-[140%] sm:mt-24 mt-16">
								利用する
							</Typography>
						</Box>
					</Box>
				</Box>
			</Box>

			<Box className="text-center sm:px-0 px-16">
				<Button
					variant="contained"
					color="primary"
					className="sm:w-[500px] w-full sm:text-20 text-16 sm:py-12 py-[17px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF] "
					type="submit"
					onClick={() => navigate(ROUTER_SOCIAL.event.search)}
				>
					施設を探す
				</Button>
			</Box>

			<Box className="text-center sm:mt-[176px] mt-[111px] sm:mb-[39px] mb-24">
				<Typography className="sm:text-[32px] text-[24px] font-semibold text-[#000000] pb-12 border-b-[2px] border-[#00A0E9] inline-block">
					施設を掲載したい方へ
				</Typography>
			</Box>
			{isMobile ? (
				<>
					<Typography className="text-[#000000] px-16 text-16 leading-[140%] font-light text-center">
						施設を有効に活用しませんか？
						<br />
						ドアれぼならIoT機器との連携で施設の貸出を楽に管理することができます。
					</Typography>
					<Box
						className="h-[154px] mb-16 text-center"
						sx={{ backgroundImage: `url('${imageBottomMobile}')` }}
					>
						<Box className="text-center pt-24 px-16">
							<Button
								variant="contained"
								color="primary"
								className="sm:w-[500px] w-full text-16  py-[17px] sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF] "
								type="submit"
								onClick={() => navigate(ROUTER_SOCIAL.event.teaser)}
							>
								施設を掲載したい方はこちら
							</Button>
						</Box>
					</Box>
				</>
			) : (
				<Box
					className="sm:h-[291px] sm:mb-[120px] text-center"
					sx={{ backgroundImage: `url('${imageBottom}')` }}
				>
					<Typography className="mb-56 pt-[17px] text-[#000000] text-20 leading-[160%] font-light ">
						施設を有効に活用しませんか？
						<br />
						ドアれぼならIoT機器との連携で施設の貸出を楽に管理することができます。
					</Typography>
					<Box className="text-center sm:px-0 px-16">
						<Button
							variant="contained"
							color="primary"
							className="sm:w-[500px] w-full sm:text-20 text-16 sm:py-12 py-[17px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF] "
							type="submit"
							onClick={() => window.open(ROUTER_SOCIAL.event.teaser, '_blank')}
							
						>
							施設を掲載したい方はこちら
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	)
}
export default React.memo(HomeTop)

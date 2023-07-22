import { Box, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useLocation, Link, useHref } from 'react-router-dom'
import logoFooter from '@App/Social/assets/logoFooter.svg'
import appStore from '@App/Social/assets/App_Store.svg'
import googlePlay from '@App/Social/assets/Google_Play.svg'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import bannerFooter from '@App/Social/assets/bannerFooter.png'
import { getSocialUser } from '@Core/helper/Session'

const AppFooter = props => {
	const navigate = useNavigate()
	const location = useLocation()
	const currentUrl = useHref()
	const user = getSocialUser()

	const dataFooter = [
		{
			label: '運営会社',
			id: 1,
			onClick() {
				window.open('https://sx-lab.jp/', '_blank')
			}
		},
		{
			label: 'お問い合わせ',
			id: 2,
			onClick() {
				navigate('/inquiry-for-manage')
			}
		},
		{
			label: 'プライバシーポリシー',
			id: 3,
			onClick() {
				navigate('/privacy')
			}
		},
		{
			label: 'キャンセルポリシー',
			id: 4,
			onClick() {
				navigate('/cancellation')
			}
		},
		{
			label: '利用規約',
			id: 5,
			onClick() {
				navigate('/terms')
			}
		},
		{
			label: '特定商取引法に基づく表示',
			id: 5,
			onClick() {
				navigate('/law')
			}
		}
	]

	return (
		<Box
			className="bg-white sm:px-0 px-16 pt-[40px] bg-no-repeat bg-cover bg-center"
			sx={{ backgroundImage: `url('${bannerFooter}')` }}
		>
			<Box className="max-w-[1000px] w-full sm:w-[80%] lg:w-[1000px] mx-auto ">
				<Box className="mb-24">
					<img src={logoFooter} alt="" />
				</Box>
				<Typography className="text-16 leading-[140%] font-semibold text-[#222222] mb-16">
					施設を利用したい方
				</Typography>
				<Box className="md:flex flex-none items-center mb-20">
					<Typography
						className="sm:text-16 text-14 leading-[140%] text-[#222222] font-light sm:mr-[24px] cursor-pointer"
						onClick={() => navigate(ROUTER_SOCIAL.event.search)}
					>
						施設検索
					</Typography>
					<Typography
						className="sm:mt-0 mt-16 sm:text-16 text-14 leading-[140%] text-[#222222] font-light cursor-pointer"
						onClick={() => navigate(ROUTER_SOCIAL.questions)}
					>
						よくある質問
					</Typography>
				</Box>

				<Typography className="text-16 leading-[140%] font-semibold text-[#222222] mt-[30px] mb-16">
					施設を掲載したい方
				</Typography>
				<Box className="md:flex flex-none items-center">
					<Typography
						className="sm:text-16 text-14 leading-[140%] text-[#222222] font-light sm:mr-[24px] cursor-pointer"
						onClick={() => navigate(ROUTER_SOCIAL.event.teaser)}
					>
						施設の掲載について
					</Typography>
					{!user ? (
						<Box className="sm:mt-0 mt-16">
							<a
								href={import.meta.env.VITE_CMS_LOGIN_URL}
								target="_blank"
								className="sm:flex flex-none sm:mt-0 mt-16 sm:text-16 text-14 leading-[140%] text-[#222222] font-light cursor-pointer"
							>
								<Typography className="md:block hidden">ログイン・</Typography>
								<Typography>会員登録</Typography>
							</a>
						</Box>
					) : null}
				</Box>

				<Typography className="text-16 leading-[140%] font-semibold text-[#222222] mt-[30px] sm:mb-16">
					ドアれぼについて
				</Typography>
				<Box className="md:flex flex-none items-center mb-[30px] cursor-pointer">
					{dataFooter.map(item => (
						<Typography
							className="sm:mt-0 mt-16 sm:text-16 text-14 leading-[140%] text-[#222222] font-light sm:mr-[24px] cursor-pointer"
							key={item?.id}
							onClick={() => item?.onClick()}
						>
							{item?.label}
						</Typography>
					))}
				</Box>

				<Typography className="text-16 leading-[140%] font-semibold text-[#222222] mt-[30px] mb-16">
					iOS・Android向けアプリ
				</Typography>
				<Box className="flex items-center gap-16">
					<Box>
						<a href="https://apps.apple.com/JP/app" target="_blank">
							<img src={appStore} alt="" />
						</a>
					</Box>
					<Box>
						<a href="https://play.google.com/store/apps" target="_blank">
							<img src={googlePlay} alt="" />
						</a>
					</Box>
				</Box>
				{currentUrl.includes('facility-detail') ? (
					<Box className="text-center sm:mt-[64px] mt-32 sm:pb-[24px] pb-[122px]">
						<Typography>Social Network © Copyright 2023</Typography>
					</Box>
				) : (
					<Box className="text-center sm:mt-[64px] mt-32 sm:pb-[24px] pb-[32px]">
						<Typography>Social Network © Copyright 2023</Typography>
					</Box>
				)}
			</Box>
		</Box>
	)
}

export default React.memo(AppFooter)

import { Box, Typography, useMediaQuery, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import teaser_image8 from '@App/Social/assets/teaser_image8.png'
import teaser_image9 from '@App/Social/assets/teaser_image9.png'
import teaser_image10 from '@App/Social/assets/teaser_image10.png'
import teaser_arrow1 from '@App/Social/assets/teaser_arrow1.png'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'

const Contract = () => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<Box className="text-center">
			<Typography className="sm:pt-[72px] pt-56 text-[#222222] sm:text-40 text-24 font-semibold sm:leading-[140%] border-b-[2px] border-[#00A0E9] inline-block">
				施設掲載・契約までの流れ
			</Typography>
			<Box className="sm:flex justify-center sm:mt-56 mt-32 sm:gap-x-16 lg:px-0 px-16">
				<Box className="lg:w-[300px] sm:w-auto flex sm:flex-col items-center ">
					<img src={teaser_image8} className="sm:mx-auto lg:h-auto h-[100px] mr-16" />
					<Box className="sm:flex sm:flex-col items-center">
						<Typography className="sm:text-center text-start sm:mt-16 sm:min-h-[64px] sm:flex sm:items-center text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							会員登録
						</Typography>
						<Typography className="text-start text-[#222222] sm:mt-16 mt-4 sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
							本サイトから無料デモ版にご登録いただきます
						</Typography>
					</Box>
				</Box>

				<img src={teaser_arrow1} className="h-40 sm:mt-60 sm:ml-0 ml-[30px] sm:rotate-0 rotate-90" />

				<Box className="lg:w-[300px] sm:w-auto flex sm:flex-col items-center">
					<img src={teaser_image9} className="sm:mx-auto lg:h-auto h-[100px] mr-16" />
					<Box className="sm:flex sm:flex-col items-center">
						<Typography className="sm:text-center text-start sm:mt-16 sm:min-h-[64px] sm:flex sm:items-center text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							無料デモ版をお試し利用
						</Typography>
						<Typography className="text-start text-[#222222] sm:mt-16 mt-4 sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
							実際にどのように施設の管理・予約の管理をおこなうのか、デモ画面で確認することができます
						</Typography>
					</Box>
				</Box>

				<img src={teaser_arrow1} className="h-40 sm:mt-60 sm:ml-0 ml-[30px] sm:rotate-0 rotate-90" />

				<Box className="lg:w-[300px] sm:w-auto flex sm:flex-col items-center">
					<img src={teaser_image10} className="sm:mx-auto lg:h-auto h-[100px] mr-16" />
					<Box className="sm:flex sm:flex-col items-center">
						<Typography className="sm:text-center text-start sm:mt-16 sm:min-h-[64px] sm:flex sm:items-center text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							有料プランに契約変更
							<br />
							施設をアプリに掲載
						</Typography>
						<Typography className="text-start text-[#222222] sm:mt-16 mt-4 sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
							ドアれぼアプリへの施設掲載・スマートロック等のIoT機器の利用が可能になります
						</Typography>
					</Box>
				</Box>
			</Box>

			<Box className="text-center sm:mt-48 mt-32 sm:mb-[120px] mb-56 lg:px-0 sm:px-16 px-16">
				<a href={import.meta.env.VITE_CMS_LOGIN_URL} target="_blank">
					<Button
						variant="contained"
						color="primary"
						className="lg:w-[600px] w-full sm:text-20 text-16 sm:py-16 py-[17px] px-0 sm:leading-[160%] leading-[140%] shadow-none font-semibold text-[#FFFFFF] "
						type="submit"
					>
						会員登録をして掲載を始める
					</Button>
				</a>
				<Box className="mx-auto text-center lg:w-[600px] w-full">
					<Typography className="text-start text-[#222222] sm:mt-24 mt-16 sm:text-16 text-14 font-normal sm:leading-[125%] leading-[140%]">
						※まずは無料のデモ版へのご登録となります。有料プランに自動で切り替わることはございません。
					</Typography>
					<Typography className="text-start text-[#222222] mt-8 sm:text-16 text-14 font-normal sm:leading-[125%] leading-[140%]">
						※施設掲載が可能になる有料プランは、無料デモ版に登録いただいた後にご利用いただけます。
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default Contract

import { Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import inforBG from '@App/Social/assets/inforBG.png'
import inforImage from '@App/Social/assets/inforImage.png'
import inforImageMobile from '@App/Social/assets/inforImageMobile.png'

const InforHome = () => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<Box className="w-full">
			<Box
				className="text-center sm:h-auto bg-no-repeat bg-center sm:mb-[120px] mb-56"
				sx={{ backgroundImage: `url('${inforBG}')` }}
			>
				{isMobile ? (
					<Typography className="sm:mt-[120px] mt-56 mb-[56px] pb-6 border-b-[2px] border-[#00A0E9] inline-block sm:text-[32px] text-[24px] font-semibold text-[#000000]">
						自分のアイディアに集中し
						<br />
						創造的な時間を楽しむ
					</Typography>
				) : (
					<Typography className="sm:mt-[120px] mt-56 mb-[56px] pb-6 border-b-[2px] border-[#00A0E9] inline-block sm:text-[40px] text-[24px] font-semibold text-[#000000]">
						自分のアイディアに集中し創造的な時間を楽しむ
					</Typography>
				)}
				<img src={isMobile ? inforImageMobile : inforImage} className="mx-auto mb-[44px]" />

				<Typography className="sm:px-0 px-16 sm:text-[26px] text-20 font-semibold sm:leading-[140%] text-[#000000] mb-24">
					人間のクリエイティブな活動は環境や場所に大きく影響する
				</Typography>

				<Box className="sm:px-0 px-16">
					<Box className="flex flex-wrap justify-center">
						<Typography className="font-semibold text-[#00A0E9] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
							ドアれぼ
						</Typography>
						<Typography className=" text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
							は私たちのクリエイティブを加
						</Typography>
						<Typography className=" text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
							速させる
						</Typography>
					</Box>
					<Typography className="text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%] mb-24">
						コワーキングスペースやレンタルスペース・会議室等の施設を利用できるアプリです。
					</Typography>

					<Typography className="text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
						レンタルできる施設はビジネスシーンだけではなく、
					</Typography>

					<Typography className="text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%] mb-24">
						動画配信やワークショップ・展示会などにも活用できます。
					</Typography>
					<Box className="flex flex-wrap justify-center">
						<Typography className="font-semibold text-[#00A0E9] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
							ドアれぼ
						</Typography>
						<Typography className=" text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
							なら鍵開閉が自動なので面倒な鍵の受け
						</Typography>
						<Typography className=" text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
							渡しがなく、
						</Typography>
					</Box>

					<Typography className="text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%] mb-24">
						当日現地に行くだけでスマートに施設を利用できます。
					</Typography>

					<Typography className="text-[#000000] font-semibold sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
						いつもと違う環境で日常をクリエイティブにしましょう！
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default InforHome

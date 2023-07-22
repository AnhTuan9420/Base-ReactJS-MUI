import { Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import bannerFooter from '@App/Social/assets/bannerFooter.png'
import teaser_image1 from '@App/Social/assets/teaser_image1.png'
import teaser_image2 from '@App/Social/assets/teaser_image2.png'
import teaser_image3 from '@App/Social/assets/teaser_image3.png'
import teaser_arrow from '@App/Social/assets/teaser_arrow.png'

const Equipment = () => {
	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<Box
			className="sm:pt-[72px] sm:pb-[72px] pt-[56px] pb-56 sm:mx-auto text-center"
			sx={{ backgroundImage: `url('${bannerFooter}')` }}
		>
			<Box className="sm:mx-auto text-center sm:text-[40px] text-[24px] font-semibold text-[#222222] sm:leading-[140%] leading-[100%]">
				施設の設備管理を
				<br />
				<Box className="md:flex justify-center">
					無人化するサービス
					<br className="sm:hidden block" />
					<Box className="flex justify-center">
						「
						<p className="font-semibold text-[#00A0E9] sm:text-[40px] text-[24px]">
							ドアれぼ
						</p>
						」の特徴
					</Box>
				</Box>
			</Box>

			<Box className="sm:mt-24 mt-32 max-w-[1211px] sm:w-auto w-full mx-auto sm:px-0 px-16">
				<Box className="flex flex-col md:flex-row items-center lg:gap-x-56 md:gap-x-16 sm:gap-x-8 justify-center bg-[#FFFFFF] sm:py-[32px] lg:px-[117px] sm:px-24">
					
					<Box className="flex flex-col items-center lg:w-[488px] sm:w-auto sm:gap-x-0 sm:pt-0 pt-32">
						<img src={teaser_image1} className='sm:w-auto w-[160px]' />
						<Typography className="text-[#222222] sm:flex sm:items-center sm:min-h-[68px] sm:text-[28px] text-16 font-semibold sm:leading-[140%] sm:mt-24 mt-16">
							鍵の受け渡し無人化
						</Typography>
						<img src={teaser_arrow} className="sm:my-16 my-8 mx-auto" />
						<Typography className="text-[#00A0E9] sm:flex sm:items-center sm:min-h-[118px] sm:text-[42px] text-[24px] font-semibold sm:leading-[140%]">
							人件費削減!!!
						</Typography>
					</Box>

					<Box className="flex flex-col items-center justify-center lg:w-[488px] sm:w-auto sm:gap-x-0 sm:mt-0 mt-56">
						<img src={teaser_image2} className='sm:w-auto w-[160px]' />
						<Typography className="text-[#222222] sm:flex sm:items-center sm:min-h-[68px] sm:text-[28px] text-16 font-semibold sm:leading-[140%] sm:mt-24 mt-16">
							ネットで集客
						</Typography>
						<img src={teaser_arrow} className="sm:my-16 my-8 mx-auto" />
						<Typography className="text-[#00A0E9] sm:min-h-[118px] sm:text-[42px] text-[24px] font-semibold sm:leading-[140%]">
							広告掲載に
							<br className='sm:block hidden'/>
							迷わない!!
						</Typography>
					</Box>

					<Box className="flex flex-col items-center lg:w-[488px] sm:w-auto sm:gap-x-0 sm:mt-0 mt-56 sm:mb-0 mb-32">
						<img src={teaser_image3} className='sm:w-auto w-[160px]' />
						<Typography className="text-[#222222] sm:min-h-[68px] sm:text-[28px] text-16 font-semibold sm:leading-[140%] sm:mt-24 mt-16">
							予約管理・売上管理
							<br />
							デジタル化
						</Typography>
						<img src={teaser_arrow} className="sm:my-16 my-8 mx-auto" />
						<Typography className="text-[#00A0E9] lg:w-[305px] sm:w-auto sm:flex sm:items-center sm:min-h-[118px] sm:text-[42px] text-[24px] font-semibold sm:leading-[160%]">
							施設管理のDX!!
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default Equipment

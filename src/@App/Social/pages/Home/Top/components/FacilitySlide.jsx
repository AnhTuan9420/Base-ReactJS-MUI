import React from 'react'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import Image from 'mui-image'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { Link } from 'react-router-dom'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'
import 'swiper/css'

const FacilitySlide = ({ facilities, loadingFacility }) => {
	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<Box className="sm:mb-[120px] mb-[112px] text-center">
			<Typography className="mb-24 sm:text-[32px] text-[24px] font-semibold pb-12 border-b-[2px] border-[#00A0E9] inline-block text-[#000000]">
				最近掲載された施設
			</Typography>
			<Typography className="text-[#000000] sm:text-20 text-16 sm:leading-[160%] leading-[140%] mb-24 sm:px-0 px-16">
				使い方は無限大! あなたのアイディアに合う施設を見つけましょう。
			</Typography>

			{isMobile ? (
				facilities?.slice(0, 3)?.map((item, index) => {
					return (
						<Box key={index} className="border border-[#E0E0E0] h-[390px] w-full" >
							<Link
								to={`${ROUTER_SOCIAL.event.detail}/?facility_id=${item?.id}`}
								className="relative block h-full bg-[#bbbbbb]"
							>
								<Image
									src={item?.main_image?.image_url ?? imagefail}
									duration={500}
									className="h-full pb-[80px] overflow-hidden w-full object-cover"
								/>
								<Box className="bg-[white] inset-x-[16px] bottom-[16px] absolute p-16">
									<Typography className="text_truncate_1 text-start text-[#00A0E9] text-20 font-semibold leading-[140%] mb-8">
										{item?.name}
									</Typography>

									<Box className="flex mb-8">
										<PlaceOutlinedIcon fontSize="medium" className=" self-center" />
										<Typography className="text_truncate_1 text-[#000000] text-16 leading-[140%] font-light">
											{item?.nearby_station}
										</Typography>
									</Box>

									<Box className="flex items-center gap-8 overflow-hidden min-h-[30px]">
										{item?.tags?.length <= 2
											? item?.tags?.map((tag, i) => (
													<Box
														className="py-4 px-12 bg-[#FFFFFF] text-[16px] truncate text-[#00A0E9] border-solid border-[1px] rounded-[160px] "
														key={i}
													>
														#{tag?.name}
													</Box>
											  ))
											: item?.tags?.slice(0, 2)?.map((tag, i) => (
													<Box
														className="py-4 px-12 bg-[#FFFFFF] text-[16px] truncate text-[#00A0E9] border-solid border-[1px] rounded-[160px] "
														key={i}
													>
														# {tag?.name}
													</Box>
											  ))}
										{item?.tags?.length > 2 ? (
											<Typography className="text-[16px]">
												+{item?.tags?.length - 2}
											</Typography>
										) : null}
									</Box>
								</Box>
							</Link>
						</Box>
					)
				})
			) : (
				<Swiper
					// spaceBetween={20}
					autoplay={{
						// delay: 4500,
						disableOnInteraction: false
					}}
					modules={[Autoplay]}
					breakpoints={{
						320: {
							slidesPerView: 1,
							// spaceBetween: auto
						},
						940: {
							slidesPerView: 2,
							// spaceBetween: 20
						},
						1410:{
							slidesPerView: 3,
							// spaceBetween: 20
						},
						1880:{
							slidesPerView: 3,
							// spaceBetween: 20
						},

					}}
				>
					{facilities.map((item, i) => (
						<SwiperSlide key={i}>
							<Box className="mx-auto border border-[#E0E0E0] h-[516px] w-[476px]">
								<Link
									to={`${ROUTER_SOCIAL.event.detail}/?facility_id=${item?.id}`}
									className="relative block h-full "
								>
									<Image
										src={item?.main_image?.image_url ?? imagefail}
										duration={500}
										className="h-full w-full object-cover"
									/>
									<Box className="bg-[white] inset-x-[16px] bottom-[14px] absolute p-16 opacity-[0.9]">
										<Typography className="text_truncate_1 text-start text-[#00A0E9] text-[26px] font-semibold leading-[140%] mb-8">
											{item?.name}
										</Typography>

										<Box className="flex mb-8">
											<PlaceOutlinedIcon fontSize="medium" className="ml-[5px] self-center" />
											<Typography className="text_truncate_1 text-[#000000] text-20 leading-[160%] font-light">
												{item?.nearby_station}
											</Typography>
										</Box>

										<Box className="flex items-center gap-8 overflow-hidden min-h-[30px]">
											{item?.tags?.length <= 2
												? item?.tags?.map((tag, i) => (
														<Box
															className="py-4 px-12 bg-[#FFFFFF] text-[16px] truncate text-[#00A0E9] border-solid border-[1px] rounded-[160px] "
															key={i}
														>
															#{tag?.name}
														</Box>
												  ))
												: item?.tags?.slice(0, 2)?.map((tag, i) => (
														<Box
															className="py-4 px-12 bg-[#FFFFFF] text-[16px] truncate text-[#00A0E9] border-solid border-[1px] rounded-[160px] "
															key={i}
														>
															# {tag?.name}
														</Box>
												  ))}
											{item?.tags?.length > 2 ? (
												<Typography className="text-[16px]">
													+{item?.tags?.length - 2}
												</Typography>
											) : null}
										</Box>
									</Box>
								</Link>
							</Box>
						</SwiperSlide>
					))}
				</Swiper>
			)}
		</Box>
	)
}

export default FacilitySlide

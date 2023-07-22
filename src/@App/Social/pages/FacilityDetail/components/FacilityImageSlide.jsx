import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation } from 'swiper'
import { Box } from '@mui/material'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'

const FacilityImageSlide = ({ data }) => {
	const allImageUndefined = data?.every(currentValue => currentValue === undefined)
	return (
		<Swiper
			pagination={{
				type: 'fraction'
			}}
			navigation={true}
			modules={[Pagination, Navigation]}
			className="mySwiper"
		>
			{!allImageUndefined &&
				data?.map((item, index) => (
					<SwiperSlide key={index} className="bg-[#ccc]">
						<Box className="flex justify-center w-full">
							{item?.image_url ? (
								<img src={item?.image_url} className="h-[300px] sm:h-[500px]" />
							) : (
								<img src={imagefail} className="h-[300px] sm:h-[500px] min-w-[100%] object-cover" />
							)}
						</Box>
					</SwiperSlide>
				))}
			{allImageUndefined && (
				<SwiperSlide className="bg-[#ccc]">
					<Box className="flex justify-center w-full">
						<img src={imagefail} className="h-[300px] sm:h-[500px] min-w-[100%] object-cover" />
					</Box>
				</SwiperSlide>
			)}
		</Swiper>
	)
}

export default FacilityImageSlide

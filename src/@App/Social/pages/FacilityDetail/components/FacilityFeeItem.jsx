import { Box, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'

const FacilityFeeItem = ({ data, label, entry, plan_id }) => {
	return (
		<Box className="flex">
			{data?.length > 0 ? (
				plan_id === 2 || plan_id === 4 ? (
					<Box
						className={
							entry
								? 'border-1 bg-[#EFFAFF] border-[#E0E0E0] h-auto w-[20%] py-[9px] pl-8 flex items-center'
								: 'border-1 bg-[#D4EDDA] border-[#E0E0E0] h-auto w-[20%] py-16 pl-8 flex items-center'
						}
					>
						<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
							{label}
						</Typography>
					</Box>
				) : (
					<Box
						className={
							entry
								? 'border-1 bg-[#EFFAFF] border-[#E0E0E0] h-auto w-[20%] py-[9px] pl-8 flex items-center'
								: 'border-1 bg-[#EFFAFF] border-[#E0E0E0] h-auto w-[20%] py-16 pl-8 flex items-center'
						}
					>
						<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
							{label}
						</Typography>
					</Box>
				)
			) : null}
			<Box className="w-[80%]">
				{data?.map((item, index) => (
					<Box className="flex w-full" key={index}>
						<Box
							className={
								entry
									? 'border-1 border-[#E0E0E0] h-auto w-1/2 py-[9px] pl-8'
									: 'border-1 border-[#E0E0E0] h-auto w-1/2 py-16 pl-8'
							}
						>
							<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
								{item?.opening_time} ~ {item?.closing_time}
							</Typography>
						</Box>
						<Box
							className={
								entry
									? 'border-1 border-[#E0E0E0] h-auto w-1/2 py-[9px] pl-8'
									: 'border-1 border-[#E0E0E0] h-auto w-1/2 py-16 pl-8'
							}
						>
							<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
								¥{(item?.price)?.toLocaleString()?.replace('.',',')}
							</Typography>
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default FacilityFeeItem

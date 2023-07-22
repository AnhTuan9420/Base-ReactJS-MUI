import { Box, CircularProgress, Divider, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import clsx from 'clsx'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FacilityFeeItem from './FacilityFeeItem'

const TableRentalPlan = props => {
	const { openTableRental, setOpenTableRental, loadingRentalPlan, rentalPlan, plan_id } = props

	return (
		<>
			<Box
				className={clsx(
					'z-9999 bg-white absolute w-screen top-0 p-16 bottom-0 ease-out duration-500  ',
					openTableRental ? 'right-0' : 'right-[-100%]'
				)}
			>
				<Box className="flex items-center mb-16">
					<ArrowBackIosNewIcon
						fontSize="inherit"
						color="primary"
						className="items-start"
						onClick={() => setOpenTableRental(false)}
					/>
					<Typography className="font-semibold mx-auto text-[20px] text-[#000000]">
						この施設の料金プラン
					</Typography>
				</Box>

				<Box className="flex">
					<Box
						className={
							plan_id === 2 || plan_id === 4
								? 'bg-[#D4EDDA] border-1 border-[#E0E0E0] h-auto w-[20%] py-[17px] pl-8'
								: 'bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[20%] py-[17px] pl-8'
						}
					></Box>
					<Box
						className={
							plan_id === 2 || plan_id === 4
								? 'bg-[#D4EDDA] border-1 border-[#E0E0E0] h-auto w-[40%] py-[17px] pl-8'
								: 'bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[40%] py-[17px] pl-8'
						}
					>
						<Typography className="text-14 text-[#000000] font-light leading-[140%]">時間帯</Typography>
					</Box>
					<Box
						className={
							plan_id === 2 || plan_id === 4
								? 'bg-[#D4EDDA] border-1 border-[#E0E0E0] h-auto w-[40%] py-[17px] pl-8'
								: 'bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[40%] py-[17px] pl-8'
						}
					>
						<Typography className="text-14 text-[#000000] font-light leading-[140%]">時間単価</Typography>
					</Box>
				</Box>
				{loadingRentalPlan ? (
					<div className="mt-40 text-center">
						<CircularProgress />
					</div>
				) : (
					<>
						{rentalPlan?.workingday?.length > 0 ? (
							<FacilityFeeItem data={rentalPlan?.workingday} plan_id={plan_id} label="平日" />
						) : null}
						{rentalPlan?.saturday?.length > 0 ? (
							<FacilityFeeItem data={rentalPlan?.saturday} plan_id={plan_id} label="土曜日" />
						) : null}
						{rentalPlan?.saturday?.length > 0 ? (
							<FacilityFeeItem data={rentalPlan?.sunday} plan_id={plan_id} label="日曜日" />
						) : null}
						{rentalPlan?.saturday?.length > 0 ? (
							<FacilityFeeItem data={rentalPlan?.holiday} plan_id={plan_id} label="祝日" />
						) : null}
					</>
				)}
			</Box>
		</>
	)
}

export default memo(TableRentalPlan)

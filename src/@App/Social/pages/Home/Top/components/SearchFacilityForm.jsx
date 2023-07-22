import CoreInput from '@Core/components/Input/CoreInput'
import { Box, Button, Chip, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSearchDialog } from '@App/Social/pages/Facility/hooks/useSearchDialog'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { setDataSession } from '@Core/helper/Session'

const SearchFacilityForm = () => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')

	const { addTags, handleOpenSearchDialog, renderSearchDialog } = useSearchDialog()
	const { control, handleSubmit } = useForm({
		mode: 'onSubmit'
	})

	const onSubmit = handleSubmit(data => {
		if (data.facility_type || addTags.length > 0) {
			setDataSession('session', 'tags', addTags)
			if (data.facility_type) {
				navigate(ROUTER_SOCIAL.event.search, { state: data?.facility_type })
			} else {
				navigate(ROUTER_SOCIAL.event.search)
			}
		} else {
			navigate(ROUTER_SOCIAL.event.search)
		}
	})

	return (
		<Box className="bg-[#EFFAFF]">
			<form onSubmit={onSubmit} className="sm:w-[80%] lg:w-[1234px]  mx-auto text-center">
				<Typography className="sm:mt-40 sm:mb-[30px] mb-[31px] mt-32 pb-12 border-b-[2px] border-[#00A0E9] inline-block sm:text-[32px] text-[24px] font-semibold text-[#000000]">
					施設を検索する
				</Typography>
				<Box className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full sm:pb-40 sm:px-0 px-16">
					<Box
						className={
							isMobile
								? 'w-full lg:w-[477px] sm:w-[35%] text-start bg-white cursor-pointer sm:mb-0 mb-16'
								: 'w-full lg:w-[477px] sm:w-[35%] bg-white cursor-pointer sm:mb-0 mb-16 overflow-hidden'
						}
						onClick={handleOpenSearchDialog}
					>
						<Box className="text-[#00A0E9] h-[56px] sm:text-[20px] sm:leading-[160%] text-16 sm:py-12 py-20 px-16 sm:pr-0 not-italic font-semibold flex items-center sm:justify-start justify-between">
							{addTags?.length == 0 ? (
								'タグを選択'
							) : (
								<Box className="flex overflow-hidden w-full">
									{isMobile ? (
										<>
											{addTags?.slice(0, 2)?.map((tag, i) => (
												<Box className="mr-10">
													<Chip
														key={i}
														label={tag?.name}
														color="secondary"
														className="text-white text-16 font-light"
													/>
												</Box>
											))}
											{addTags?.length >= 2 && <Typography className="">...</Typography>}
										</>
									) : (
										addTags?.map((tag, i) => (
											<Box className="mr-10">
												<Chip
													key={i}
													label={tag?.name}
													color="secondary"
													className="text-white text-16 font-light"
												/>
											</Box>
										))
									)}
								</Box>
							)}
							{!isMobile ? (
								<> {addTags?.length > 0 ? null : <AddIcon fontSize="medium" />} </>
							) : (
								<AddIcon fontSize="medium" />
							)}
						</Box>
					</Box>

					<Box className="w-full lg:w-[477px] sm:w-[35%] sm:mb-0 mb-16">
						<CoreInput
							control={control}
							name="facility_type"
							placeholder="フリーワード"
							variant="outlined"
							size="small"
							className="bg-white"
							sx={{
								'@media screen and (min-width: 600px)': {
									'.MuiOutlinedInput-input': {
										paddingY: '12px',
										paddingX: '16px',
										fontSize: '20px',
										lineHeight: '160%',
										height: '32px'
										// color: '#888888'
									},
									'.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
										borderColor: 'white'
									}
								},
								'@media screen and (max-width: 600px)': {
									'.MuiOutlinedInput-input': {
										paddingY: '16px',
										paddingX: '16px',
										fontSize: '16px',
										lineHeight: '140%',
										height: '24px'
									},
									'.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
										borderColor: 'white'
									}
								}
							}}
						/>
					</Box>
					<Box className="w-full lg:w-[200px] sm:w-[20%] sm:mb-0 mb-[48px]">
						<Button
							variant="contained"
							disableElevation
							size="small"
							className="w-full h-[56px] sm:text-20 text-16 font-semibold sm:py-12 py-[17px] "
							color="primary"
							type="submit"
						>
							検索する
						</Button>
					</Box>
				</Box>
			</form>
			{renderSearchDialog()}
		</Box>
	)
}

export default SearchFacilityForm

import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { Box, Card, CircularProgress, Pagination, Typography } from '@mui/material'
import Image from 'mui-image'
import React, { useEffect, useState } from 'react'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { Link } from 'react-router-dom'
// import no_image from '@App/Social/assets/no_image.webp'
import iconHistory from '@App/Social/assets/iconHistory.svg'
import imagefail from '@App/Social/assets/imagefail.svg'

const ListHistory = props => {
	const { listHistory, getHistoryList, loading } = props
	const [pageApi, setPageApi] = useState(1)

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [pageApi])

	useEffect(() => {
		const params = {
			// order_by: 'DESC',
			// order_name: 'id',
			per_page: 15,
			page: pageApi
		}
		getHistoryList(params)
	}, [pageApi])

	return (
		<EventContentPage
			maxWidth={1000}
			content={
				<Box className="flex flex-col">
					{loading ? (
						<div className="mt-40 text-center">
							<CircularProgress />
						</div>
					) : (
						<>
							<Typography className="text-center sm:text-[32px] sm:mt-[74px] mt-[32px] text-22 sm:mb-[56px] mb-24 text-[#000000] font-semibold">
								利用履歴
							</Typography>
							<>
								{listHistory?.facilityReservations?.length > 0 ? (
									<>
										{listHistory?.facilityReservations?.map((item, index) => {
											if (item?.status === '予約中') {
												return (
													<Box
														key={index}
														className="sm:border border-b-1 border-[#E0E0E0] px-16 sm:mb-16 mb-0 sm:rounded sm:h-[206px] h-[96px] w-full sm:p-[16px] py-8"
													>
														<Link
															to={`${ROUTER_SOCIAL.event.history_detail}/?history_id=${item?.id}`}
														>
															<Box className="flex h-full">
																<Box className="sm:min-w-[261px] min-w-[80px] sm:max-w-[261px] max-w-[80px] object-cover sm:mr-16 mr-[8px]">
																	<Image
																		src={
																			item?.facility?.main_image?.image_url ??
																			imagefail
																		}
																		className="w-full max-h-full"
																	/>
																</Box>
																<Box className="w-full sm:pt-[13px] sm:mb-8 mb-4">
																	<Box className="flex">
																		<img
																			src={iconHistory}
																			className="h-20 mr-6 sm:mt-6 mt-2"
																		/>
																		<Box className="flex justify-between items-start w-full">
																			<Typography className="text_truncate_1 font-semibold sm:leading-[160%] leading-[140%] text-16 sm:text-20 text-[#222222]">
																				{item?.facility?.name}
																			</Typography>
																			<Typography className="text-14 min-w-max items-end text-center sm:text-20 sm:leading-[160%] leading-[140%] font-light sm:py-[4px] py-[3px] sm:px-[36px] px-16 rounded-[20px] border-solid border-[1px] border-[#00A0E9] bg-white text-[#00A0E9] ">
																				{item?.status}
																			</Typography>
																		</Box>
																	</Box>
																	<Box className="flex items-center sm:mb-8 mb-4">
																		<Typography className="text-16 mr-8 font-light sm:text-20 text-[#222222]">
																			{item?.start_date}
																		</Typography>
																		<Typography className="text-16 sm:text-20 font-light text-[#222222]">
																			{item?.start_time} ~ {item?.end_time}
																		</Typography>
																	</Box>
																	<Box>
																		<Typography className="text-14 sm:text-20 sm:text_truncate_2 text_truncate_1 sm:leading-[160%] leading-[140%] text-[#222222]">
																			{item?.facility?.introduction}
																		</Typography>
																	</Box>
																</Box>
															</Box>
														</Link>
													</Box>
												)
											} else if (item?.status === '利用済') {
												return (
													<Box
														key={index}
														className="sm:border border-b-1 border-[#E0E0E0] px-16 sm:mb-16 mb-0 sm:rounded sm:h-[206px] h-[96px] w-full sm:p-[16px] py-8"
													>
														<Link
															to={`${ROUTER_SOCIAL.event.history_detail}/?history_id=${item?.id}`}
														>
															<Box className="flex h-full">
																<Box className="sm:min-w-[261px] min-w-[80px] sm:max-w-[261px] max-w-[80px] object-cover sm:mr-16 mr-[8px]">
																	<Image
																		src={
																			item?.facility?.main_image?.image_url ??
																			imagefail
																		}
																		className="w-full max-h-full"
																	/>
																</Box>
																<Box className="w-full sm:pt-[13px] sm:mb-8 mb-4">
																	<Box className="flex">
																		<img
																			src={iconHistory}
																			className="h-20 mr-6 sm:mt-6 mt-2"
																		/>
																		<Box className="flex justify-between items-start w-full">
																			<Typography className="text_truncate_1 font-semibold sm:leading-[160%] leading-[140%] text-16 sm:text-20 text-[#222222]">
																				{item?.facility?.name}
																			</Typography>
																			<Typography className="text-14 min-w-max items-end text-center sm:text-20 sm:leading-[160%] leading-[140%] font-light sm:py-[4px] py-[3px] sm:px-[36px] px-16  rounded-[20px] border-solid border-[1px] border-[#888888] bg-white text-[#888888] ">
																				{item?.status}
																			</Typography>
																		</Box>
																	</Box>
																	<Box className="flex items-center sm:mb-8 mb-4">
																		<Typography className="text-16 mr-8 font-light sm:text-20 text-[#222222]">
																			{item?.start_date}
																		</Typography>
																		<Typography className="text-16 sm:text-20 font-light text-[#222222]">
																			{item?.start_time} ~ {item?.end_time}
																		</Typography>
																	</Box>
																	<Box>
																		<Typography className="text-14 sm:text-20 sm:text_truncate_2 text_truncate_1 sm:leading-[160%] leading-[140%] text-[#222222]">
																			{item?.facility?.introduction}
																		</Typography>
																	</Box>
																</Box>
															</Box>
														</Link>
													</Box>
												)
											} else {
												return (
													<Box
														key={index}
														className="sm:border border-b-1 border-[#E0E0E0] px-16 sm:mb-16 mb-0 sm:rounded sm:h-[206px] h-[96px] w-full sm:p-[16px] py-8"
													>
														<Link
															to={`${ROUTER_SOCIAL.event.history_detail}/?history_id=${item?.id}`}
														>
															<Box className="flex h-full">
																<Box className="sm:min-w-[261px] min-w-[80px] sm:max-w-[261px] max-w-[80px] object-cover sm:mr-16 mr-[8px]">
																	<Image
																		src={
																			item?.facility?.main_image?.image_url ??
																			imagefail
																		}
																		className="w-full max-h-full"
																	/>
																</Box>
																<Box className="w-full sm:pt-[13px] sm:mb-8 mb-4">
																	<Box className="flex">
																		<img
																			src={iconHistory}
																			className="h-20 mr-6 sm:mt-6 mt-2"
																		/>
																		<Box className="flex justify-between items-start w-full">
																			<Typography className="text_truncate_1 font-semibold sm:leading-[160%] leading-[140%] text-16 sm:text-20 text-[#222222]">
																				{item?.facility?.name}
																			</Typography>
																			<Typography className="text-14 min-w-max items-end text-center sm:text-20 sm:leading-[160%] leading-[140%] font-light sm:py-[4px] py-[3px] sm:px-[36px] px-16 rounded-[20px] bg-[#888888] text-white ">
																				{item?.status}
																			</Typography>
																		</Box>
																	</Box>
																	<Box className="flex items-center sm:mb-8 mb-4">
																		<Typography className="text-16 mr-8 font-light sm:text-20 text-[#222222]">
																			{item?.start_date}
																		</Typography>
																		<Typography className="text-16 sm:text-20 font-light text-[#222222]">
																			{item?.start_time} ~ {item?.end_time}
																		</Typography>
																	</Box>
																	<Box>
																		<Typography className="text-14 sm:text-20 sm:text_truncate_2 text_truncate_1 sm:leading-[160%] leading-[140%] text-[#222222]">
																			{item?.facility?.introduction}
																		</Typography>
																	</Box>
																</Box>
															</Box>
														</Link>
													</Box>
												)
											}
										})}
									</>
								) : (
									<Typography className="text-center text-[#222222] sm:leading-[160%] leading-[140%] sm:text-20 text-16">予約・利用した施設が表示されます。</Typography>
								)}
							</>
						</>
					)}
					{!loading && listHistory?.max_page > 0 ? (
						<Box className="sm:mt-40 mt-56 sm:px-0 px-16 sm:mb-56 mb-24 flex justify-center">
							{Math.ceil(listHistory?.total / listHistory?.per_page) > 1 ? (
								<Pagination
									count={Math.ceil(listHistory?.total / listHistory?.per_page)}
									siblingCount={0}
									size="large"
									page={pageApi}
									color="primary"
									onChange={(_, value) => setPageApi(value)}
									sx={{
										'@media screen and (min-width: 600px)': {
											'.MuiPagination-ul': {
												gap: '16px'
											},
											'.MuiPaginationItem-root': {
												fontSize: '20px',
												fontWeight: 300,
												color: '#00A0E9',
												lineHeight: '160%',
												margin: '0px',
												padding: '0px'
											},
											'.MuiPaginationItem-icon': {
												color: '#00A0E9'
											},
											'.MuiPaginationItem-root.Mui-selected ': {
												fontWeight: 600,
												fontSize: '20px',
												color: '#00A0E9',
												lineHeight: '160%',
												backgroundColor: '#ffffff !important'
											},
											'li:first-child': {
												marginRight: '54px'
											},
											'li:last-child': {
												marginLeft: '54px'
											}
										},
										'@media screen and (max-width: 600px)': {
											width: '100%',
											'.MuiPagination-ul': {
												justifyContent: 'center',
												gap: '8px'
											},
											'.MuiPaginationItem-root': {
												fontSize: '16px',
												fontWeight: 300,
												color: '#00A0E9',
												lineHeight: '140%',
												margin: '0px',
												padding: '0px'
											},
											'.MuiPaginationItem-icon': {
												color: '#00A0E9'
											},
											'.MuiPaginationItem-root.Mui-selected ': {
												fontWeight: 600,
												fontSize: '16px',
												color: '#00A0E9',
												lineHeight: '140%',
												backgroundColor: '#ffffff !important'
											},
											'.MuiPaginationItem-root.MuiPaginationItem-previousNext': {
												minWidth: '24px'
											},
											'li:first-child': {
												marginRight: 'auto'
											},
											'li:last-child': {
												marginLeft: 'auto'
											}
										}
									}}
								/>
							) : null}
						</Box>
					) : null}
				</Box>
			}
		/>
	)
}

export default React.memo(ListHistory)

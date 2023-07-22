import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { Box, Button, CircularProgress, Pagination, Typography, useMediaQuery } from '@mui/material'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import Image from 'mui-image'
import React, { useEffect, useState } from 'react'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { Link, useNavigate } from 'react-router-dom'
import { facilityService } from '@App/Social/services/facilityService'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'
import location from '@App/Social/assets/locationMobile.svg'

const ListFavoriteContent = props => {
	const { listFavorite, refresh, loadingFavorite, getFavorite } = props
	const isMobile = useMediaQuery('(max-width:600px)')
	const [pageApi, setPageApi] = useState(1)
	const navigate = useNavigate()

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [pageApi])

	useEffect(() => {
		const params = {
			per_page: 15,
			page: pageApi
		}
		getFavorite(params)
	}, [pageApi])

	const handleUnLikeFacility = async favorite_id => {
		await facilityService.unFavorite(favorite_id)
		refresh()
	}

	return (
		<EventContentPage
			maxWidth={1000}
			content={
				<Box className="flex flex-col">
					{loadingFavorite ? (
						<div className="my-40 min-h-[50vh] flex justify-center items-center">
							<CircularProgress />
						</div>
					) : (
						<>
							<Typography className="text-center sm:text-[32px] sm:mt-[74px] mt-[32px] text-[22px] sm:mb-[56px] mb-24 text-[#000000] font-semibold">
								お気に入り
							</Typography>
							<>
								{listFavorite?.facility?.length > 0 ? (
									<>
										{listFavorite?.facility?.map((item, index) => (
											<Box
												key={index}
												className="sm:border border-b-1 border-[#E0E0E0] px-16 sm:mb-16 mb-0 sm:rounded sm:h-[206px] h-[96px] w-full sm:p-[16px] py-8"
											>
												<Box className="flex h-full">
													<Box className="sm:min-w-[261px] min-w-[120px] sm:max-w-[261px] max-w-[80px] object-cover sm:mr-16 mr-[8px]">
														<Link
															to={`${ROUTER_SOCIAL.event.detail}/?facility_id=${item?.id}`}
														>
															<Image
																src={item?.main_image?.image_url ?? imagefail}
																className="w-full max-h-full"
															/>
														</Link>
													</Box>
													<Box className="w-full sm:pt-[31px]">
														<Link
															to={`${ROUTER_SOCIAL.event.detail}/?facility_id=${item?.id}`}
														>
															<Typography className="text_truncate_2 font-semibold leading-[140%] text-16 sm:text-[26px] text-[#222222] sm:mb-8 mb-3">
																{item?.name}
															</Typography>
															<Box className="flex items-center sm:pb-[31px] mb-[7px]">
																{item?.nearby_station ? (
																	<img
																		src={location}
																		className="mt-4 mb-2 ml-[5px] mr-[9px] w-auto sm:h-[26px]"
																	/>
																) : null}
																<Typography className="text-16  sm:text-20 text-[#222222] text_truncate_1 sm:leading-[160%] leading-[140%] ">
																	{item?.nearby_station}
																</Typography>
															</Box>
														</Link>
													</Box>
													<Box className=" sm:pt-[31px]">
														<StarOutlinedIcon
															className="cursor-pointer"
															fontSize={isMobile ? 'medium' : 'large'}
															onClick={() => handleUnLikeFacility(item?.favorite_id)}
															sx={{ color: '#FFA800' }}
														/>
													</Box>
												</Box>
											</Box>
										))}
									</>
								) : isMobile ? (
									<Box className="text-center items-center sm:px-0 px-16">
										<Typography className="text-cente sm:mb-[56px] mb-[32px] text-[#222222] sm:leading-[160%] leading-[140%] sm:text-20 text-16">
											お気に入り登録した施設が表示されます。
											<br />
											施設を検索してお気に入りの施設を探しましょう！
										</Typography>
										<Button
											variant="contained"
											color="primary"
											className="sm:w-[40%] w-full sm:py-12 py-[17px] sm:text-[20px] sm:leading-[160%] leading-[140%] text-[16px] font-semibold text-white rounded-4"
											onClick={() => navigate(ROUTER_SOCIAL.event.search)}
										>
											施設を検索する
										</Button>
									</Box>
								) : (
									<Box className="text-center items-center sm:px-0 px-16">
										<Typography className="text-center text-[#222222] sm:mb-[56px] mb-[32px] sm:leading-[160%] leading-[140%] sm:text-20 text-16">
											お気に入り登録した施設が表示されます。
										</Typography>
										<Button
											variant="contained"
											color="primary"
											className="sm:w-[40%] w-fuls sm:py-12 py-[17px] sm:text-[20px] shadow-none sm:leading-[160%] leading-[140%] text-[16px] font-semibold text-white rounded-4"
											onClick={() => navigate(ROUTER_SOCIAL.event.search)}
										>
											施設を検索する
										</Button>
									</Box>
								)}
							</>
						</>
					)}
					{!loadingFavorite && listFavorite?.facility?.length > 0 ? (
						<Box className="sm:mt-40 mt-56 sm:mb-56 sm:px-0 px-16 mb-24 flex justify-center">
							{Math.ceil(listFavorite?.total / listFavorite?.per_page) > 1 ? (
								<Pagination
									count={Math.ceil(listFavorite?.total / listFavorite?.per_page)}
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

export default React.memo(ListFavoriteContent)

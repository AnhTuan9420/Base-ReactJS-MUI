import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Chip, CircularProgress, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import Image from 'mui-image'
import { get } from 'lodash'
import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { useFacilityDetail } from './hooks/useEventDetail'
import './EventDetail.css'
import FacilityFeeItem from './components/FacilityFeeItem'
import { useImageModal } from './hooks/useImageModal'
import FacilityImageSlide from './components/FacilityImageSlide'
import { getSocialUser } from '@Core/helper/Session'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate } from 'react-router-dom'
import { useEntryDialog } from './hooks/useEntryDialog'
import { useRentalPlan } from './hooks/useRentalPlanDialog'
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { useCheckLoginDialog } from './hooks/useCheckLoginDialog'
import { facilityService } from '@App/Social/services/facilityService'
import { useRequest } from 'ahooks'
import locationMobile from '@App/Social/assets/locationMobile.svg'
import access from '@App/Social/assets/access.svg'
import discount from '@App/Social/assets/discount.svg'
import fee from '@App/Social/assets/fee.svg'
import holiday from '@App/Social/assets/holiday.svg'
import introduction from '@App/Social/assets/introduction.svg'
import facility_type from '@App/Social/assets/facility_type.svg'
import option_item from '@App/Social/assets/option_item.svg'
import seating from '@App/Social/assets/seating.svg'
import tag from '@App/Social/assets/tag.svg'
import time from '@App/Social/assets/time.svg'
import station from '@App/Social/assets/station.svg'
import iconHistory from '@App/Social/assets/iconHistory.svg'
import warning from '@App/Social/assets/warning.svg'
import unlike from '@App/Social/assets/unlike.svg'
import like from '@App/Social/assets/like.svg'
import homepage from '@App/Social/assets/homepage.svg'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'

const getUrlMap = google_map_url => {
	const urlStartIndex = google_map_url?.indexOf('src="') + 5
	const urlEndIndex = google_map_url?.indexOf('"', urlStartIndex)
	const url = google_map_url?.substring(urlStartIndex, urlEndIndex)
	return url
}

const DetailEvent = props => {
	const { handleOpen, renderEntryDialog, initDate } = useEntryDialog()
	const { facilityDetail, loading, timeBookingDetail } = useFacilityDetail(initDate)
	const { rentalPlan, loadingRentalPlan } = useRentalPlan()
	const { onOpen, render } = useImageModal()
	const { handleOpenDialog, renderCheckLoginDialog } = useCheckLoginDialog()
	const user = getSocialUser()
	const isMobile = useMediaQuery('(max-width:600px)')
	const navigate = useNavigate()

	const { data: apiFavorite, run: getFavorite } = useRequest(facilityService.isFavorite, {
		manual: true
	})

	const [isFavorited, setIsFavorited] = useState(false)

	useEffect(() => {
		if (facilityDetail?.id) {
			getFavorite(facilityDetail?.id)
		}
	}, [facilityDetail?.id, isFavorited])

	useEffect(() => {
		if (apiFavorite?.id) {
			setIsFavorited(true)
		}
	}, [apiFavorite?.id])

	const handleLikeFacility = async () => {
		const dataSubmit = {
			facility_id: facilityDetail?.id
		}
		await facilityService.favorite(dataSubmit)
		setIsFavorited(true)
	}

	const handleUnLikeFacility = async () => {
		await facilityService.unFavorite(apiFavorite?.id)
		setIsFavorited(false)
	}

	const handleEntry = () => {
		handleOpen(timeBookingDetail)
	}

	const handleCheckLogin = () => {
		handleOpenDialog()
	}

	const title = {
		1: '平日',
		2: '土曜日',
		3: '日曜日',
		4: '祝日'
	}

	const titleRegularHoliday = {
		0: 'なし',
		1: '月曜日',
		2: '火曜日',
		3: '水曜日',
		4: '木曜日',
		5: '金曜日',
		6: '土曜日',
		7: '日曜日'
	}
	const handleGetRegularHoliday = holiday => {
		return titleRegularHoliday[holiday]
	}

	const handleGetDiscount = discount => {
		if (get(discount, 'hour')) {
			return `${title[discount?.day_of_the_week_id]}${discount?.hour}時間以上の利用で${discount?.discount
				?.toLocaleString()
				?.replace('.', ',')}%の割引`
		}
		return `${title[discount?.day_of_the_week_id]}1日利用で¥${discount?.discount
			?.toLocaleString()
			?.replace('.', ',')}の割引`
	}

	const dataDiscount = useMemo(() => {
		if (facilityDetail?.discount_plans?.discount_by_day && facilityDetail?.discount_plans?.discount_by_hour) {
			return facilityDetail?.discount_plans?.discount_by_day?.concat(
				facilityDetail?.discount_plans?.discount_by_hour
			)
		}
		if (facilityDetail?.discount_plans?.discount_by_day) {
			return facilityDetail?.discount_plans?.discount_by_day
		}
		if (facilityDetail?.discount_plans?.discount_by_hour) {
			return facilityDetail?.discount_plans?.discount_by_hour
		}
	}, [facilityDetail?.discount_plans?.discount_by_day, facilityDetail?.discount_plans?.discount_by_hour])

	const mainImage = []
	mainImage?.push(facilityDetail?.image?.main)
	const totalImage = mainImage?.concat(facilityDetail?.image?.sub)

	return (
		<EventContentPage
			maxWidth={1128}
			hasBreadcrumb={false}
			content={
				<Box className="sm:pt-[56px] sm:pb-[56px] pb-[80px] w-full">
					{loading ? (
						<div className="my-40 min-h-[50vh] flex justify-center items-center">
							<CircularProgress />
						</div>
					) : (
						<>
							{isMobile ? (
								<FacilityImageSlide data={totalImage} />
							) : (
								<Box className="flex flex-wrap sm:flex-nowrap gap-8">
									<Box className="w-full sm:w-[880px] max-h-[485px]">
										<Image src={facilityDetail?.image?.main?.image_url ?? imagefail} />
									</Box>
									<Box className="w-full sm:w-[240px]">
										<Stack spacing={1}>
											{facilityDetail?.image?.sub
												?.filter((_, index) => index < 3)
												?.map(image => (
													<Image src={image?.image_url ?? imagefail} height={135} />
												))}
											{facilityDetail?.image?.sub && facilityDetail?.image?.sub?.length > 0 ? (
												<Button
													variant="outlined"
													onClick={onOpen}
													className="sm:w-[240px] h-56 w-full sm:py-12 px-0 text-20 text-[#00A0E9] font-semibold border-solid border-1 sm:leading-[160%] shadow-none"
												>
													他の写真を見る
												</Button>
											) : null}
										</Stack>
									</Box>
								</Box>
							)}
							<Box className="">
								<Typography className="mt-[24px] sm:px-0 px-16 sm:mb-[40px] mb-0 text-[#222222] sm:text-32 text-16 leading-[140%] break-all font-semibold">
									{facilityDetail?.name}
								</Typography>

								<Box className="flex items-start sm:flex-nowrap flex-wrap gap-10">
									<Box className="w-full sm:w-8/12">
										<Box className="">
											<Typography className="text-[#222222] text-[26px] font-semibold leading-[140%] sm:block hidden">
												施設概要
											</Typography>

											<Box className="sm:flex sm:mt-[30px] sm:p-0 p-16 sm:items-start">
												<Box className="flex sm:mb-0 mb-8 sm:mt-6">
													<Box className="w-32 sm:mt-0 mt-2">
														<img src={locationMobile} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														住所
													</Typography>
												</Box>
												<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.address_line1
														? facilityDetail?.address_line1
														: 'アップデート中です'}
												</Typography>
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-start">
												<Box className="flex sm:mb-0 mb-8 sm:mt-6">
													<Box className="w-32 sm:mt-0 mt-2">
														<img src={station} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														最寄駅
													</Typography>
												</Box>
												<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.nearby_station
														? facilityDetail?.nearby_station
														: 'アップデート中です'}
												</Typography>
											</Box>
											<Divider className="sm:hidden block px-0 mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-center">
												<Box className="flex sm:mb-0 mb-8">
													<Box className="w-32">
														<img src={seating} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														収容人数
													</Typography>
												</Box>
												{facilityDetail?.capacity ? (
													<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														{facilityDetail?.capacity}名
													</Typography>
												) : (
													<Typography className="break-all sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														アップデート中です
													</Typography>
												)}
											</Box>
											<Divider className="sm:hidden block px-0 mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-start">
												<Box className="flex sm:mb-0 mb-8 sm:mt-6">
													<Box className="w-32">
														<img src={iconHistory} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														最低利用時間
													</Typography>
												</Box>
												{facilityDetail?.minimum_usage_time ? (
													<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														{facilityDetail?.minimum_usage_time}時間から利用可能
													</Typography>
												) : (
													<Typography className="break-all sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														アップデート中です
													</Typography>
												)}
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-center">
												<Box className="flex sm:mb-0 mb-8">
													<Box className="w-32">
														<img src={time} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														営業時間
													</Typography>
												</Box>
												<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.opening_time
														? facilityDetail?.opening_time
														: 'アップデート中です'}{' '}
													~{' '}
													{facilityDetail?.closing_time
														? facilityDetail?.closing_time
														: 'アップデート中です'}
												</Typography>
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-center">
												<Box className="flex sm:mb-0 mb-8">
													<Box className="w-32">
														<img src={holiday} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														定休日
													</Typography>
												</Box>
												{facilityDetail?.regular_holiday?.length > 0 ? (
													<Box className="flex flex-wrap">
														{facilityDetail?.regular_holiday?.map((item, index, arr) => {
															return (
																<Typography
																	key={index}
																	className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light"
																>
																	{handleGetRegularHoliday(item)}
																	{!(arr.length - 1 === index) && '、'}
																</Typography>
															)
														})}
													</Box>
												) : (
													<Typography className="break-all sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														アップデート中です
													</Typography>
												)}
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-start">
												<Box className="flex sm:mb-0 mb-8 sm:mt-6">
													<Box className="w-32">
														<img src={facility_type} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														施設タイプ
													</Typography>
												</Box>
												<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.facility_type
														? facilityDetail?.facility_type
														: 'アップデート中です'}
												</Typography>
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-start">
												<Box className="flex sm:mb-0 mb-8 sm:mt-6">
													<Box className="w-32 ">
														<img src={homepage} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														ホームページ
													</Typography>
												</Box>
												{facilityDetail?.facility_url ? (
													<a href={facilityDetail?.facility_url} target="_blank">
														<Typography className="cursor-pointer break-all underline sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
															{facilityDetail?.facility_url}
														</Typography>
													</a>
												) : (
													<Typography className="break-all sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														アップデート中です
													</Typography>
												)}
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:flex sm:mt-16 sm:p-0 p-16 sm:items-start">
												<Box
													className={
														facilityDetail?.tags?.length > 1
															? 'flex sm:mb-0 mb-8 sm:mt-4'
															: 'flex sm:mb-0 mb-8 sm:mt-6'
													}
												>
													<Box className="w-32">
														<img src={tag} />
													</Box>
													<Typography className="min-w-128 sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														タグ
													</Typography>
												</Box>
												{facilityDetail?.tags?.length > 0 ? (
													<Box className="flex items-center gap-x-[8px] flex-wrap ">
														{facilityDetail?.tags?.map((tag, index) => (
															<Chip
																label={`#${tag?.name}`}
																variant="filled"
																color="primary"
																className="mb-8 bg-[#FFFFFF] text-[#00A0E9] text-[16px] border-solid border-[1px]"
																key={index}
															/>
														))}
													</Box>
												) : (
													<Typography className="break-all sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
														アップデート中です
													</Typography>
												)}
											</Box>
											<Divider className="sm:hidden block mb-8" />
										</Box>

										<Box className="sm:mt-40">
											<Typography className="text-[#222222] mb-26 text-[26px] font-semibold leading-[140%] sm:block hidden">
												詳細情報
											</Typography>

											<Box className="sm:mt-[26px] sm:p-0 p-16">
												<Box className="flex">
													<Box className="w-32">
														<img src={introduction} />
													</Box>
													<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														{isMobile ? '施設紹介' : '施設の紹介'}
													</Typography>
												</Box>
												<Typography className="sm:mt-[18px] mt-[9px] sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.introduction
														? facilityDetail?.introduction?.split('\n').map(text => (
																<>
																	{text}
																	<br />{' '}
																</>
														  ))
														: 'アップデート中です'}
												</Typography>
											</Box>
											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:mt-[26px] sm:px-0 px-16 sm:pt-0 pt-16">
												<Box className="flex">
													<Box className="w-32">
														<img src={access} />
													</Box>
													<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														アクセス
													</Typography>
												</Box>
												<Typography className="sm:mt-[18px] mt-[9px] sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.access
														? facilityDetail?.access?.split('\n').map(text => (
																<>
																	{text}
																	<br />{' '}
																</>
														  ))
														: 'アップデート中です'}
												</Typography>
											</Box>

											{facilityDetail?.google_map_url?.includes('https://www.google.com/maps') ? (
												<>
													<Box className="sm:mt-16 mt-8 sm:px-0 px-16 sm:pb-0 pb-16">
														<iframe
															src={getUrlMap(facilityDetail?.google_map_url)}
															height={isMobile ? '201' : '420'}
															style={{ border: 0, width: '100%' }}
															allowFullScreen=""
															loading="lazy"
															referrerPolicy="no-referrer-when-downgrade"
														></iframe>
													</Box>
												</>
											) : null}

											<Divider className="sm:hidden block mb-8" />

											<Box className="sm:mt-[26px] sm:p-0 p-16">
												<Box className="flex sm:mb-0 mb-8">
													<Box className="w-32">
														<img src={warning} />
													</Box>
													<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														注意事項
													</Typography>
												</Box>
												<Typography className="sm:mt-[18px] mt-[9px] sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-light">
													{facilityDetail?.considerations
														? facilityDetail?.considerations?.split('\n').map(text => (
																<>
																	{text}
																	<br />{' '}
																</>
														  ))
														: 'アップデート中です'}
												</Typography>
											</Box>
										</Box>
										<Divider className="sm:hidden block mb-8" />

										<Box className="sm:px-0 px-16">
											<Typography className="text-[#222222] sm:mt-24 sm:mb-[26px] mb-[25px] sm:text-[26px] text-16 font-semibold leading-[140%]">
												料金プラン
											</Typography>
											<Box className="">
												<Box className="flex">
													<Box className="w-32">
														<img src={fee} />
													</Box>
													<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
														利用料金
													</Typography>
												</Box>

												<Box className="flex sm:mt-[18px] mt-[17px]">
													<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[20%] py-16 pl-8"></Box>
													<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[40%] py-16 pl-8">
														<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
															時間帯
														</Typography>
													</Box>
													<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[40%] py-16 pl-8">
														<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
															時間単価
														</Typography>
													</Box>
												</Box>
												{loadingRentalPlan ? (
													<div className="mt-40 text-center">
														<CircularProgress />
													</div>
												) : (
													<>
														{rentalPlan?.workingday?.length > 0 ? (
															<FacilityFeeItem
																data={rentalPlan?.workingday}
																label="平日"
															/>
														) : null}
														{rentalPlan?.saturday?.length > 0 ? (
															<FacilityFeeItem
																data={rentalPlan?.saturday}
																label="土曜日"
															/>
														) : null}
														{rentalPlan?.saturday?.length > 0 ? (
															<FacilityFeeItem data={rentalPlan?.sunday} label="日曜日" />
														) : null}
														{rentalPlan?.saturday?.length > 0 ? (
															<FacilityFeeItem data={rentalPlan?.holiday} label="祝日" />
														) : null}
													</>
												)}
											</Box>

											{dataDiscount?.length > 0 && (
												<Box className="sm:mt-[26px] mt-[25px]">
													<Box className="flex">
														<Box className="w-32">
															<img src={discount} />
														</Box>
														<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
															割引プラン
														</Typography>
													</Box>
													<Box className="flex sm:mt-[18px] mt-[17px]">
														<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[20%] py-16 pl-8"></Box>
														<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[80%] py-16 pl-8">
															<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																割引内容
															</Typography>
														</Box>
													</Box>
													{dataDiscount?.map((item, index) => (
														<Box className="flex w-full" key={index}>
															<Box className="border-1 border-[#E0E0E0] h-auto w-1/5 py-16 pl-8 bg-[#EFFAFF]">
																<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																	{get(item, 'hour') ? '時間利用' : '1日利用'}
																</Typography>
															</Box>
															<Box className="border-1 border-[#E0E0E0] h-auto w-4/5 py-16 pl-8">
																<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																	{handleGetDiscount(item)}
																</Typography>
															</Box>
														</Box>
													))}
												</Box>
											)}

											{facilityDetail?.option_items?.length > 0 && (
												<Box className="sm:mt-[26px] mt-[25px]">
													<Box className="flex">
														<Box className="w-32">
															<img src={option_item} />
														</Box>
														<Typography className="sm:text-20 text-16 text-[#222222] sm:leading-[100%] leading-[140%] font-semibold">
															オプションアイテム
														</Typography>
													</Box>
													<Box className="flex sm:mt-[18px] mt-[17px]">
														<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto sm:w-1/2 w-[60%] py-16 pl-8">
															<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																項目
															</Typography>
														</Box>
														<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto sm:w-1/2 w-[40%] py-16 pl-8">
															<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																単価
															</Typography>
														</Box>
													</Box>
													{facilityDetail?.option_items?.map((item, index) => (
														<Box className="flex w-full" key={index}>
															<Box className="border-1 border-[#E0E0E0] h-auto sm:w-1/2 w-[60%] py-16 pl-8">
																<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																	{item?.name}
																</Typography>
															</Box>
															<Box className="border-1 border-[#E0E0E0] h-auto sm:w-1/2 w-[40%] py-16 pl-8">
																<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
																	¥{item?.price?.toLocaleString()?.replace('.', ',')}
																</Typography>
															</Box>
														</Box>
													))}
												</Box>
											)}
										</Box>
									</Box>

									<Box className="w-full sm:w-4/12">
										<Box className="border-1 border-[#E0E0E0] py-[24px] sm:block hidden lg:px-0 sm:px-16">
											<Typography className="text-20 text-center text-[#222222] leading-[100%] font-semibold">
												利用料金（税込）
											</Typography>
											<Typography className="text-[#222222] text-center mt-16 text-14 leading-[140%] font-light">
												(税込み・最低1時間から利用可能)
											</Typography>
											<Box className="flex justify-center items-center mt-16 break-all">
												{facilityDetail?.price?.min === facilityDetail?.price?.max ? (
													<Typography className="text-[#222222] text-[26px] font-semibold leading-[140%]">
														¥
														{facilityDetail?.price?.min
															?.toLocaleString()
															?.replace('.', ',') || 0}
													</Typography>
												) : (
													<Typography className="text-[#222222] text-[26px] font-semibold leading-[140%]">
														¥
														{facilityDetail?.price?.min
															?.toLocaleString()
															?.replace('.', ',') || 0}
														〜¥
														{facilityDetail?.price?.max
															?.toLocaleString()
															?.replace('.', ',') || 0}
													</Typography>
												)}
												<Typography className="text-20 leading-[160%] font-light text-[#222222] ml-4">
													/時間
												</Typography>
											</Box>
											{user ? (
												<Box className="flex justify-center mt-16">
													<Button
														color="primary"
														variant="contained"
														className="lg:w-[280px] sm:w-[180px] text-20 font-semibold shadow-none leading-[160%] py-12 px-0"
														onClick={handleEntry}
													>
														空室を確認して予約する
													</Button>
												</Box>
											) : (
												<Box className="flex justify-center mt-16">
													<Button
														color="primary"
														variant="contained"
														className="lg:w-[280px] sm:w-[180px] text-20 font-semibold shadow-none leading-[160%] py-12 px-0"
														onClick={handleCheckLogin}
													>
														空室を確認して予約する
													</Button>
												</Box>
											)}
										</Box>

										<Box className="sm:mt-20 w-full lg:w-[280px] sm:w-[180px] mx-auto sm:px-0 px-16">
											{user ? (
												isFavorited ? (
													<Button
														color="primary"
														variant="contained"
														fullWidth
														className="sm:py-12 px-0 text-[#00A0E9] h-56 bg-white border-solid border-1 shadow-none mb-20 sm:block hidden"
														onClick={handleUnLikeFacility}
													>
														<Typography className="flex justify-center text-20 font-semibold leading-[160%]">
															<img src={like} className="h-20 self-center mr-6" />
															お気に入り済み
														</Typography>
													</Button>
												) : (
													<Button
														color="primary"
														variant="contained"
														fullWidth
														className="sm:py-12 px-0 text-[#00A0E9] h-56 bg-white border-solid border-1 shadow-none mb-20 sm:block hidden"
														onClick={handleLikeFacility}
													>
														<Typography className="flex justify-center px-0 text-20 font-semibold leading-[160%]">
															<img src={unlike} className="h-20 self-center mr-6" />
															お気に入りする
														</Typography>
													</Button>
												)
											) : (
												<Button
													color="primary"
													variant="contained"
													size="large"
													fullWidth
													className="sm:py-12 px-0 text-[#00A0E9] h-56 bg-white border-solid border-1 shadow-none mb-20 sm:block hidden"
													onClick={handleCheckLogin}
												>
													<Typography className="flex justify-center px-0 text-20 font-semibold leading-[160%]">
														<img src={unlike} className="h-20 self-center mr-6" />
														お気に入りする
													</Typography>
												</Button>
											)}

											<Button
												color="primary"
												variant="contained"
												size="large"
												fullWidth
												className="sm:mt-0 mt-[24px] sm:py-12 px-0 text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%] h-56 bg-white border-solid border-1 shadow-none"
												onClick={() =>
													navigate(ROUTER_SOCIAL.inquiry_for_facility, { state: facilityDetail })
												}
											>
												この施設へ問い合わせる
											</Button>
										</Box>
									</Box>

									{isMobile ? (
										<Box className="flex justify-center w-full z-50 fixed bg-white p-16 bottom-0 left-0">
											{user ? (
												<>
													{isFavorited ? (
														<Box
															className="w-[40%] text-center cursor-pointer"
															onClick={handleUnLikeFacility}
														>
															<StarOutlinedIcon sx={{ color: '#f2a60b' }} />
															<Typography className="text-14 font-normal text-[#888888]">
																お気に入り済み
															</Typography>
														</Box>
													) : (
														<Box
															className="w-[40%] text-center cursor-pointer"
															onClick={handleLikeFacility}
														>
															<StarOutlineOutlinedIcon sx={{ color: '#888888' }} />
															<Typography className="text-14 font-bold text-[#888888]">
																お気に入り
															</Typography>
														</Box>
													)}
													<Box className="w-[60%] text-center">
														<Button
															color="primary"
															variant="contained"
															className="w-full py-[17px] px-[12px] text-16 font-semibold leading-[140%] shadow-none"
															onClick={handleEntry}
														>
															{isFavorited ? 'WEBで予約する' : '空室を確認して予約する'}
														</Button>
													</Box>
												</>
											) : (
												<>
													<Box
														className="w-[40%] text-center cursor-pointer"
														onClick={handleCheckLogin}
													>
														<StarOutlineOutlinedIcon sx={{ color: '#888888' }} />
														<Typography className="text-14 font-bold text-[#888888]">
															お気に入り
														</Typography>
													</Box>
													<Box className="w-[60%] text-center">
														<Button
															color="primary"
															variant="contained"
															className="w-full py-[17px] px-[12px] text-16 font-semibold leading-[140%] shadow-none"
															onClick={handleCheckLogin}
														>
															空室を確認して予約する
														</Button>
													</Box>
												</>
											)}
										</Box>
									) : null}
								</Box>
							</Box>
						</>
					)}
					{render(facilityDetail?.image?.sub)}
					{renderEntryDialog(facilityDetail, timeBookingDetail)}
					{renderCheckLoginDialog()}
				</Box>
			}
		/>
	)
}

export default React.memo(DetailEvent)

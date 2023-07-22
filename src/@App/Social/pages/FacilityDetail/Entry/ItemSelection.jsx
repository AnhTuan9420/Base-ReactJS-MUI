import React, { useEffect, useState } from 'react'
import { Box, Button, Card, Checkbox, CircularProgress, Step, StepLabel, Stepper, Typography } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Image from 'mui-image'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { Controller, useForm } from 'react-hook-form'
import { useEntryDialog } from '../hooks/useEntryDialog'
import { facilityService } from '@App/Social/services/facilityService'
import { useRequest } from 'ahooks'
import { SESSION_STORAGE, getDataSession, removeDataSession, setDataSession } from '@Core/helper/Session'
import { errorMsg } from '@Core/helper/Message'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'

const styles = {
	heading: {
		// fontFamily: 'Noto Sans JP',
		// fontSize: '22px',
		// marginBottom: '24px'
	},
	label: {
		// fontFamily: 'Noto Sans JP',
		fontSize: '16px',
		fontWeight: 700
	},
	card: {
		boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)'
	}
}

const steps = ['オプションアイテム選択', '利用者情報入力', '利用料金の確認', '支払い', '予約完了']

function convertTo24HourFormat(time) {
	if (time === '00:00') {
		return '24:00'
	} else {
		return time
	}
}

const ItemSelection = () => {
	const navigate = useNavigate()
	let [searchParams] = useSearchParams()

	const id = searchParams.get('facility_id')

	const { handleOpen, renderEntryDialog, initDate, dateAfterChangeDate } = useEntryDialog()
	const [dataBooking, setDataBooking] = useState(getDataSession(SESSION_STORAGE, 'dataBooking'))

	const startDate = getDataSession(SESSION_STORAGE, 'start')
	const endDate = getDataSession(SESSION_STORAGE, 'end')
	const item_id = getDataSession(SESSION_STORAGE, `item_id_facility_id=${id}`)

	const {
		data: facilityDetail,
		run: getFacilityDetail,
		loading
	} = useRequest(facilityService.facilityDetail, {
		manual: true
	})

	const { data: timeBookingDetail, run: getTimeBookingDetail } = useRequest(facilityService.timeBookingFacility, {
		manual: true
	})

	useEffect(() => {
		if (id && initDate) {
			getTimeBookingDetail(id, initDate)
		}
	}, [id, initDate])

	useEffect(() => {
		if (id) {
			getFacilityDetail(id)
		}
	}, [])

	const handleEntry = () => {
		handleOpen()
	}

	const { control, watch } = useForm({
		mode: 'onTouched',
		defaultValues: {
			option_item_ids: item_id ?? []
		}
	})

	useEffect(() => {
		const optionItemId = watch('option_item_ids')
		const handleSubmit = async () => {
			try {
				const dataSubmit = {
					facility_id: id,
					opening_date: startDate,
					closing_date: endDate,
					option_item_ids: optionItemId
				}
				if (startDate && endDate) {
					const data = await facilityService.booking(dataSubmit)
					setDataBooking(data)
					setDataSession(SESSION_STORAGE, 'dataBooking', data)
					setDataSession(SESSION_STORAGE, `item_id_facility_id=${id}`, optionItemId)
				}
			} catch (error) {
				errorMsg(error)
			}
		}
		handleSubmit()
	}, [watch('option_item_ids')])

	useEffect(() => {
		if (dateAfterChangeDate) {
			setDataBooking(dateAfterChangeDate)
		}
	}, [dateAfterChangeDate])

	function QontoStepIcon(props) {
		const { active, className } = props

		return (
			<Box ownerState={{ active }} className={className}>
				{active ? (
					<div className="w-[16px] h-[16px] bg-[#00A0E9] mt-2 rounded-[50%]" />
				) : (
					<div className="w-[16px] h-[16px] bg-[#888888] mt-2 rounded-[50%]" />
				)}
			</Box>
		)
	}

	return (
		<EventContentPage
			maxWidth={1000}
			hasBreadcrumb={false}
			content={
				<Box className="mb-40 sm:mt-24 mt-16 px-16 sm:px-0">
					<Box className="sm:mb-[72px] mb-[32px]">
						<Box sx={{ width: '100%' }}>
							<Stepper activeStep={0} alternativeLabel>
								{steps.map(label => (
									<Step key={label}>
										<StepLabel
											sx={{
												'@media screen and (min-width: 600px)': {
													'.css-1dc13n0-MuiStepIcon-text': {
														display: 'none'
													},
													'.MuiStepLabel-label.Mui-active': {
														color: '#00A0E9 !important',
														fontSize: '16px',
														fontWeight: '600 !important',
														lineHeight: '140%',
														marginTop: '16px !important'
													},
													'.MuiStepLabel-label': {
														color: '#888888 !important',
														fontSize: '16px',
														fontWeight: '300 !important',
														lineHeight: '140%',
														marginTop: '16px !important'
													}
												},
												'@media screen and (max-width: 600px)': {
													'.css-1dc13n0-MuiStepIcon-text': {
														display: 'none'
													},
													'.MuiStepLabel-label.Mui-active': {
														color: '#00A0E9 !important',
														fontSize: '12px',
														fontWeight: '600 !important',
														marginTop: '8px !important',
														lineHeight: '120%'
													},
													'.MuiStepLabel-label': {
														color: '#888888 !important',
														fontSize: '12px',
														fontWeight: '300 !important',
														marginTop: '8px !important',
														lineHeight: '120%'
													}
												}
											}}
											StepIconComponent={QontoStepIcon}
										>
											{label}
										</StepLabel>
									</Step>
								))}
							</Stepper>
						</Box>
					</Box>

					<Typography className="bg-[#EFFAFF] text-[#222222] text-[20px] leading-[160%] font-light sm:block hidden p-24 my-56">
						予約手続きを開始します。
					</Typography>

					<Typography
						className="text-center text-[#222222] sm:text-[32px] text-[24px] font-semibold sm:mb-[56px] mb-24"
						sx={styles.heading}
					>
						オプションアイテム選択
					</Typography>

					<Typography className="sm:mb-56 mb-24 text-[#222222] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
						追加料金を支払うことで施設のオプションアイテムを利用できます。
						<br />
						利用しない場合はオプションアイテムを選択せずに手続きをすすめてください。
					</Typography>

					<Box className="sm:flex sm:mb-56 mb-24">
						<Box className="sm:w-[50%]">
							<Typography className="sm:mb-24 mb-16 sm:text-[26px] sm:leading-[140%] text-20 font-semibold text-[#222222]">
								この施設のオプションアイテム
							</Typography>
							{loading ? (
								<div className="mt-40 text-center">
									<CircularProgress />
								</div>
							) : facilityDetail?.option_items?.length > 0 ? (
								facilityDetail?.option_items?.map(item => {
									return (
										<Box className="flex mb-16">
											<Controller
												name="option_item_ids"
												control={control}
												render={({ field: { onChange, value } }) => {
													const handleChange = e => {
														if (e.target.checked) {
															onChange([...value, Number(e.target.name)])
														} else {
															const unCheck = value?.filter(item => item != e.target.name)
															onChange([...unCheck])
														}
													}
													return (
														<Checkbox
															onChange={handleChange}
															name={item?.id}
															color="primary"
															checked={value.includes(item?.id)}
															className="p-0 mr-[7px] text-[#00A0E9] self-start sm:mt-[5px] mt-2"
														/>
													)
												}}
											/>
											<Box className="flex justify-between w-full ">
												<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 lg:w-[65%] sm:w-[60%] w-[70%]">
													{item?.name}
												</Typography>
												<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 text-end break-all lg:w-[35%] sm:w-[40%] w-[30%] lg:pr-[56px] sm:pr-[12px]">
													¥{item?.price?.toLocaleString()?.replace('.',',')}
												</Typography>
											</Box>
										</Box>
									)
								})
							) : (
								<Typography className="text-[#222222] sm:text-20 sm:mb-0 mb-24 font-light sm:leading-[160%] leading-[140%] text-16 ">
									選べるオプションアイテムがありません。
								</Typography>
							)}
						</Box>

						<Box className="sm:w-[50%]">
							{loading ? (
								<div className="mt-40 text-center">
									<CircularProgress />
								</div>
							) : (
								<a className="cursor-pointer" href={(`${ROUTER_SOCIAL.event.detail}/?facility_id=${facilityDetail?.id}`)} target="_blank">
									<Box
										className="sm:mb-[24px] mb-16 p-16 rounded-[4px] border-1 border-solid border-[#E0E0E0]"
										sx={styles.card}
									>
										<Typography className="sm:mb-8 mb-10 text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
											施設の詳細情報はこちら
										</Typography>
										<Box className="flex h-full">
											<Box className="w-[120px] h-80 mr-8">
												<Image
													src={facilityDetail?.image?.main?.image_url ?? imagefail}
													className="w-full max-h-full"
												/>
											</Box>
											<Box className="sm:w-[340px] w-[198px]">
												<Typography className="text_truncate_2 text-[#222222] text-16 leading-[140%] font-semibold mb-6">
													{facilityDetail?.name}
												</Typography>

												<Typography className="text_truncate_1 self-center text-16 font-light mb-6 leading-[140%] sm:mr-20 text-[#222222]">
													<PlaceOutlinedIcon color="primary" className="p-0 mr-8 ml-2" />
													{facilityDetail?.nearby_station}
												</Typography>
											</Box>
										</Box>
									</Box>
								</a>
							)}

							<Box className="border-1 border-[#E0E0E0] py-8 px-16 rounded-t-[4px] ">
								<Typography className="text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
									利用料金シミュレーション
								</Typography>
							</Box>

							<Box className="border-1 border-t-0 border-[#E0E0E0] w-full py-8 px-16">
								{dataBooking?.rental_plan_price?.map(item => (
									<Box className="flex justify-between mb-8 gap-x-8">
										<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
											{item?.date} {item?.start_time}~{convertTo24HourFormat(item?.end_time)}
										</Typography>
										<Typography className="text-[#222222] text-end sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
											{item?.total_price_rental?.toLocaleString()?.replace('.',',')}円
										</Typography>
									</Box>
								))}
								<Box className="flex justify-between mb-8 gap-x-8">
									<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										割引プラン適用
									</Typography>
									<Typography className="text-[#222222] text-end sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										- {dataBooking?.discount_price?.toLocaleString()?.replace('.',',') || 0}円
									</Typography>
								</Box>
								<Box className="flex justify-between gap-x-8">
									<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										選択中のオプションアイテム {dataBooking?.count_option || 0}件
									</Typography>
									<Typography className="text-[#222222] text-end sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										{dataBooking?.total_option_price?.toLocaleString()?.replace('.',',') || 0}円
									</Typography>
								</Box>
							</Box>

							<Box className="border-1 border-t-0 border-[#E0E0E0] h-auto w-full py-8 px-16 rounded-b-[4px]">
								<Box className="flex justify-between mb-8">
									<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										消費税
									</Typography>
									<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										{dataBooking?.VAT?.toLocaleString()?.replace('.',',') || 0}円
									</Typography>
								</Box>
								<Box className="flex justify-between mb-8">
									<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										小計
									</Typography>
									<Typography className="text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 break-all">
										{dataBooking?.total_price?.toLocaleString()?.replace('.',',') || 0}円
									</Typography>
								</Box>
								<Box className="flex justify-between">
									<Typography className="text-[#222222] sm:text-20 font-semibold sm:leading-[160%] leading-[140%] text-16 break-all">
										合計
									</Typography>
									<Typography className="text-[#222222] sm:text-20 font-semibold sm:leading-[160%] leading-[140%] text-16 break-all">
										{dataBooking?.total_payment?.toLocaleString()?.replace('.',',') || 0}円
									</Typography>
								</Box>
							</Box>
						</Box>
					</Box>

					<Box className="text-center sm:justify-center sm:flex sm:mb-[220px] mb-[100px]">
						<Button
							className="sm:w-[400px] h-56 w-full sm:py-12 px-0 py-[17px] sm:mr-16 sm:mb-0 mb-16 sm:leading-[160%] leading-[140%] sm:text-20 text-[16px] border-solid border-1 font-semibold  text-[#00A0E9] rounded-4"
							onClick={handleEntry}
						>
							利用日時を変更する
						</Button>
						<Button
							variant="contained"
							color="primary"
							className="sm:w-[400px] h-56 w-full sm:py-12 py-[17px] px-0 sm:leading-[160%] shadow-none leading-[140%] sm:text-20 text-[16px] font-semibold text-white rounded-4"
							onClick={() =>
								navigate(`${ROUTER_SOCIAL.entry.enter_information}/?facility_id=${facilityDetail?.id}`)
							}
						>
							利用者様情報入力へ進む
						</Button>
					</Box>
					{renderEntryDialog(facilityDetail, timeBookingDetail, dataBooking, setDataBooking)}
				</Box>
			}
		/>
	)
}

export default React.memo(ItemSelection)

import React, { useEffect, useMemo, useState } from 'react'
import {
	Box,
	Button,
	Card,
	Checkbox,
	CircularProgress,
	Step,
	StepLabel,
	Stepper,
	Typography,
	useMediaQuery
} from '@mui/material'
import calendar from '@App/Social/assets/calendar.svg'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Image from 'mui-image'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import logoHeader from '@App/Social/assets/logoHeader.png'
import { useEntryDialog } from '../hooks/useEntryDialog'
import { facilityService } from '@App/Social/services/facilityService'
import { useRequest } from 'ahooks'
import { Controller, useForm } from 'react-hook-form'
import Yup, { yupResolver } from '@Core/helper/Yup'
import { SESSION_STORAGE, getDataSession, removeDataSession } from '@Core/helper/Session'
import { errorMsg, successMsg } from '@Core/helper/Message'
import InvoicePDF from '../../HistoryDetail/PDF/InvoicePDF'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Check } from '@mui/icons-material'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'
import location from '@App/Social/assets/location.svg'
import locationMobile from '@App/Social/assets/locationMobile.svg'
import { LoadingButton } from '@mui/lab'
import bankName from '@App/Social/assets/bankName.svg'
import bankNameMobile from '@App/Social/assets/bankNameMobile.svg'

const styles = {
	box: {
		fontFamily: 'Noto Sans JP'
	},
	label: {
		// fontFamily: 'Noto Sans JP',
		fontSize: '16px',
		fontWeight: 700
	},
	card: {
		boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)'
	}
}

const steps = ['オプションアイテム選択', '利用者情報入力', '利用料金の確認', '支払い', '予約完了']

var elepay = new Elepay(`${import.meta.env.VITE_ELEPAY_KEY}`)
const FeeConfirm = () => {
	const navigate = useNavigate()
	let [searchParams] = useSearchParams()
	const isMobile = useMediaQuery('(max-width:600px)')

	const id = searchParams.get('facility_id')
	const [resend, setResend] = useState(false)

	const { handleOpen, renderEntryDialog, initDate } = useEntryDialog()

	const startDate = getDataSession(SESSION_STORAGE, 'start')
	const endDate = getDataSession(SESSION_STORAGE, 'end')
	const dataBooking = getDataSession(SESSION_STORAGE, 'dataBooking')
	const item_id = getDataSession(SESSION_STORAGE, `item_id_facility_id=${id}`)

	const {
		data: facilityDetail,
		run: getFacilityDetail,
		loading
	} = useRequest(facilityService.facilityDetail, {
		manual: true
	})

	const dataFacilityDetailSlice = useMemo(() => {
		if (facilityDetail?.tags?.length <= 2) {
			return facilityDetail?.tags
		} else {
			return facilityDetail?.tags?.slice(0, 2)
		}
	}, [facilityDetail])

	const { data: dataInvoicePDF, run: getDataInvoicePDF } = useRequest(facilityService.getInvoiceData, {
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
		if (id && startDate && endDate) {
			const dataSubmit = {
				facility_id: id,
				opening_date: startDate,
				closing_date: endDate,
				option_item_ids: item_id
			}
			getDataInvoicePDF(dataSubmit)
		}
	}, [])

	const handleEntry = () => {
		handleOpen()
	}

	const { control, watch } = useForm({
		mode: 'onTouched',
		defaultValues: {
			check: false,
			check2: false
		},
		resolver: yupResolver(
			Yup.object({
				check: Yup.bool().required()
			})
		)
	})

	const watchCheckBox = watch('check', false)
	const watchCheckBox2 = watch('check2', false)

	const handleSubmit = async () => {
		try {
			setResend(true)
			const dataSubmit = {
				facility_id: parseInt(id),
				opening_date: startDate,
				closing_date: endDate,
				option_item_ids: item_id,
				company_name: dataBooking?.user_booking?.company_name ?? null,
				email: dataBooking?.user_booking?.email,
				door_revo_id: dataBooking?.user_booking?.door_revo_id ?? null,
				name: dataBooking?.user_booking?.name,
				phone_no: dataBooking?.user_booking?.phone_no
			}
			const dataReponse = await facilityService.payment(dataSubmit)
			if (dataReponse && dataReponse?.id && dataReponse?.code_id) {
				elepay.checkout(`${dataReponse?.code_id}`)
			} else if (dataReponse && dataReponse?.id && !dataReponse?.code_id && dataBooking?.total_payment === 0) {
				navigate(ROUTER_SOCIAL.entry.reservation_success, { state: dataReponse?.id })
			}
			removeDataSession(SESSION_STORAGE, 'start')
			removeDataSession(SESSION_STORAGE, 'end')
			removeDataSession(SESSION_STORAGE, 'dataBooking')
			removeDataSession(SESSION_STORAGE, `item_id_facility_id=${id}`)
			successMsg('エントリーが成功しました。')
		} catch (e) {
			errorMsg(e)
		}
	}

	function QontoStepIcon(props) {
		const { active, completed, className } = props
		return (
			<Box ownerState={{ active }} className={className}>
				{completed ? (
					<Check className="text-[25px] text-[#A9E4FF]" />
				) : active ? (
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
				<Box className="sm:mb-[220px] mb-[100px] sm:mt-24 mt-16 px-16 sm:px-0">
					<Box className="sm:mb-[72px] mb-[32px]">
						<Box sx={{ width: '100%' }}>
							<Stepper activeStep={2} alternativeLabel>
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
													},
													'.MuiStepLabel-label.Mui-completed': {
														color: '#A9E4FF !important',
														fontSize: '16px',
														fontWeight: '600 !important',
														lineHeight: '140%'
													},
													'.css-1axef57-MuiSvgIcon-root': {
														height: '16px'
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
													},
													'.MuiStepLabel-label.Mui-completed': {
														color: '#A9E4FF !important',
														fontSize: '12px',
														fontWeight: '600 !important',
														lineHeight: '120%'
													},
													'.css-1axef57-MuiSvgIcon-root': {
														height: '16px'
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

					<Typography
						className="text-center text-[#222222] sm:text-[32px] text-[24px] font-semibold sm:mb-[56px] mb-24"
						sx={styles.heading}
					>
						利用料金の確認
					</Typography>

					<Typography className="sm:leading-[140%] sm:mb-8 mb-16 font-semibold sm:text-[26px] text-[20px] text-[#222222]">
						宛名
					</Typography>
					<Box className="sm:flex justify-between sm:mb-56 mb-[38px]">
						<Typography className=" sm:text-[20px] text-[18px] sm:mb-0 mb-[32px] font-light sm:leading-[160%] leading-[140%] text-[#222222]">
							{dataBooking?.user_booking?.company_name ?
								<>
									{dataBooking?.user_booking?.company_name}　御中
									<br />
								</>
								: null
							}
							{dataBooking?.user_booking?.name}　様
						</Typography>
						<Box>
							<Typography className="sm:mb-16 mb-8">
								<img src={logoHeader} />
							</Typography>
							<Typography className=" sm:text-[20px] text-[16px] font-light text-[#222222] sm:leading-[160%] leading-[140%]">
								（ドアれぼ運営者）
								<br />
								株式会社ＳＸラボ
								<br />
								〒250-0865 <br className="sm:hidden block" /> 神奈川県小田原市蓮正寺124-2
								<br />
								TEL.0465-38-0663
								<br />
								FAX.0465-38-0660
								<br />
							</Typography>
						</Box>
					</Box>

					<Typography className="sm:text-[26px] font-semibold text-[20px] mb-16 sm:mb-[24px] text-[#222222] leading-[140%]">
						施設情報
					</Typography>

					<Typography className="sm:text-20 text-16 mb-16 sm:mb-[24px] text-[#222222] sm:leading-[160%] leading-[140%]">
						施設名を押すと施設情報を確認いただけます。
					</Typography>

					{loading ? (
						<div className="mt-40 text-center">
							<CircularProgress />
						</div>
					) : (
						<a
							className={'cursor-pointer'}
							href={`${ROUTER_SOCIAL.event.detail}/?facility_id=${facilityDetail?.id}`}
							target="_blank"
						>
							<Box
								className="sm:p-24 p-16 sm:h-[302px] h-[144px] rounded-[4px] border-1 border-solid border-[#E0E0E0]"
								sx={styles.card}
							>
								<Typography className="sm:mb-8 mb-10 sm:hidden block text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
									施設の詳細情報はこちら
								</Typography>
								<Box className="flex">
									<Box className="sm:w-[382px] w-[120px] sm:mr-16 sm:h-[254px] h-[80px] mr-[8px]">
										<Image
											src={facilityDetail?.image?.main?.image_url ?? imagefail}
											className="w-full max-h-full"
										/>
									</Box>
									<Box className="sm:w-[554px] w-[198px]">
										<Typography className="text_truncate_2 font-semibold text-[#222222] text-16 sm:text-[26px] leading-[140%] sm:mb-8 mb-6">
											{facilityDetail?.name}
										</Typography>
										<Box className="flex sm:mb-8">
											{isMobile ? (
												<img src={locationMobile} className="h-20 self-center mr-[9px]" />
											) : (
												<img src={location} className="h-20 self-center mr-[9px]" />
											)}
											<Typography className=" text-16 sm:text-20 text-[#222222] text_truncate_1 sm:leading-[160%] leading-[140%]">
												{facilityDetail?.nearby_station}
											</Typography>
										</Box>

										<Box className="sm:block hidden">
											<Typography className="text_truncate_3 text-20 text-[#222222] leading-[160%] font-light">
												{facilityDetail?.introduction}
											</Typography>

											<Box className="flex items-center mt-8 gap-8 overflow-hidden">
												{dataFacilityDetailSlice?.map((tag, i) => (
													<Box
														className="py-2 px-12 bg-[#FFFFFF] sm:text-[16px] text-[14px] truncate text-[#00A0E9] border-solid border-[1px] rounded-[160px] "
														key={i}
													>
														#{tag?.name}
													</Box>
												))}
												{facilityDetail?.tags?.length > 2 ? (
													<Typography className="sm:text-[16px] text-[14px]">
														+{facilityDetail?.tags?.length - 2}
													</Typography>
												) : null}
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>
						</a>
					)}

					<Typography className="sm:mt-24 mt-16 sm:text-20 text-16 text-[#222222] font-semibold sm:leading-[160%] leading-[140%]">
						施設名
					</Typography>
					<Typography className="sm:mt-8 mt-16 text-[#222222] break-all sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
						{facilityDetail?.name}
					</Typography>

					<Typography className="sm:mt-24 mt-16 sm:text-20 text-16 text-[#222222] font-semibold sm:leading-[160%] leading-[140%]">
						住所
					</Typography>
					<Typography className="sm:mt-8 mt-16 text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
						{facilityDetail?.address_line1}
					</Typography>

					<Box className="sm:flex hidden items-center mt-56 mb-24">
						<Typography className="sm:text-[26px] font-semibold text-[20px] text-[#222222] leading-[140%] mr-24">
							利用料金
						</Typography>
						<img src={calendar} className="mr-6 cursor-pointer" onClick={handleEntry} />
						<Typography className="text-[#00A0E9] cursor-pointer text-[20px]" onClick={handleEntry}>
							利用日時を変更する
						</Typography>
					</Box>

					<Typography className="mt-24 mb-16 sm:hidden block text-20 font-semibold text-[#222222] leading-[140%]">
						利用料金
					</Typography>
					{loading ? (
						<div className="my-40 text-center">
							<CircularProgress />
						</div>
					) : (
						<>
							{isMobile ? (
								<Box className="flex justify-between">
									<Typography className="text-16 mb-[3px] leading-[140%] font-semibold text-[#222222]">
										合計金額
									</Typography>
									<Typography className="text-16 mb-[3px] leading-[140%] font-semibold text-[#222222]">
										{dataBooking?.total_payment?.toLocaleString()?.replace('.', ',')} 円
									</Typography>
								</Box>
							) : (
								<Box className="flex">
									<Typography className="text-[20px] mr-24 leading-[160%] mb-[3px] font-semibold text-[#222222]">
										合計金額
									</Typography>
									<Typography className="text-[20px] mb-[3px] leading-[160%] font-semibold text-[#222222]">
										{dataBooking?.total_payment?.toLocaleString()?.replace('.', ',')} 円
									</Typography>
								</Box>
							)}
							<hr className="sm:mb-24 mb-20" />

							<Box className="flex gap-[100px]">
								<Box className="w-6/12 mb-[3px]">
									<Typography className="sm:text-20 text-16 mb-[3px] text-[#222222] font-semibold sm:leading-[160%] leading-[140%]">
										品目
									</Typography>
								</Box>
								{!isMobile ? (
									<Box className="w-6/12 mb-[3px] text-start grid grid-cols-4">
										<Typography className="text-[20px] mb-[3px] font-semibold leading-[160%] text-[#222222]">
											単価
										</Typography>
										<Typography className="text-[20px] mb-[3px] font-semibold leading-[160%] text-[#222222]">
											数量
										</Typography>
										<Typography className="text-[20px] mb-[3px] font-semibold leading-[160%] text-[#222222]">
											単位
										</Typography>
										<Typography className="text-[20px] mb-[3px] font-semibold text-end leading-[160%] text-[#222222]">
											価格
										</Typography>
									</Box>
								) : null}
							</Box>
							<hr className="sm:mb-24 mb-20" />

							{dataBooking?.rental_plan_price?.map(item => (
								<>
									<Box className="sm:flex flex-none sm:mb-0 mb-16 gap-[100px]">
										<Box className="sm:w-6/12">
											<Typography className="font-light sm:text-20 text-16 mb-8 text-[#222222] sm:leading-[160%] leading-[140%]">
												{item?.date} {item?.start_time}~{item?.end_time}
											</Typography>
										</Box>
										{isMobile ? (
											<>
												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単価
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light break-all">
														{item?.price_per_hour?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														数量
													</Typography>
													<Typography className=" text-16 leading-[140%] text-[#222222] font-light break-all">
														{item?.hour}
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className=" text-16 leading-[140%] text-[#222222] font-light">
														単位
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														時間
													</Typography>
												</Box>
												<Box className="w-full flex justify-between">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														価格
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light break-all">
														{item?.total_price_rental?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 text-start grid grid-cols-4 ">
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													{item?.price_per_hour?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													{item?.hour}
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													時間
												</Typography>
												<Typography className="text-20 mb-8 text-end break-all text-[#222222] leading-[160%] font-light">
													{item?.total_price_rental?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							))}

							{dataBooking?.discount_plans?.map(item => (
								<>
									<Box className="sm:flex flex-none sm:mb-0 mb-16 gap-[100px]">
										<Box className="sm:w-6/12">
											<Typography className="font-light sm:text-20 text-16 mb-8 text-[#222222] sm:leading-[160%] leading-[140%]">
												{item?.title}
											</Typography>
										</Box>
										{isMobile ? (
											<>
												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単価
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														{item?.price?.toLocaleString()?.replace('.', ',') || 0}
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														数量
													</Typography>
													<Typography className=" text-16 leading-[140%] text-[#222222] font-light">
														1
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単位
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														回
													</Typography>
												</Box>

												<Box className="w-full flex justify-between">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														価格
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														- {item?.price?.toLocaleString()?.replace('.', ',') || 0}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4">
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													{item?.price || 0}
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light text-end">
													-{item?.price?.toLocaleString()?.replace('.', ',') || 0}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							))}

							{dataBooking?.money_deals && dataBooking?.user_booking?.door_revo_id ? (
								<>
									<Box className="sm:flex flex-none gap-[100px] sm:mb-0 mb-16">
										<Box className="sm:w-6/12 mb-8">
											<Typography className="font-light sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
												特別プランID利用
											</Typography>
										</Box>
										{isMobile ? (
											<>
												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単価
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														数量
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														1
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単位
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														回
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														価格
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4 mb-8">
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light text-end">
													-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							) : null}

							{dataBooking?.option_items?.map(item => (
								<>
									<Box className="sm:flex flex-none gap-[100px] sm:mb-0 mb-16">
										<Box className="sm:w-6/12 mb-8">
											<Typography className="font-light sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
												{item?.name}
											</Typography>
										</Box>
										{isMobile ? (
											<>
												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単価
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														{item?.price?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														数量
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														1
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単位
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														回
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														価格
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														{item?.price?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4 mb-8">
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													{item?.price?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light text-end">
													{item?.price?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							))}

							{dataBooking?.money_deals && dataBooking?.user_booking?.door_revo_id === null ? (
								<>
									<Box className="sm:flex flex-none gap-[100px] sm:mb-0 mb-16">
										<Box className="sm:w-6/12 sm:mb-0 mb-8">
											<Typography className="font-light sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
												施設提供者特約
											</Typography>
										</Box>
										{isMobile ? (
											<>
												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単価
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														数量
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														1
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														単位
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														回
													</Typography>
												</Box>

												<Box className="w-full flex justify-between mb-8">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														価格
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4 sm:mb-0 mb-8">
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light text-end">
													-{dataBooking?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							) : null}

							<Box className="sm:flex flex-none gap-[100px] sm:mt-24 mt-16">
								<Box className="sm:w-6/12"></Box>
								<Box className="sm:w-6/12 flex justify-between ">
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] pb-[3px] ">
										小計
									</Typography>
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] pb-[3px] ">
										{dataBooking?.total_price?.toLocaleString()?.replace('.', ',')}円
									</Typography>
								</Box>
							</Box>

							<Box className="sm:flex flex-none gap-[100px]">
								<Box className="sm:w-6/12"></Box>
								<Box className="sm:w-6/12 flex justify-between border-solid border-b-1">
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] sm:mt-8 pb-[3px] mt-12">
										消費税
									</Typography>
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] sm:mt-8 pb-[3px] mt-12">
										{dataBooking?.VAT?.toLocaleString()?.replace('.', ',')}円
									</Typography>
								</Box>
							</Box>

							<Box className="sm:flex flex-none gap-[100px]">
								<Box className="sm:w-6/12"></Box>
								<Box className="sm:w-6/12 flex justify-between">
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] sm:mt-[9px] mt-[17px]">
										合計
									</Typography>
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] sm:mt-[9px] mt-[17px]">
										{dataBooking?.total_payment?.toLocaleString()?.replace('.', ',')}円
									</Typography>
								</Box>
							</Box>

							<Box className="sm:flex flex-none gap-[100px]">
								<Box className="sm:w-6/12"></Box>
								<Box className="sm:w-6/12 flex justify-between ">
									<Typography className="sm:text-16 sm:grow-0 grow text-14 sm:my-8 my-12 text-[#222222] leading-[140%] font-light">
										内訳
									</Typography>
									<Typography className=" sm:text-16 text-14 sm:my-8 my-12 text-[#222222] leading-[140%] font-light">
										10%対象
									</Typography>
									<Typography className=" sm:text-16 sm:ml-0 ml-8 text-14 sm:my-8 my-12 text-[#222222] leading-[140%] font-light">
										{dataBooking?.total_price?.toLocaleString()?.replace('.', ',')}円
									</Typography>
								</Box>
							</Box>

							<Box className="flex justify-end gap-[8px]">
								<Typography className="sm:text-16 text-14 mb-16 text-[#222222] leading-[140%] font-light">
									消費税
								</Typography>
								<Typography className="sm:text-16 text-14 mb-16 text-[#222222] leading-[140%] font-light">
									{dataBooking?.VAT?.toLocaleString()?.replace('.', ',')}円
								</Typography>
							</Box>
						</>
					)}

					<Box className="sm:my-[56px] my-[24px] border-solid border-1 border-[#E0E0E0] rounded-[4px]">
						<Box className="sm:p-24 p-16 bg-[#F9F9F9]">
							<Typography className="sm:text-[20px] mb-8 text-[16px] text-[#222222] font-semibold">
								キャンセルポリシー
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								原則として各施設のスペースで定めるキャンセルポリシーを優先するものとしますが、各施設のスペースがキャンセルポリシーを定めていない場合には、以下の定めが適用されます。なお、ここにいう「予約成立」とは、個別契約（ドアれぼ利用規約8条参照）の成立を意味します。
							</Typography>

							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									予約成立後、キャンセルされる場合は、ドアれぼ所定の手続きに従い、キャンセルをしてください。施設へのメッセージの送信のみでは、有効なキャンセルとなりませんので、ご注意ください。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP']mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									キャンセル料の対象となるキャンセルは、予約成立後に以下の事由が発生した場合を意味します。
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											a.
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											（1）日時変更の希望に関し、施設の承認が得られない場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											b.
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											（2）スペースの変更を希望される場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											c.
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											（3）予約を取り消される場合
										</Typography>
									</Box>
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									3.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									前項に定めるキャンセルがなされた場合は、各施設のスペースで定める以下2通りのいずれかに従い自動的にキャンセル料等が請求されます。但し、施設が別途定めるキャンセルポリシーがある場合は、当該ポリシーが優先して適用されるものとします（各施設のスペースページでキャンセルポリシーを確認できます）。
								</Typography>
							</Box>
							<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								■予約成立からの当日までのキャンセル受付：キャンセル料としてご利用予定料金の５％を請求
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								■ご利用日の当日(0:00～)のキャンセル受付：キャンセル料としてご利用予定料金の１００％を請求
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								※なお、予約時にご選択いただいた支払い方法によって、キャンセル料等の支払い方法が異なります。
							</Typography>
						</Box>
					</Box>

					<Box className="flex justify-center mt-10">
						<Controller
							name="check"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Checkbox {...field} color="primary" className="text-[#00A0E9] p-0 mr-[7px]" />
							)}
						/>
						<Typography className="text-[#000000] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
							キャンセルポリシーを確認し同意します
						</Typography>
					</Box>

					<Box className="sm:my-[56px] my-[24px] border-solid border-1 border-[#E0E0E0] rounded-[4px] sm:h-[356px] h-[702px] overflow-y-scroll">
						<Box className=" sm:p-24 p-16 bg-[#F9F9F9]">
							<Typography className="sm:text-[20px] mb-8 text-[16px] text-[#000000] font-semibold">
								施設利用者規約
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#000000] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								この規約は、主に施設利用者と施設提供者との間の施設利用に関する契約の内容を構成するものです。施設利用者又は施設提供者と「ドアれぼ」運営者との間の契約関係については、「ドアれぼ」運営者利用規約及び施設提供者規約をご覧ください。
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								総則
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者規約（以下「本規約」という。）に定める用語及び本サービス利用に当たって適用される条項は、本規約に定めがある場合を除き、「ドアれぼ」運営者利用規約及び施設提供者規約に定めるところによるものとします。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者が個別契約（「ドアれぼ」運営者利用規約８条参照。以下同じ）成立前に別途、提示する利用規則等が存在する場合には、本規約のほか当該利用規則等も施設利用者・施設提供者間の個別契約の内容を構成するものとし、本規約と当該利用規則等が矛盾する場合には、当該利用規則等が優先して適用されます。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									3.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									本規約に違反し、「ドアれぼ」運営者が提供するサービスの利用を継続させることが不適当と判断された場合には、「ドアれぼ」運営者に対し、強制的にユーザー登録の削除を行っていただくよう依頼することがありますので、予めご了承ください。
								</Typography>
							</Box>
							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								個別契約
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									本施設において成立する個別契約は、施設提供者が施設利用者に対し、予約した利用期間において、本施設の利用を認めることを内容とする契約です。予約した利用期間の満了により、個別契約が終了となり、契約の更新はありません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									本施設のご利⽤につきまして、施設利用者に借家権その他の独⽴した占有権、営業権等の固有の権利が付与されるものではなく、また何らこれらの権利は発⽣いたしません。
								</Typography>
							</Box>
							{/* Document */}
							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								利用条件
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者が施設利用に際し施設利用者の本人確認手続きを実施することを選択した場合には、施設利用者は本人確認手続きに協力しなければなりません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設は現況貸しとなっておりますので予めご了承ください。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									3.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設及び付属設備を利⽤する場合は、善管注意義務の下に責任を持って取り扱ってください。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									4.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者が本規約及び施設提供者が別途、提⽰する施設利⽤規則等に違反し、施設提供者に帰属する建造物や付帯設備・備品などを使用、費消、破損又は紛失する等（以下、「建造物等の破損等」といいます。）、名⽬の如何を問わず施設提供者に損害を発⽣させた場合には、施設利用者が当該損害額（修理⾦額の実費、及び、建造物等の破損等が原因で当該施設の利⽤ができなくなった場合の施設提供者の逸失利益を含み、これに限りません。）を賠償するものとします。なお、建造物等の破損等により施設提供者が修理を要することとなった場合、その⾒積・施⼯は施設提供者にて⾏い、その費用を施設利用者に対し損害賠償請求します。これらの点につき、施設利用者は⼀切の異議を述べないものとし、かつ、施設提供者及び「ドアれぼ」運営者に対し、⾦銭の⽀払いその他いかなる請求も⾏わないものとします。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									5.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者及び「ドアれぼ」運営者は、施設等の利⽤に伴う⼈⾝事故及び備品・展⽰品等の盗難・破損事故などのすべての事故について、⼀切の責任を負いません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									6.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者が機材・物品等を持ち込んだ場合には、施設利用者⾃らが持ち込んだ機材・物品等の管理を⾏うものとし、これらの盗難・紛失・⽕災損害等について施設提供者、「ドアれぼ」運営者ともに責任を負いません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									7.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									契約した利⽤期間途中で退出された場合でも、施設利⽤料⾦の割引、返⾦等は⾏いませんのでご了承ください。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									8.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									⽀払⽇までに施設利⽤料⾦を⽀払わないときは、当該期限の翌⽇から⽀払済みまで年
									14.6％の遅延損害⾦をお⽀払いいただくことがあります。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									9.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									利⽤期間終了後は、施設提供者及び「ドアれぼ」運営者の承諾なしに無断で施設に⽴ち⼊ることはできません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									10.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利⽤料⾦及び維持管理費の表示には、消費税が含まれておりません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									11.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									予約なしに勝⼿に施設を使⽤していることが発覚した場合や、定められた時間を超えて施設提供者の了承もなく施設を使⽤し、速やかに退去しない場合には、当該施設利⽤料⾦の２倍の⾦額（施設提供者が別途指定する場合はその⾦額）を施設提供者から施設利用者に対し請求させていただきます。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									12.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者の承諾なく、ご利⽤時間の勝⼿な延⻑はできません。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									13.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									退去期限までに持込まれた荷物や備品等が撤去されない場合は、施設提供者は、施設利用者が当該荷物や商品等の所有権を放棄したものとみなし、これらを移動、施設外に搬出、処理、又は廃棄することができるものとし、これに関し、施設利用者は、施設提供者又は「ドアれぼ」運営者に対し、名目の如何を問わず、何らの請求もできないものとします。この場合において、運搬・清掃・廃棄等に要した費⽤は、別途実費を施設利用者に対し請求します。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									14.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									去に遅延が発⽣した場合は、1
									⽇あたり施設利⽤料⾦の２倍の⾦額（施設提供者が別途指定する場合はその⾦額）を原状復帰に要した⽇数分も含め、施設提供者から施設利用者に対し、遅延損害⾦として請求します。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									15.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									鍵のある施設の場合は、利⽤期間終了時に、各施設の施設提供者の指定の通り返還を⾏ってください。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									16.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設の安全管理のため、防犯カメラを設置している場合がございますので、予めご了承ください。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									17.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									予約した施設は予約した施設利用者、当該施設利用者を含むグループ及び当該施設利用者が属する法人に所属する者のみ利⽤可能です。施設提供者及び「ドアれぼ」運営者の許可なく第三者への利⽤権限の譲渡又は貸与はできません。
								</Typography>
							</Box>
							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								宿泊にあたっての特則
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									宿泊の申込みをしようとする施設利用者は、次の事項を申し出ていただきます。
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(1)宿泊者代表者の⽒名、電話番号、メールアドレス
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(2)宿泊⽇及び到着予定時刻
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(3)その他施設提供者が必要と認める事項
										</Typography>
									</Box>
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者が、宿泊中に前項第2号の宿泊⽇を超えて宿泊の継続を申し⼊れた場合、施設提供者は、その申し出がなされた時点で新たな宿泊の申し込みがあったものとして処理します。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									3.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利⽤料⾦には、宿泊に関するサービス料やその消費税以外の税⾦（ホテル税、⼊湯税等）については含まれている場合と含まれていない場合があります。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									4.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利⽤料⾦に対して宿泊に関するサービス料及び消費税以外の税⾦（ホテル税、⼊湯税等）が発⽣する場合は、施設利用者は所定の⾦額を施設提供者に対して直接⽀払うものとします。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									5.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									本⼈確認のために、パスポートや運転免許証等の⾝分証明書の提⽰を求める場合がございますので、予めご了承下さい。
								</Typography>
							</Box>
							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								免責
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者は以下の各号に起因した⼀切の損害について、「ドアれぼ」運営者が賠償責任を負わないことに同意したものとします。
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(1)予約・申し込みキャンセル、⽇程内容変更について起きた損害
										</Typography>
									</Box>
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設内及び当該建物で発⽣した不正利⽤、器物損壊、無断キャンセル、盗難、事故、故障、⽕災、天災、感染症の罹患、⾬漏りその他トラブルによる損害
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									3.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設を当⽇利⽤できなかった場合及び当⽇途中から利⽤できなくなった場合の、営業補償、交通費、⼈件費など⼀切の損害
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									4.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者が本サービスの利⽤によって、施設提供者や他の施設利用者⼜は第三者に対して与えた損害及び⾃損事故による損害
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									5.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者が、「ドアれぼ」運営者利⽤規約、本規約及び各ページに記載されたキャンセルポリシー、注意事項に違反した際に発⽣した⼀切の損害
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									6.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者と施設提供者間の契約が消費者契約法上の消費者契約に該当する場合には、本規約のうち、施設提供者の責任を完全に免責する規定は効力を有しないものとします。この場合において、施設提供者に故意又は重過失がある場合を除き、施設提供者が施設利用者に対し負担する損害賠償責任は、当該責任が発生した施設利用に関する施設利用料金の額を上限とします。
								</Typography>
							</Box>

							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								利用の制限
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設利用者又は施設利用者が属するグループの人物等、本施設を利用する人物が以下の①乃⾄⑧に該当する場合及び以下の⑨乃⾄⑪に定める事由が⽣じた場合には、予約のお申込みに応じられませんので予めご了承ください。
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(1)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											暴⼒団、暴⼒団関係企業・団体、総会屋、過激⾏動団体、その他反社会勢⼒若しくはこれらに準じる者（以下「暴⼒団等」と称します。）⼜は暴⼒団等の関係者である場合（第三者がその旨認定した場合を含みます。）
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(2)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											暴⼒団等⼜は暴⼒団等の関係者が事業活動を⽀配する法⼈その他の団体である場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(3)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											役員（取締役、執⾏役⼜はこれらに準じる⽅を⾔います。）、従業員、関係者等が暴⼒団等の構成員⼜はその関係者である場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(4)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											本人確認手続きの結果、第三者機関が利用を不適当と判断した場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(5)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											施設提供者の他のお客さまに著しい迷惑を及ぼす⾔動をした場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(6)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											施設提供者及び「ドアれぼ」運営者に対して暴⼒、脅迫、恐喝、威圧的要求を⾏い、⼜は、合理的範囲を超える負担を要求した場合。あるいは過去に同様の⾏為を⾏ったと認められる場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(7)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											施設利用者が、利⽤に関し、法令の規定、公の秩序若しくは善良の⾵俗に反する⾏為をするおそれがあると認められる場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(8)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											施設利用者が、伝染病・感染症に罹患していると明らかに認められる場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(9)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											満室(員)により施設の余裕がない場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(10)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											天災、施設故障、その他やむを得ない事由で利⽤することができない場合
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(11)
										</Typography>
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											施設が所在する地域の条例･規則の規定に該当する場合
										</Typography>
									</Box>
								</Typography>
							</Box>

							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								利用の中止
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									予約が成⽴した後及び利⽤途中であっても、下記事項に該当する場合ご利⽤を中⽌させていただくことがございますので、予めご了承ください。なお、以下の各号該当性について、「ドアれぼ」運営者から施設利用者に対して説明を求めたものの、「ドアれぼ」運営者が定める期間内に合理的な説明が得られなかった場合には、各号に該当する⾏為を⾏ったものとみなします。
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(1)申込時の使⽤⽬的、催事企画書などの提出物と使⽤法が事実と反した場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(2)他の施設利⽤者、施設関連の他の会社に迷惑を及ぼした場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(3)施設利用者が施設提供者及びドアれぼ運営者の許可なく第三者に転貸した場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(4)⾵紀上又は安全管理上、不適当と認めた場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(5)常識を超えた備品をお持込又は、使⽤された場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(6)関係諸官庁から中⽌命令が出された場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(7)本サービスの施設提供者及び施設利用者に適⽤される「ドアれぼ」運営者利⽤規約、禁⽌事項及び注意事項、又は施設提供者の注意に従わない場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(8)暴⼒団等に属する者が利⽤しようとしていると認められる場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(9)施設利用者が、利⽤に関し、法令の規定、公の秩序若しくは善良の⾵俗に反する⾏為をするおそれがあると認められる場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(10)施設利用者が、伝染病・感染症に罹患していると明らかに認められる場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(11)天災、施設故障、その他やむを得ない事由で利⽤させることができない場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(12)施設が所在する地域の条例･規則の規定に該当する場合。
										</Typography>
									</Box>
									<Box className="flex">
										<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
											(13)その他、施設提供者及び「ドアれぼ」運営者が社会通念上不適切な使⽤⽅法と判断した場合。
										</Typography>
									</Box>
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									なお、前項の規定に基づいて利⽤を中⽌させていただいた場合であっても、予約時にお⽀払い頂いた施設利⽤料⾦の払い戻しはいたしかねますとともに、その際に⽣じた損害賠償責任は、施設利用者にご負担いただきますので、予めご了承ください。
								</Typography>
							</Box>

							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								禁止行為
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									刑法、著作権法、各自治体が定める条例その他の法令に反する又は反するおそれのある⾏為及び法令で販売が禁⽌されている商品の販売。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									公序良俗に反する低俗な⾏為及びわいせつ物や違法な商品の販売。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									3.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									危険物、騒⾳や振動を⽣じる物、動物やペット、及び常識を超えた備品の持ち込み及び販売。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									4.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									申込内容と異なる⾏為を⾏うこと。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									5.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									他⼈の権利・利益を侵害する可能性のあるものの販売。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									6.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者と同じ建物の⼊居者や他の施設利用者に迷惑を及ぼすおそれがある⾔動・⾏為・騒⾳等。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									7.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者の承諾なく、床・壁・天井・付属設備・備品等へ釘類を打ち付けたり、改築、改造、模様替え、粘着テープ類の貼り付け、鋲⽌め、その他現状を変更する⾏為。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									8.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									ドアれぼ運営者及び施設提供者に不利益を与える⾏為（予約時間外の利用や備品の破損を含み、これらに限りません。なお、施設提供者に不利益を与える行為があったと認められる場合において、施設提供者からの連絡の時点で既に退会していたり、連絡が一切取れない場合には、やむを得ず、施設利用者氏名、住所、電話番号、メールアドレス等の個人情報の開示を「ドアれぼ」運営者から受けざるを得ないこともありますので、あらかじめご了承ください）。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									9.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									ドアれぼ運営者の了承なく施設提供者と直接交渉、契約をするおそれのある⾏為。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									10.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者の書面による承諾を得ることなく、施設の全部又は一部につき、利用権を譲渡し、又は転貸すること。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									11.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									施設提供者の書面による承諾を得ることなく、施設の増築、改築、移転、改造若しくは模様替又は敷地内における工作物の設置を行うこと。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									12.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									その他法律で禁じられている⾏為。
								</Typography>
							</Box>

							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								キャンセルについて
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#000000] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								キャンセルポリシーをご参照ください。
							</Typography>
							<Typography className="font-['Noto_Sans_JP'] my-8 sm:text-16 text-14 text-[#000000] font-semibold sm:leading-[125%] leading-[140%]">
								その他
							</Typography>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									1.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									本規約は、施設利用者・施設提供者間の個別契約の内容として「ドアれぼ」運営者が提供するものであり、「ドアれぼ」運営者による任意の変更及び施設提供者が独自に定め個別契約成立前に提示する利用規則等による修正が有り得ます。
								</Typography>
							</Box>
							<Box className="flex">
								<Typography className="font-['Noto_Sans_JP'] mr-[5px] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									2.
								</Typography>
								<Typography className="font-['Noto_Sans_JP'] sm:text-16 text-14 text-[#222222] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									ドアれぼ運営者は、本規約を変更する場合には、その効力発生時期を定め、かつ、規約を変更する旨及び変更後の規約の内容並びにその効力発生時期をインターネットの利用その他の適切な方法により周知するものとし、当該周知後、本サービスを利用した場合又は「ドアれぼ」運営者の定める期間内に登録取消の手続をとらなかった場合には、本規約の変更に同意したものとみなします。
								</Typography>
							</Box>

							<Typography className="font-['Noto_Sans_JP'] mt-8 sm:text-16 text-14 text-[#000000] sm:font-normal font-light sm:leading-[125%] leading-[140%]">
								2023年4月1日　制定
							</Typography>
						</Box>
					</Box>

					<Box className="flex justify-center mt-10">
						<Controller
							name="check2"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Checkbox {...field} color="primary" className="text-[#00A0E9] p-0 mr-[7px]" />
							)}
						/>
						<Typography className="text-[#000000] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
							利用規約を確認し同意します
						</Typography>
					</Box>

					{dataBooking?.money_deals && dataBooking?.user_booking?.door_revo_id ||
						dataBooking?.money_deals && dataBooking?.user_booking?.door_revo_id === null
						? null
						:
						<Box className='sm:mt-[56px] mt-[24px]'>
							<Typography className="sm:text-[26px] font-semibold text-[20px] text-[#222222] leading-[140%]">
								お支払い対応サービス
							</Typography>
							<Typography className="sm:mt-[24px] mt-16 text-[#222222] sm:text-20 text-16 font-light">
								下記の支払いサービスに対応しています。
							</Typography>
							<img src={isMobile ? bankNameMobile : bankName} className='sm:p-16 sm:mt-[24px] mt-16' />
						</Box>
					}

					<Box className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] sm:mt-[56px] mt-24">
						<Button
							className="w-full lg:text-20 sm:text-16 text-16 px-0 h-56 sm:py-12 py-[17px] sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]"
							onClick={() =>
								navigate(`${ROUTER_SOCIAL.entry.enter_information}/?facility_id=${facilityDetail?.id}`)
							}
						>
							お客様情報入力へ戻る
						</Button>

						<PDFDownloadLink
							document={dataInvoicePDF ? <InvoicePDF dataInvoicePDF={dataInvoicePDF} /> : <></>}
							className=""
						>
							<Button className=" w-full lg:text-20 sm:text-16 text-16 px-0 h-56 sm:py-12 py-[17px] sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]">
								見積書をダウンロードする
							</Button>
						</PDFDownloadLink>
						<Box className="w-full lg:hidden sm:hidden block text-center mt-[-8px]">
							<Typography className=" text-[#222222] text-14 font-light leading-[140%]">
								予約確定前の見積書はこの画面でのみ
								<br />
								ダウンロードできます
							</Typography>
						</Box>

						{watchCheckBox && watchCheckBox2 ? (
							<LoadingButton
								loading={resend === true}
								variant="contained"
								color="primary"
								disabled={false}
								className=" w-full h-56 sm:py-12 py-[17px] lg:text-20 sm:text-16 text-16 px-0 sm:leading-[160%] shadow-none leading-[140%] font-semibold text-white rounded-[4px]"
								onClick={handleSubmit}
							>
								お支払いをして予約を確定させる
							</LoadingButton>
						) : (
							<Button
								variant="contained"
								color="primary"
								disabled={true}
								className=" w-full h-56 sm:py-12 py-[17px] lg:text-20 sm:text-16 text-16 px-0 sm:leading-[160%] shadow-none leading-[140%] font-semibold text-white rounded-[4px]"
								onClick={handleSubmit}
							>
								お支払いをして予約を確定させる
							</Button>
						)}
						<Box className="w-full lg:hidden sm:hidden block text-center mt-[-8px]">
							<Typography className=" text-[#222222] text-14 font-light leading-[140%]">
								支払いサービスelepayの画面が表示されます
							</Typography>
						</Box>
					</Box>
					<Box className="lg:grid sm:grid grid-cols-1 sm:grid-cols-3 gap-[16px] text-center sm:mt-16 hidden">
						<Box></Box>
						<Box>
							<Typography className="text-[#222222] text-16 font-normal leading-[125%]">
								予約確定前の見積書はこの画面でのみ
								<br />
								ダウンロードできます
							</Typography>
						</Box>
						<Box>
							<Typography className="text-[#222222] text-16 font-normal leading-[125%]">
								支払いサービスelepayの画面が表示されます
							</Typography>
						</Box>
					</Box>
					{renderEntryDialog(facilityDetail, timeBookingDetail, dataBooking)}
				</Box>
			}
		/>
	)
}

export default React.memo(FeeConfirm)

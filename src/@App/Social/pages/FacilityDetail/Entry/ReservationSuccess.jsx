import React, { useEffect, useMemo } from 'react'
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Divider,
	Step,
	StepLabel,
	Stepper,
	Typography,
	useMediaQuery
} from '@mui/material'
import tick from '@App/Social/assets/tick.png'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Image from 'mui-image'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import logoHeader from '@App/Social/assets/logoHeader.png'
import { useRequest } from 'ahooks'
import { facilityService } from '@App/Social/services/facilityService'
import { historyService } from '@App/Social/services/historyService'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Check } from '@mui/icons-material'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'
import InvoicePDF from '../../HistoryDetail/PDF/InvoicePDF'

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
		boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)'
	}
}

const steps = ['オプションアイテム選択', '利用者情報入力', '利用料金の確認', '支払い', '予約完了']

const BookingSuccess = () => {
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')
	const state = useLocation()

	let [searchParams] = useSearchParams()

	const codeId = searchParams.get('codeId')
	const status = searchParams.get('status')

	const {
		data: invoiceDetail,
		run: getInvoiceDetail,
		loadingInvoice
	} = useRequest(facilityService.invoice, {
		manual: true
	})

	const {
		data: historydetail,
		run: getHistorydetail,
		loading
	} = useRequest(historyService.historyDetail, {
		manual: true
	})

	const dataFacilityDetailSlice = useMemo(() => {
		if (historydetail) {
			if (historydetail?.facility?.tags?.length <= 2) {
				return historydetail?.facility?.tags
			} else {
				return historydetail?.facility?.tags?.slice(0, 2)
			}
		} else {
			if (invoiceDetail?.facility?.tags?.length <= 2) {
				return invoiceDetail?.facility?.tags
			} else {
				return invoiceDetail?.facility?.tags?.slice(0, 2)
			}
		}
	}, [invoiceDetail?.facility, historydetail?.facility])

	const { run: getBookingCompleted } = useRequest(facilityService.bookingCompleted, {
		manual: true
	})

	const { data: dataQuotePDF, run: getDataQuotePDF } = useRequest(historyService.getQuotePDFData, {
		manual: true
	})

	useEffect(() => {
		if (status && codeId) {
			getBookingCompleted({ code_id: codeId, status: status })
		}
	}, [])

	useEffect(() => {
		if (status && codeId) {
			getInvoiceDetail(codeId)
		}
	}, [])

	useEffect(() => {
		if (status && codeId) {
			getDataQuotePDF(codeId)
		}
	}, [])

	useEffect(() => {
		if (state?.state) {
			getHistorydetail(state?.state)
		}
		if (historydetail?.code_id) {
			getDataQuotePDF(historydetail?.code_id)
		}
	}, [state?.state])

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
							<Stepper activeStep={4} alternativeLabel>
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
						ご予約ありがとうございました
					</Typography>

					<img className="mx-auto sm:mb-56 mb-24 sm:h-auto h-[76px]" src={tick} />

					<Typography className="bg-[#EFFAFF] sm:p-24 p-16 sm:mb-[56px] mb-24">
						<Typography className="sm:text-20 text-[16px] sm:mb-16 mb-8 text-[#222222] sm:leading-[160%] leading-[140%]">
							予約が完了しました。
						</Typography>
						<Typography className="sm:text-20 text-[16px] sm:mb-16 text-[#222222] sm:leading-[160%] leading-[140%]">
							予約内容をご登録のメールアドレス宛にお送りしております。
							<br />
							予約内容は「利用履歴」からも確認することができます。
						</Typography>
						<Typography className="sm:text-20 text-[16px] text-[#222222] sm:leading-[160%] leading-[140%]">
							鍵は予約時間の定刻に開錠します。
						</Typography>
					</Typography>

					<Divider className="sm:mb-[56px] mb-24" />

					<Typography className="text-center text-[#222222] sm:text-[32px] text-[24px] font-semibold sm:mb-[56px] mb-24 sm:leading-[140%] leading-[100%]">
						予約内容
					</Typography>

					<Typography className="sm:leading-[140%] mb-8 font-semibold sm:text-[26px] text-[20px] text-[#222222]">
						宛名
					</Typography>
					<Box className="sm:flex justify-between sm:mb-56 mb-[38px]">
						<Typography className=" sm:text-[20px] text-[18px] sm:mb-0 mb-[40px] font-light sm:leading-[160%] leading-[140%] text-[#222222]">
							{invoiceDetail?.facilityAgreement?.company_name ?
								<>
									{invoiceDetail?.facilityAgreement?.company_name}　御中
									<br />
								</>
								: null
							}
							{historydetail?.facilityAgreement?.company_name ?
								<>
									{historydetail?.facilityAgreement?.company_name}　御中
									<br />
								</>
								: null
							}
							{invoiceDetail?.facilityAgreement?.name ? invoiceDetail?.facilityAgreement?.name : historydetail?.facilityAgreement?.name}　様
						</Typography>
						<Box>
							<Typography className="sm:mb-16 mb-8">
								<img src={logoHeader} />
							</Typography>
							<Typography className=" sm:text-[20px] text-[16px] font-light text-[#222222] sm:leading-[160%] leading-[140%]">
								（ドアれぼ運営者）
								<br className="sm:hidden block" />
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

					<Typography className="sm:text-[26px] font-semibold text-[20px] mb-16 sm:mb-8 text-[#222222] leading-[140%]">
						施設情報
					</Typography>

					<Typography className="sm:text-20 text-16 mb-16 sm:mb-[24px] text-[#222222] sm:leading-[160%] leading-[140%]">
						施設名を押すと施設情報を確認いただけます。
					</Typography>

					{loadingInvoice ? (
						<div className="mt-40 text-center">
							<CircularProgress />
						</div>
					) : (
						<a
							className={'cursor-pointer'}
							href={`${ROUTER_SOCIAL.event.detail}/?facility_id=${historydetail ? historydetail?.facility?.id : invoiceDetail?.facility?.id
								}`}
							target="_blank"
						>
							<Box
								className="sm:p-24 p-16 rounded-[4px] border-1 border-solid border-[#E0E0E0]"
								sx={styles.card}
							>
								<Typography className="sm:mb-8 mb-10 sm:hidden block text-[#222222] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
									施設の詳細情報はこちら
								</Typography>
								<Box className="flex h-full">
									<Box className="sm:w-[382px] w-[120px] sm:mr-16 mr-[8px] sm:h-[254px] h-80">
										<Image
											src={
												(historydetail
													? historydetail?.facility?.main_image?.image_url
													: invoiceDetail?.facility?.main_image?.image_url) ?? imagefail
											}
											className="sm:w-[382px] max-h-full"
										/>
									</Box>
									<Box className="sm:w-[554px] w-[198px]">
										<Typography className="text_truncate_2 font-semibold text-[#222222] text-16 sm:text-[26px] leading-[140%] mb-8">
											{historydetail
												? historydetail?.facility?.name
												: invoiceDetail?.facility?.name}
										</Typography>

										<Typography className="text-16 sm:text-20 text-[#222222] text_truncate_1 sm:leading-[160%] leading-[140%] sm:mb-8">
											{isMobile ? (
												<PlaceOutlinedIcon
													color="primary"
													className=" mb-2 ml-[5px] mr-[9px]"
												/>
											) : (
												<PlaceOutlinedIcon
													fontSize="large"
													className="self-center mb-4 ml-[5px] mr-[9px]"
												/>
											)}
											{historydetail
												? historydetail?.facility?.nearby_station
												: invoiceDetail?.facility?.nearby_station}
										</Typography>

										<Box className="sm:block hidden">
											<Typography className="text_truncate_3 text-20 text-[#222222] leading-[160%] font-light">
												{historydetail
													? historydetail?.facility?.introduction
													: invoiceDetail?.facility?.introduction}
											</Typography>

											<Box className="flex items-center gap-8 mt-8 overflow-hidden">
												{dataFacilityDetailSlice?.map((tag, i) => (
													<Box
														className="py-2 px-12 bg-[#FFFFFF] sm:text-[16px] text-[14px] truncate text-[#00A0E9] border-solid border-[1px] rounded-[160px] "
														key={i}
													>
														#{tag?.name}
													</Box>
												))}
												{historydetail ? (
													historydetail?.facility?.tags?.length > 2 ? (
														<Typography className="sm:text-[16px] text-[14px]">
															+{historydetail?.facility?.tags?.length - 2}
														</Typography>
													) : null
												) : invoiceDetail?.facility?.tags?.length > 2 ? (
													<Typography className="sm:text-[16px] text-[14px]">
														+{invoiceDetail?.facility?.tags?.length - 2}
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
					<Typography className="sm:mt-8 mt-16 text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
						{historydetail ? historydetail?.facility?.name : invoiceDetail?.facility?.name}
					</Typography>

					<Typography className="sm:mt-24 mt-16 sm:text-20 text-16 text-[#222222] font-semibold sm:leading-[160%] leading-[140%]">
						住所
					</Typography>
					<Typography className="sm:mt-8 mt-16 text-[#222222] break-all sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
						{historydetail
							? historydetail?.facility?.address_line1
							: invoiceDetail?.facility?.address_line1}
					</Typography>

					<Typography className="sm:mt-56 mt-24 sm:mb-24 mb-16 sm:text-[26px] text-20 text-[#222222] font-semibold sm:leading-[140%]">
						支払明細
					</Typography>

					{loadingInvoice ? (
						<div className="mt-40 text-center">
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
										{historydetail
											? historydetail?.total_payment?.toLocaleString()?.replace('.', ',')
											: invoiceDetail?.total_payment?.toLocaleString()?.replace('.', ',')}{' '}
										円
									</Typography>
								</Box>
							) : (
								<Box className="flex">
									<Typography className="text-[20px] mr-24 leading-[160%] mb-[3px] font-semibold text-[#222222]">
										合計金額
									</Typography>
									<Typography className="text-[20px] mb-[3px] leading-[160%] font-semibold text-[#222222]">
										{historydetail
											? historydetail?.total_payment?.toLocaleString()?.replace('.', ',')
											: invoiceDetail?.total_payment?.toLocaleString()?.replace('.', ',')}{' '}
										円
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

							{(historydetail ? historydetail?.rental_plan_price : invoiceDetail?.rental_plan_price)?.map(
								item => (
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
															{item?.total_price_rental
																?.toLocaleString()
																?.replace('.', ',')}
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
								)
							)}

							{(historydetail ? historydetail?.discount_plans : invoiceDetail?.discount_plans)?.map(
								item => (
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

													<Box className="w-full flex justify-between ">
														<Typography className="text-16 leading-[140%] text-[#222222] font-light">
															価格
														</Typography>
														<Typography className="text-16 leading-[140%] text-[#222222] font-light">
															-{item?.price?.toLocaleString()?.replace('.', ',') || 0}
														</Typography>
													</Box>
												</>
											) : (
												<Box className="w-6/12 justify-between text-start grid grid-cols-4">
													<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
														{item?.price?.toLocaleString()?.replace('.', ',') || 0}
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
								)
							)}

							{invoiceDetail?.money_deals && invoiceDetail?.facilityAgreement?.door_revo_id ? (
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
														-{invoiceDetail?.money_deals?.toLocaleString()?.replace('.', ',')}
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
														-{invoiceDetail?.money_deals?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4 mb-8">
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													-{invoiceDetail?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light text-end">
													-{invoiceDetail?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							) : null}

							{(historydetail ? historydetail?.option_items : invoiceDetail?.option_items)?.map(item => (
								<>
									<Box className="sm:flex flex-none gap-[100px] sm:mb-0 mb-16">
										<Box className="sm:w-6/12">
											<Typography className="font-light sm:text-20 text-16 mb-8 text-[#222222] sm:leading-[160%] leading-[140%]">
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

												<Box className="w-full flex justify-between">
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														価格
													</Typography>
													<Typography className="text-16 leading-[140%] text-[#222222] font-light">
														{item?.price?.toLocaleString()?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4">
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													{item?.price?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 mb-8 break-all text-[#222222] leading-[160%] font-light text-end">
													{item?.price?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							))}

							{historydetail?.money_deals && historydetail?.facilityAgreement?.door_revo_id === null ? (
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
														-
														{historydetail?.money_deals
															?.toLocaleString()
															?.replace('.', ',')}
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
														-
														{historydetail?.money_deals
															?.toLocaleString()
															?.replace('.', ',')}
													</Typography>
												</Box>
											</>
										) : (
											<Box className="w-6/12 justify-between text-start grid grid-cols-4 sm:mb-0 mb-8">
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													-{historydetail?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													1
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light">
													回
												</Typography>
												<Typography className="text-20 break-all text-[#222222] leading-[160%] font-light text-end">
													-{historydetail?.money_deals?.toLocaleString()?.replace('.', ',')}
												</Typography>
											</Box>
										)}
									</Box>
								</>
							) : null}

							<Box className="sm:flex flex-none gap-[100px] sm:mt-24 mt-16">
								<Box className="sm:w-6/12"></Box>
								<Box className="sm:w-6/12 flex justify-between ">
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222] pb-[3px]">
										小計
									</Typography>
									<Typography className="sm:text-[20px] text-16 sm:leading-[160%] leading-[140%] font-semibold text-[#222222]pb-[3px]">
										{historydetail
											? historydetail?.total_price?.toLocaleString()?.replace('.', ',')
											: invoiceDetail?.total_price?.toLocaleString()?.replace('.', ',')}
										円
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
										{historydetail
											? historydetail?.VAT?.toLocaleString()?.replace('.', ',')
											: invoiceDetail?.VAT?.toLocaleString()?.replace('.', ',')}
										円
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
										{historydetail
											? historydetail?.total_payment?.toLocaleString()?.replace('.', ',')
											: invoiceDetail?.total_payment?.toLocaleString()?.replace('.', ',')}
										円
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
										{historydetail
											? historydetail?.total_price?.toLocaleString()?.replace('.', ',')
											: invoiceDetail?.total_price?.toLocaleString()?.replace('.', ',')}
										円
									</Typography>
								</Box>
							</Box>

							<Box className="flex justify-end gap-[8px]">
								<Typography className="sm:text-16 text-14 mb-16 text-[#222222] leading-[140%] font-light">
									消費税
								</Typography>
								<Typography className="sm:text-16 text-14 mb-16 text-[#222222] leading-[140%] font-light">
									{historydetail
										? historydetail?.VAT?.toLocaleString()?.replace('.', ',')
										: invoiceDetail?.VAT?.toLocaleString()?.replace('.', ',')}
									円
								</Typography>
							</Box>
						</>
					)}

					<Typography className="sm:mt-56 mt-24 sm:text-[26px] text-[20px] sm:mb-24 mb-16 text-[#222222] font-semibold sm:leading-[140%]">
						予約情報
					</Typography>

					<Typography className="sm:text-[20px] text-[16px] sm:leading-[100%] leading-[140%] mb-8 text-[#222222] font-semibold">
						予約ID
					</Typography>
					<Typography className=" sm:text-[20px] text-[16px] sm:mb-[24px] mb-16 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
						{historydetail ? historydetail?.id : invoiceDetail?.id}
					</Typography>

					<Typography className=" sm:text-[20px] text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						利用日時
					</Typography>

					{(historydetail ? historydetail?.rental_plan_price : invoiceDetail?.rental_plan_price)?.map(
						item => (
							<Typography className=" sm:text-[20px] mt-8 text-[16px] text-[#222222] sm:leading-[160%] font-light leading-[140%]">
								{item?.date} {item?.start_time}~{item?.end_time}
							</Typography>
						)
					)}

					<Typography className="sm:text-[20px] sm:mt-[24px] mt-16 text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						オプション
					</Typography>
					{historydetail ? (
						historydetail?.option_items?.length
					) : invoiceDetail?.option_items?.length > 0 ? (
						(historydetail ? historydetail?.option_items : invoiceDetail?.option_items)?.map(item => (
							<Typography className=" sm:text-[20px] break-all text-[16px] mb-8 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
								{item?.name}
							</Typography>
						))
					) : (
						<Typography className="sm:text-[20px] text-[16px] mb-8 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
							なし
						</Typography>
					)}

					<Typography className="sm:mt-56 mt-24 sm:text-[26px] text-[20px] sm:mb-24 mb-16 text-[#222222] font-semibold sm:leading-[140%]">
						お客様情報
					</Typography>

					<Typography className=" sm:text-[20px] text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						会社名・組織名
					</Typography>
					<Typography className=" sm:text-[20px] text-[16px] sm:mb-[24px] mb-16 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
						{(historydetail
							? historydetail?.facilityAgreement?.company_name
							: invoiceDetail?.facilityAgreement?.company_name) || 'なし'}
					</Typography>

					<Typography className="sm:text-[20px] text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						氏名
					</Typography>
					<Typography className="sm:text-[20px] text-[16px] sm:mb-[24px] mb-16 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
						{historydetail
							? historydetail?.facilityAgreement?.name
							: invoiceDetail?.facilityAgreement?.name}
					</Typography>

					<Typography className="sm:text-[20px] text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						電話番号
					</Typography>
					<Typography className="sm:text-[20px] text-[16px] sm:mb-[24px] mb-16 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
						{historydetail
							? historydetail?.facilityAgreement?.phone_no
							: invoiceDetail?.facilityAgreement?.phone_no}
					</Typography>

					<Typography className="sm:text-[20px] text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						メールアドレス
					</Typography>
					<Typography className="sm:text-[20px] text-[16px] break-all sm:mb-[24px] mb-16 text-[#222222] sm:leading-[160%] font-light leading-[140%]">
						{historydetail
							? historydetail?.facilityAgreement?.email
							: invoiceDetail?.facilityAgreement?.email}
					</Typography>

					<Typography className="sm:text-[20px] text-[16px] mb-8 text-[#222222] font-semibold sm:leading-[100%] leading-[140%]">
						特別プランID
					</Typography>
					<Typography className="sm:text-[20px] text-[16px] text-[#222222] sm:leading-[160%] font-light leading-[140%]">
						{(historydetail
							? historydetail?.facilityAgreement?.door_revo_id
							: invoiceDetail?.facilityAgreement?.door_revo_id) || 'なし'}
					</Typography>

					<Box className="text-center sm:mt-56 mt-24">
						<Button
							className="sm:w-[400px] w-full sm:text-20 text-16 px-0 h-56 sm:py-12 py-[17px] mb-16 sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]"
							onClick={() => navigate(ROUTER_SOCIAL.event.history)}
						>
							予約・利用履歴一覧を確認する
						</Button>
						<br />
						{!codeId ? (
							<PDFDownloadLink
								document={historydetail ? <InvoicePDF dataInvoicePDF={historydetail} /> : <></>}
							>
								<Button className="sm:w-[400px] w-full sm:text-20 text-16 px-0 h-56 sm:py-12 py-[17px] mb-8 sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]">
									領収書をダウンロードする
								</Button>
							</PDFDownloadLink>
						) : (
							<PDFDownloadLink
								document={dataQuotePDF ? <InvoicePDF dataInvoicePDF={dataQuotePDF} /> : <></>}
							>
								<Button className="sm:w-[400px] w-full sm:text-20 text-16 px-0 h-56 sm:py-12 py-[17px] mb-8 sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]">
									領収書をダウンロードする
								</Button>
							</PDFDownloadLink>
						)}
						<Typography className="mb-16 text-[#222222] text-16 font-light leading-[125%]">
							見積書・領収書は予約履歴の画面から確認、
							<br className="sm:hidden block" />
							ダウンロードができます。
						</Typography>
						<Button
							variant="contained"
							color="primary"
							className="sm:w-[400px] w-full h-56 sm:py-12 py-[17px] sm:text-20 text-16 px-0 sm:leading-[160%] shadow-none leading-[140%] font-semibold text-white rounded-[4px]"
							onClick={() => navigate(ROUTER_SOCIAL.event.event_top)}
						>
							TOPに戻る
						</Button>
					</Box>
				</Box>
			}
		/>
	)
}

export default React.memo(BookingSuccess)

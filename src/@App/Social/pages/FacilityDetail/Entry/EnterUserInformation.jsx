import React, { useEffect } from 'react'
import { Box, Button, CircularProgress, Step, StepLabel, Stepper, Typography } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Image from 'mui-image'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import CoreInput from '@Core/components/Input/CoreInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Yup from '@Core/helper/Yup'
import { useEntryDialog } from '../hooks/useEntryDialog'
import { useRequest } from 'ahooks'
import { facilityService } from '@App/Social/services/facilityService'
import { SESSION_STORAGE, getDataSession, setDataSession } from '@Core/helper/Session'
import { Check } from '@mui/icons-material'
// import no_image from '@App/Social/assets/no_image.webp'
import imagefail from '@App/Social/assets/imagefail.svg'
import { errorMsg, successMsg } from '@Core/helper/Message'
import { LoadingButton } from '@mui/lab'

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

function convertTo24HourFormat(time) {
	if (time === '00:00') {
		return '24:00'
	} else {
		return time
	}
}

const steps = ['オプションアイテム選択', '利用者情報入力', '利用料金の確認', '支払い', '予約完了']

const UserInfor = () => {
	const navigate = useNavigate()

	let [searchParams] = useSearchParams()

	const id = searchParams.get('facility_id')

	const { handleOpen, renderEntryDialog, initDate } = useEntryDialog()

	const dataBooking = getDataSession(SESSION_STORAGE, 'dataBooking')
	const item_id = getDataSession(SESSION_STORAGE, `item_id_facility_id=${id}`)

	const {
		data: facilityDetail,
		run: getFacilityDetail,
		loadingFacility
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

	const phoneRegExp = /^\d+(?:-\d+)*$/gi

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			company_name: dataBooking?.user_booking?.company_name ?? null,
			name: dataBooking?.user_booking?.name,
			phone_no: dataBooking?.user_booking?.phone_no,
			email: dataBooking?.user_booking?.email,
			door_revo_id: dataBooking?.user_booking?.door_revo_id ?? null
		},
		resolver: yupResolver(
			Yup.object({
				company_name: Yup.string().nullable(),
				name: Yup.string().required('これは必要項目です。'),
				phone_no: Yup.string('使用できない文字です。')
					.required('これは必要項目です。')
					.matches(phoneRegExp, '使用できない文字です。')
					.min(10, '電話番号の形式が正しくありません。')
					.max(12, '電話番号の形式が正しくありません。'),
				email: Yup.string().email('メールアドレスの形式が正しくありません。').required('これは必要項目です。'),
				door_revo_id: Yup.string().nullable()
			})
		)
	})

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

	const onSubmit = handleSubmit(async data => {
		const startDate = getDataSession(SESSION_STORAGE, 'start')
		const endDate = getDataSession(SESSION_STORAGE, 'end')
		try {
			const dataSubmit = {
				facility_id: id,
				opening_date: startDate,
				closing_date: endDate,
				company_name: data?.company_name ?? null,
				email: data?.email,
				door_revo_id: data?.door_revo_id ?? null,
				name: data?.name,
				phone_no: data?.phone_no,
				option_item_ids: item_id
			}
			const res = await facilityService.booking(dataSubmit)
			if (res) {
				setDataSession(SESSION_STORAGE, 'dataBooking', res)
			}
			if (res?.user_booking?.door_revo_id) {
				successMsg('特別プランIDの登録に成功しました。')
			}
			navigate(`${ROUTER_SOCIAL.entry.fee_confirmation}/?facility_id=${facilityDetail?.id}`)
		} catch (e) {
			errorMsg(e)
		}
	})

	return (
		<EventContentPage
			maxWidth={1000}
			hasBreadcrumb={false}
			content={
				<form onSubmit={onSubmit}>
					<Box className="mb-40 sm:mt-24 mt-16 px-16 sm:px-0">
						<Box className="sm:mb-[72px] mb-[32px]">
							<Box sx={{ width: '100%' }}>
								<Stepper activeStep={1} alternativeLabel>
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
							利用者情報入力
						</Typography>

						<Typography className="sm:mb-56 mb-24 text-[#222222] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%]">
							ご予約後やご利用当日にトラブルが発生した際は施設の担当者から利用者へご連絡する場合があります。
							<br />
							施設を利用される代表者様の方のご連絡先をご記載ください。
						</Typography>

						<Box className="sm:flex">
							<Box className="sm:w-[50%]">
								<Typography className="sm:mb-24 mb-16 sm:text-[26px] sm:leading-[140%] text-20 font-semibold text-[#222222]">
									利用者の情報
								</Typography>

								{loadingFacility ? (
									<div className="mt-40 text-center">
										<CircularProgress />
									</div>
								) : (
									<>
										<Typography className="text-[#222222] font-semibold sm:text-20 text-16 sm:leading-[160%] leading-[140%] mb-8">
											会社・組織名
										</Typography>
										<CoreInput
											control={control}
											className="sm:mb-24 mb-16 sm:mr-[56px]"
											name="company_name"
											defaultValue={dataBooking?.user_booking?.company_name}
											input={true}
										/>

										<Box className="flex mb-8">
											<Typography className="text-[#222222] font-semibold sm:text-20 text-16 sm:leading-[160%] leading-[140%] mr-8">
												氏名
											</Typography>
											<Typography className="text-[#D83443] font-light sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
												*必須
											</Typography>
										</Box>
										<CoreInput
											control={control}
											className="sm:mb-24 mb-16 sm:mr-[56px]"
											name="name"
											defaultValue={dataBooking?.user_booking?.name}
											input={true}
										/>

										<Box className="flex mb-8">
											<Typography className="text-[#222222] font-semibold sm:text-20 text-16 sm:leading-[160%] leading-[140%] mr-8">
												電話番号
											</Typography>
											<Typography className="text-[#D83443] font-light sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
												*必須
											</Typography>
										</Box>
										<CoreInput
											control={control}
											className="sm:mb-24 mb-16 sm:mr-[56px]"
											name="phone_no"
											defaultValue={dataBooking?.user_booking?.phone_no}
											input={true}
										/>

										<Box className="flex mb-8">
											<Typography className="text-[#222222] font-semibold sm:text-20 text-16 sm:leading-[160%] leading-[140%] mr-8">
												メールアドレス
											</Typography>
											<Typography className="text-[#D83443] font-light sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
												*必須
											</Typography>
										</Box>
										<CoreInput
											control={control}
											className="sm:mr-[56px]"
											name="email"
											defaultValue={dataBooking?.user_booking?.email}
											input={true}
										/>
									</>
								)}

								<Typography className="sm:mt-56 mt-24 sm:text-[26px] sm:leading-[140%] text-20 font-semibold text-[#222222]">
									特別プランIDの使用
								</Typography>

								<Typography className="sm:mt-24 mt-16 text-[#222222] sm:text-20 font-light sm:leading-[160%] leading-[140%] text-16 sm:mr-56">
									施設とコワーキング契約を結んでいる場合、特別プランIDを入力することで施設利用料が不要になります。
								</Typography>

								<Typography className="sm:mt-24 mt-16 mb-8 text-[#222222] font-semibold sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
									特別プランID
								</Typography>
								<CoreInput
									control={control}
									className="mb-8 sm:mr-56"
									name="door_revo_id"
									input={true}
								/>

								<Typography className="sm:mr-56 text-[#222222] sm:text-16 text-14 sm:font-normal font-light sm:leading-[125%] leading-[140%]">
									入力いただいた特別プランIDは保存されます。
									<br />
									マイページの「特別プランIDの編集」で確認いただくことができます。
								</Typography>
							</Box>

							<Box className="sm:w-[50%]">
								{loadingFacility ? (
									<div className="mt-40 text-center">
										<CircularProgress />
									</div>
								) : (
									<a
										className="cursor-pointer"
										href={`${ROUTER_SOCIAL.event.detail}/?facility_id=${facilityDetail?.id}`}
										target="_blank"
									>
										<Box
											className="sm:mb-[24px] sm:mt-0 mt-24 mb-16 p-16 rounded-[4px] border-1 border-solid border-[#E0E0E0]"
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

								<Box className="border-1 border-[#E0E0E0] py-8 px-16 rounded-t-[4px]">
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

						<Box className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] sm:mt-56 mt-24 sm:mb-[220px] mb-[100px]">
							<Button
								className="w-full lg:text-20 sm:text-18 text-16 px-0 h-56 sm:py-12 py-[17px] sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]"
								onClick={() =>
									navigate(`${ROUTER_SOCIAL.entry.item_selection}/?facility_id=${facilityDetail?.id}`)
								}
							>
								オプションアイテム選択へ戻る
							</Button>

							<Button
								className="w-full lg:text-20 sm:text-18 text-16 px-0 h-56 sm:py-12 py-[17px] sm:leading-[160%] leading-[140%] border-solid border-1 font-semibold  text-[#00A0E9] rounded-[4px]"
								onClick={handleEntry}
							>
								利用日時を変更する
							</Button>

							<LoadingButton
								loading={isSubmitting}
								variant="contained"
								color="primary"
								disabled={Object.entries(errors)?.length > 0}
								className="w-full h-56 sm:py-12 py-[17px] lg:text-20 sm:text-18 text-16 px-0 sm:leading-[160%] shadow-none leading-[140%] font-semibold text-white rounded-[4px]"
								type="submit"
							>
								利用料金の確認へ進む
							</LoadingButton>
						</Box>
						{renderEntryDialog(facilityDetail, timeBookingDetail, dataBooking)}
					</Box>
				</form>
			}
		/>
	)
}

export default React.memo(UserInfor)

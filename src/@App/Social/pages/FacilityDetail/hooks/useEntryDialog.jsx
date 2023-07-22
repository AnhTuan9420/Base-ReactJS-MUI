import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
	useMediaQuery
} from '@mui/material'
import { useBoolean } from 'ahooks'
import React, { useCallback, useEffect, useState, useRef} from 'react'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FacilityFeeItem from '../components/FacilityFeeItem'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Calendar from '@Core/Calendar'
import { useRentalPlan } from './useRentalPlanDialog'
import { errorMsg, successMsg } from '@Core/helper/Message'
import { SESSION_STORAGE, getDataSession, removeDataSession, setDataSession } from '@Core/helper/Session'
import moment from 'moment'
import { facilityService } from '@App/Social/services/facilityService'
import { useTheme } from '@emotion/react'
import TableRentalPlan from '../components/TableRentalPlan'
import warning from '@App/Social/assets/warning.svg'
import { LoadingButton } from '@mui/lab'
import CoreInput from '@Core/components/Input/CoreInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Yup from '@Core/helper/Yup'
import { formatTime } from '@Core/helper/Date'
import useDisableDate from '@Core/Calendar/hooks/useDisableDate'

const styles = {
	'::-webkit-scrollbar-track': {
		backgroundColor: '#f1f1f1'
	},

	'::-webkit-scrollbar': {
		width: '8px'
	},

	'::-webkit-scrollbar-thumb': {
		backgroundColor: '#c1c1c1'
	}
}

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
	  ref.current = value;
	});
	return ref.current;
}

function useForceUpdate(){
    
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

export const useEntryDialog = props => {
	const { rentalPlan, loadingRentalPlan } = useRentalPlan()

	const [open, { setTrue, setFalse }] = useBoolean(false)
	const [refreshData, setRefreshData] = useState(false)
	const navigate = useNavigate()
	const theme = useTheme()
	const [submit, setSubmit] = useState(false)

	const isMobile = useMediaQuery('(max-width:600px)')
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
	const now = new Date()

	const [time, setTime] = useState()
	let [pickStartDate, setPickStartDate] = useState(null)
	const [pickEndDate, setPickEndDate] = useState(null)
	const [forcePick, setForcePick] = useState(false)

	const [initDate, setInitDate] = useState(new Date(`${moment(new Date()).format('YYYY-MM-DD')} 00:00`))

	const [openTableRental, setOpenTableRental] = useState(false)

	const [dateAfterChangeDate, setDateAfterChangeDate] = useState(null)
	const phoneRegExp = /^(?:[0-9]\d*|\d)$/gi

	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)

	const [isChangeDate, setChangeDate] = useState(false)
	const [timeInputChange, setTimeInputChange] = useState(null)
	const [timeInputEndChange, setTimeInputEndChange] = useState(null)
	let [inputTime, setInputTime] = useState(null)
	const [timeBooking, setTimeBooking] = useState(null)
	const [hiddenDates] = useDisableDate(timeBooking?.time_can_booking ?? [])
	let [isDisableSend, setDisableSend] = useState(true)
	const [isHideSelectDate, setHideSelectDate] = useState(false); // integer state

	

	const updateTime = value => {
		if(!value) setPickStartDate(null)
		setTime(value)
		setChangeDate(true)
		if(value) setHideSelectDate(false)
	}
	const updateStartDate = value => {			
		setPickStartDate(value)
		setTimeInputChange(value);
		if(value == null){
			setTimeInputChange(null)
			setTimeInputEndChange(null)
		}
		else if(pickStartDate && value.getTime() == pickStartDate.getTime()){
		//	resetForm()
			setForcePick(!forcePick)
			
		}
		if(value)
			setHideSelectDate(false)
		setInputTime(null)

		setDisableSend(value == null);
		setChangeDate(true)
	}
	const updateEndDate = value => {
		setPickEndDate(value)
		setChangeDate(true)
		setTimeInputEndChange(value)
	}

	const {
		control,
		// handleSubmit,
		formState: { isSubmitting },
		watch,
		reset
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			time: time ?? 0,
			year: pickStartDate?.getFullYear() ?? null,
			months: parseInt(pickStartDate?.getMonth() + 1) ?? null,
			day: parseInt(pickStartDate?.getDate()) ?? null,
			hours: parseInt(pickStartDate?.getHours()) ?? null,
			minutes: parseInt(pickStartDate?.getMinutes()) ?? null
		}
		// resolver: yupResolver(
		// 	Yup.object({
		// 		year: Yup.string()
		// 			.required('これは必要項目です。')
		// 			.matches(phoneRegExp, '電話番号の形式が正しくありません。')
		// 	})
		// )
	})
	useEffect(() => {
		console.log(control)
	}, [control])


	const preDate = usePrevious({months : watch("months"),day: watch("day")});

	useEffect(() => {
		const startDate = new Date(watch('year'), watch('months'), watch('day'), watch('hours'), watch('minutes'))
		if(preDate && preDate.months != watch('months') && preDate.day == watch('day')){
			resetForm({
				day: "00",
			})
		}

		isInputChangeValue()

		setChangeDate(false)
		setStartDate(startDate)
		if (startDate) {
			setEndDate(new Date(startDate?.getTime() + 60 * 60 * 1000))
		}
	}, [watch('year'), watch('months'), watch('day'), watch('hours'), watch('minutes'), time])

	useEffect(() => {
		isInputChangeValue()

		setChangeDate(false)
	}, [watch('time'), inputTime?.year])

	useEffect(() => {
		let timeOutUpdateTime = setTimeout(() => updateCalender(), 500)
		return () => clearTimeout(timeOutUpdateTime)
	}, [inputTime])

	useEffect(()=>{
		if(!open && !pickStartDate){
			resetForm();
		}

		setHideSelectDate(false);
		
	},[open])

	const resetForm = (data)=>{
		let dataReset = {
			time: data ? data.time ?? watch("time") : "00",
			year: data ? data.year ?? watch("year") : (new Date().getFullYear()),
			months: data ? data.months ?? watch("months") : "00",
			day: data ? data.day ?? watch("day") : "00",
			hours: data ? data.hours ?? watch("hours") :"00",
			minutes: data ? data.minutes ?? watch("minutes") : "00",
		}
		reset(dataReset)
	}

	const isInputChangeValue = async () => {
		let data = {
			time: parseInt(watch('time')),
			year: parseInt(watch('year') ?? 0),
			months: parseInt(watch('months') ?? 0),
			day: parseInt(watch('day') ?? 0) ,
			hours: parseInt(watch('hours') ?? 0),
			minutes: parseInt(watch('minutes') ?? 0),
			time_s: watch('time'),
			year_s: watch('year'),
			months_s: watch('months'),
			day_s: watch('day'),
			hours_s: watch('hours'),
			minutes_s: watch('minutes'),
		}

		setDisableSend(true);
		let wTime = watch('time');
		if (isChangeDate || watch('time') == 0){
			//TH: time hợp lệ nhưng block đang chưa được cập nhật
			if(isChangeDate && pickStartDate){
				setHideSelectDate(false);
				setDisableSend(false);
			} 
			//TH: time hợp lệ nhưng block đang chưa được cập nhật
			else if(!watch('time') && pickStartDate){
				setHideSelectDate(true);
				setDisableSend(true)
				setEndDate(endDate ? null : new Date(0));
			}
			return
		}

		setInputTime(data)

	}

	const updateCalender = async () => {
		if(!inputTime) return;
		if(!open) return;

		isDisableSend = false;
		setDisableSend(true)

		const validateDate = dateInput => {
			let date = new Date(
				dateInput.year,
				parseInt(dateInput.months) - 1,
				dateInput.day,
				dateInput.hours,
				dateInput.minutes
			)

			let year = date.getFullYear(),
				months = date.getMonth() + 1,
				day = date.getDate(),
				hours = date.getHours(),
				minutes = date.getMinutes()

			if (
				year != parseInt(dateInput.year) ||
				months != parseInt(dateInput.months) ||
				day != parseInt(dateInput.day) ||
				hours != parseInt(dateInput.hours) ||
				minutes != parseInt(dateInput.minutes)||
				date < new Date()
			) {
				return false
			}

			return true
		}

		setHideSelectDate(false);

		const inputFail = ()=>{
			setTimeInputChange(null)
			setTimeInputEndChange(null)
			setHideSelectDate(true);
			setEndDate(endDate ? null : new Date(0));
		}

		for (let [key, value] of Object.entries(inputTime)) {
			// value = 0 => !value = 0
			// minus vân cho = 0
			if (!value && ( key != "minutes" && key != "hours" && key != "minutes_s" && key != "hours_s")) {
				inputFail();
				return;
			}

			if(typeof value == "string" && !/^\d+$/.test(value)){
				inputFail();
				errorMsg('選択した日付は正しくありません。')
				return;
			}
		}

		if (inputTime?.time == 0) {
			inputFail();
			return
		}

		const comperData = hiddenDates?.map(v => v.getTime())

		//comperData : những time có thể đặt
		if (
			!validateDate(inputTime) ||
			inputTime.year.toString().length > 4 ||
			inputTime.year.toString().length < 4 ||
			inputTime?.months > 12 ||
			inputTime?.day > 32 ||
			startDate.getTime() < now.getTime()||
			comperData.includes(startDate.getTime()) // Thêm được => đây ko phải là ngày có thể  đặt
		) {
			inputFail();
			errorMsg('選択した日付は正しくありません。')
			return
		}

		let pickTime = {
			time: time,
			year: pickStartDate?.getFullYear() ?? now.getFullYear(),
			months: pickStartDate?.getMonth() ? pickStartDate?.getMonth() + 1 : '00',
			day: pickStartDate?.getDate() ?? '00',
			hours: pickStartDate?.getHours() ?? '00',
			minutes: formatTime(pickStartDate?.getMinutes()) ?? '00'
		}
		let different = false;



		let timeChange = new Date(
			inputTime.year,
			inputTime.months - 1,
			inputTime.day,
			inputTime.hours,
			inputTime.minutes
		)
		
		setTimeInputChange(timeChange)
		let timeEndChange = new Date(
			inputTime.year,
			inputTime.months - 1,
			inputTime.day,
			parseInt(inputTime.hours) + parseInt(inputTime.time) - 1,
			inputTime.minutes
		)

		setTimeInputEndChange(timeEndChange)
		setEndDate(timeEndChange)

		//setChangeDate(true)
		//resetForm();

		setDisableSend(false)

		for (let [key, value] of Object.entries(pickTime)) {
			if (pickTime[key] != inputTime[key]) {
				different = true;
				
				//let timeEndChange = new Date(watch('year'), watch('months')-1, watch('day'), watch('hours') + time - 1, watch('minutes'));
				return
			}	
		}

		if(different){
			setDisableSend(false)
		}

	}
	
	const handleOpen = (timeBooking) => {
		setTimeBooking(timeBooking)
		setTrue()
	}

	const handleClose = () => {
		setFalse()
	}

	const setDefaultRefreshData = () => {
		setRefreshData(false)
	}

	useEffect(() => {
		const startDate = moment(pickStartDate).format('YYYY-MM-DD HH:mm')
		const endDate = moment(pickEndDate).add(60, 'minutes').format('YYYY-MM-DD HH:mm')
		const isInvalidDate = startDate === 'Invalid date' && endDate === 'Invalid date'

		setChangeDate(true)
		reset({
			time: time,
			year: pickStartDate?.
			getFullYear() ?? now.getFullYear(),
			months: pickStartDate ? pickStartDate?.getMonth() + 1 : '00',
			day: pickStartDate?.getDate() ?? '00',
			hours: pickStartDate?.getHours() ?? '00',
			minutes: formatTime(pickStartDate?.getMinutes()) ?? '00'
		})

		setTimeout(() => {
			setChangeDate(false)
		}, 100)

		if (pickStartDate === pickEndDate && !isInvalidDate) {
			setDataSession(SESSION_STORAGE, 'startDate', startDate)
			setDataSession(SESSION_STORAGE, 'endDate', endDate)
			return
		}

		if (isInvalidDate) {
			removeDataSession(SESSION_STORAGE, 'startDate')
			removeDataSession(SESSION_STORAGE, 'endDate')

			return
		}
		setDataSession(SESSION_STORAGE, 'startDate', startDate)
		setDataSession(SESSION_STORAGE, 'endDate', endDate)
	}, [pickStartDate, pickEndDate, time,forcePick])

	const handleSubmit = async id => {
		const startDate = getDataSession(SESSION_STORAGE, 'startDate')
		const endDate = getDataSession(SESSION_STORAGE, 'endDate')
		setSubmit(true)
		try {
			const dataSubmit = {
				facility_id: id,
				opening_date: startDate,
				closing_date: endDate
			}
			if (startDate && endDate) {
				const data = await facilityService.booking(dataSubmit)
				setDateAfterChangeDate(data)
				setDataSession(SESSION_STORAGE, 'dataBooking', data)
				setDataSession(SESSION_STORAGE, 'start', startDate)
				setDataSession(SESSION_STORAGE, 'end', endDate)
			}
			successMsg('データの設定が成功しました。')
			navigate(`${ROUTER_SOCIAL.entry.item_selection}/?facility_id=${id}`)
			setFalse()
			setSubmit(false)
		} catch (error) {
			errorMsg(error)
		}
	}

	const handleShowRentalPlan = () => {
		setOpenTableRental(true)
	}

	const renderEntryDialog = useCallback(
		(facilityDetail, timeBookingDetail, dataBooking) => {
			return (
				<Dialog
					onClose={handleClose}
					open={open}
					fullScreen={fullScreen}
					sx={{
						'& .MuiPaper-elevation': {
							maxWidth: '1000px',
							// paddingLeft: '50px',
							// paddingRight: '50px',
							overflow: 'hidden'
						},
						'@media screen and (max-width: 425px)': {
							'& .MuiPaper-elevation': {
								paddingLeft: '0px',
								paddingRight: '0px'
							}
						},
						'@media screen and (min-width: 600px)': {
							'.MuiPaper-elevation': {
								paddingLeft: '0px',
								paddingRight: '0px'
							}
						},
						'@media screen and (min-width: 960px)': {
							'.MuiPaper-elevation': {
								borderRadius: '20px'
							}
						},
						'@media screen and (min-width: 1440px)': {
							'& .MuiPaper-elevation': {
								minWidth: '1000px',
								maxWidth: '1000px',
								overflow: 'hidden'
							}
						}
					}}
				>
					<DialogTitle className="sm:py-[24px] sm:px-[24px] py-16 px-16 p-0">
						<Box className="flex items-center">
							<IconButton onClick={() => handleClose()} className="p-0">
								<CloseOutlinedIcon color="primary" />
							</IconButton>
							<Typography className="text-[#222222] mx-auto sm:text-[26px] text-20 font-semibold">
								利用日時選択
							</Typography>
						</Box>
					</DialogTitle>

					<DialogContent className="sm:py-0 pb-16 sm:px-[100px] px-0" sx={!isMobile ? styles : null}>
						<Box className="w-full overflow-hidden relative">
							<Box className="sm:px-0 px-16">
								<Typography className="text-left sm:text-20 text-[16px] sm:mb-8 mb-4 text-[#222222] sm:leading-[160%] leading-[140%]">
									{timeBookingDetail?.plan_id === 2 || timeBookingDetail?.plan_id === 4
										? 'カレンダーの緑色の箇所を選択して利用時間を選べます。'
										: 'カレンダーの水色の箇所を選択して利用時間を選べます。'}
								</Typography>
								<Typography className="sm:mb-[29px] mb-8 text-left sm:text-16 text-[#222222] text-14 sm:leading-[125%] leading-[140%]">
									※選択した日時を再度押下することで変更ができます。
									<br />
									※90日以上先の日時に予約を入れることはできません。
								</Typography>
							</Box>

							{!isMobile ? (
								<Calendar
								onSetInitDate={setInitDate}
								disableDates={timeBookingDetail?.time_can_booking}
								setTime={updateTime}
								setPickStartDate={updateStartDate}
								setPickEndDate={updateEndDate}
								start={getTimeStart(dataBooking)}
								end={getTimeEnd(dataBooking)}
								plan_id={timeBookingDetail?.plan_id}
								notShow={isHideSelectDate}
								timeStartForm={getTimeStart(dataBooking)}
								timeEndForm={getTimeEnd(dataBooking)}
							/>
							) : null}

							<Box className="sm:flex items-center self-center sm:w-full sm:mt-[24px] sm:px-0 px-16 mt-8">
								<Typography className="sm:text-16 sm:mb-0 mb-8 text-14 sm:w-[20%] w-full font-semibold text-[#222222] leading-[140%]">
									利用開始時刻
								</Typography>
								<Box>
									<Box
										className="flex sm:w-[80%] flex-col sm:flex-row "
										sx={{
											'& .Mui-disabled': {
												'-webkit-text-fill-color': 'black !important'
											}
										}}
									>
										<Box className="flex items-center">
											<CoreInput
												control={control}
												name="year"
												maxlength="4"
												className="sm:w-[90px] w-[72px] text-[#222222] sm:text-20 text-16 sm:mb-0 mb-8 mr-4 rounded-[4px]"
											/>

											<Typography className="sm:text-20 text-16 sm:mb-0 mb-8 mr-16 font-light text-[#222222] sm:leading-[160%] leading-[140%]">
												年
											</Typography>

											<CoreInput
												control={control}
												name="months"
												className="w-64 text-[#222222] sm:text-20 text-16 sm:mb-0 mb-8 mr-4 rounded-[4px]"
											/>

											<Typography className="sm:text-20 text-16 sm:mb-0 mb-8 mr-16 font-light text-[#222222] sm:leading-[160%] leading-[140%]">
												月
											</Typography>

											<CoreInput
												control={control}
												name="day"
												className="w-64 text-[#222222] sm:text-20 text-16 sm:mb-0 mb-8 mr-4 rounded-[4px]"
											/>
											<Typography className="sm:text-20 text-16 sm:mb-0 mb-8 sm:mr-16 font-light text-[#222222] sm:leading-[160%] leading-[140%]">
												日
											</Typography>
										</Box>
										<Box className="flex items-center">
											<CoreInput
												control={control}
												name="hours"
												className="w-56 text-[#222222] sm:text-20 text-16 mr-4 rounded-[4px]"
											/>

											<Typography className="sm:text-20 text-16 mr-4 font-light text-[#222222] sm:leading-[160%] leading-[140%]">
												:
											</Typography>

											<CoreInput
												name="minutes"
												readOnly
												control={control}
												className="w-56  text-[#222222] sm:text-20 text-16  mr-16 rounded-[4px]"
											/>

											<Typography className="sm:text-20 text-16 mr-16 font-light text-[#222222] sm:leading-[160%] leading-[140%]">
												〜
											</Typography>
										</Box>
									</Box>
									<Box className="flex py-6 px-8 sm:mt-4 mt-8 bg-[#FFF4DE] text-[#D86F34] leading-[125%] font-light">
										<img src={warning} className=" mr-[9px] h-[19px] self-center" />
										<Typography className="sm:text-16 text-[14px]">
											施設の鍵は利用開始時間に自動で開錠します。
										</Typography>
									</Box>
								</Box>
							</Box>

							<Box className="flex flex-wrap mt-[16px] w-full items-center sm:px-0 px-16">
								<Typography className="sm:text-16 sm:mb-0 mb-8 text-14 sm:w-[20%] w-full font-semibold text-[#222222] leading-[140%]">
									利用時間
								</Typography>
								<CoreInput
									control={control}
									name="time"
									className="w-72 text-[#222222] sm:mb-0 mb-10 mr-4 rounded-[4px]"
								/>
								<Typography className="sm:text-20 text-16 sm:mb-0 mb-10 mr-16 font-light text-[#222222] sm:leading-[160%] leading-[140%]">
									時間
								</Typography>
							</Box>

							{isMobile ? (
								<Box>
									<Calendar
											onSetInitDate={setInitDate}
											disableDates={timeBookingDetail?.time_can_booking}
											setTime={updateTime}
											setPickStartDate={updateStartDate}
											setPickEndDate={updateEndDate}
											start={getTimeStart(dataBooking)}
											end={getTimeEnd(dataBooking)}
											plan_id={timeBookingDetail?.plan_id}
											notShow={isHideSelectDate}
											timeStartForm={timeInputChange}
											timeEndForm={timeInputEndChange}
										/>
									<Box className="px-16">
										<Button
											className="h-56 text-16 mt-16 mb-8 leading-[140%] bg-white border-solid border-1 shadow-none text-[#00A0E9] w-full font-semibold py-[17px] px-0"
											onClick={handleShowRentalPlan}
										>
											この施設の料金プラン
										</Button>
									</Box>
								</Box>
							) : null}

							<Box className="mt-16 sm:block hidden">
								<Typography className="text-16 leading-[140%] font-semibold text-[#222222]">
									この施設の料金プラン
								</Typography>
								<Box className="flex mt-8">
									<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[20%] py-[9px] pl-8"></Box>
									<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[40%] py-[9px] pl-8">
										<Typography className="text-14 sm:text-16 leading-[140%] text-[#222222] font-light">
											時間帯
										</Typography>
									</Box>
									<Box className="bg-[#EFFAFF] border-1 border-[#E0E0E0] h-auto w-[40%] py-[9px] pl-8">
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
											<FacilityFeeItem data={rentalPlan?.workingday} entry={true} label="平日" />
										) : null}
										{rentalPlan?.saturday?.length > 0 ? (
											<FacilityFeeItem data={rentalPlan?.saturday} entry={true} label="土曜日" />
										) : null}
										{rentalPlan?.saturday?.length > 0 ? (
											<FacilityFeeItem data={rentalPlan?.sunday} entry={true} label="日曜日" />
										) : null}
										{rentalPlan?.saturday?.length > 0 ? (
											<FacilityFeeItem data={rentalPlan?.holiday} entry={true} label="祝日" />
										) : null}
									</>
								)}
							</Box>

							<Box className="sm:my-24 text-center sm:px-0 px-16">
								<LoadingButton
									loading={submit}
									disabled={isDisableSend}
									variant="contained"
									color="primary"
									className="sm:w-[400px] mx-auto sm:text-20 text-16 w-full sm:leading-[160%] leading-[140%] rounded-[4px] text-[#FFFFFF] shadow-none font-semibold sm:py-[12px] py-[17px] px-0"
									onClick={() => handleSubmit(facilityDetail?.id)}
								>
									この日時で予約手続きに進む
								</LoadingButton>
							</Box>
						</Box>
					</DialogContent>
					<Box className="sm:hidden block">
						<TableRentalPlan
							rentalPlan={rentalPlan}
							loadingRentalPlan={loadingRentalPlan}
							openTableRental={openTableRental}
							setOpenTableRental={setOpenTableRental}
							plan_id={timeBookingDetail?.plan_id}
						/>
					</Box>
				</Dialog>
			)
		},
		[open, time, openTableRental, submit, startDate?.getTime(), endDate?.getTime()]
	)

	const getTimeStart = dataBooking => {
		if (timeInputChange) return timeInputChange
		if (dataBooking) return dataBooking?.reservation_time?.opening_date
		return null
	}
	const getTimeEnd = dataBooking => {
		if (timeInputChange) return timeInputEndChange
		if (dataBooking) return dataBooking?.reservation_time?.closing_date
		return null
	}
	return {
		handleOpen,
		handleClose,
		renderEntryDialog,
		setDefaultRefreshData,
		dateAfterChangeDate,
		refreshData,
		initDate
	}
}

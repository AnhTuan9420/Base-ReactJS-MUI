import React, { memo, useEffect, useState } from 'react'
import './styles/index.css'
import useCalendarHour from './hooks/useCalendarHour'
import useNextSevenDays from './hooks/useNextSevenDays'
import { getDateHeaderString, getDateInBox, checkDisabledDate } from './utils/functions'
import CalendarHead from './components/CalendarHead'
import moment from 'moment'
import PropTypes from 'prop-types'
import useDisableDate from './hooks/useDisableDate'
import { eachHourOfInterval } from 'date-fns'
import { errorMsg } from '@Core/helper/Message'
import { useMediaQuery } from '@mui/material'
import { StarBorderTwoTone } from '@mui/icons-material'
var userAgent = navigator.userAgent;

const getTime = (date) => {
	if(!date) return 0;
	if(typeof date == "string"){
		return new Date(date).getTime()
	}
	return date?.getTime()
} 

const Calendar = props => {
	const isMobile = useMediaQuery('(max-width:600px)')

	const { disableDates, setTime, setPickStartDate, setPickEndDate, start, end, onSetInitDate, 
		plan_id, onSetStartDate,isNotChangeBlock, defaulStart,defaulEnd,forceUpdate,
		timeStartForm,timeEndForm,
		notShow} = props
	const [initDate, setInitDate] = useState(new Date(`${moment(start ?? new Date()).format('YYYY-MM-DD')} 00:00`))
	let [startDate, setStartDate] = useState(start)
	let [endDate, setEndDate] = useState(end)
	const [hiddenDates] = useDisableDate(disableDates)
	const [isHide,setHide] = useState(notShow)

	// console.log(start,'start');
	// console.log(end, 'end');

	useEffect(() => {
		if (onSetInitDate) {
			onSetInitDate(initDate)
		}
	}, [initDate])

	useEffect(() => {
		if(isHide){
			return;
		}
		if (setTime) {
			if (startDate && endDate) {
				const diffInMs = getTime(endDate)  - getTime(startDate) 
				const diffInHours = diffInMs / 3600000
				setTime(diffInHours + 1)
			} else {
				setTime(0)
			}
		}
		if (setPickStartDate) {
			if (startDate) {
				setPickStartDate(new Date(startDate))
			} else setPickStartDate(null)
		}
		if (setPickEndDate) {
			if (endDate) {
				setPickEndDate(new Date(endDate) )
			} else setPickEndDate(null)
		}
	}, [startDate, endDate])

	useEffect(() => {
		setHide(notShow);
		if(notShow){
			setStartDate(null)
			setEndDate(null)
			return;
		}
		if (timeStartForm && timeEndForm) {
			if(getTime(timeStartForm) == getTime(startDate) && getTime(timeEndForm) == getTime(endDate)) return;

			let _start = timeStartForm;
			let _end = end;
			if(typeof(timeStartForm) == "string"){
				_start = new Date(timeStartForm);
				_end = new Date(timeEndForm);
			}

			startDate = null;
			endDate = null;

			setStartDate(timeStartForm);
			setEndDate(timeEndForm);
			
			let startTime = new Date(`${moment(_start).format('YYYY-MM-DD')} 00:00`).getTime();
			let initDateTime = new Date(`${moment(initDate).format('YYYY-MM-DD')} 00:00`).getTime();
			if(startTime == initDateTime){
				refreshTime(_start,_end);
			}
			else{
				setInitDate(_start);
			}
			
		//	setInitDate(start);

			
		}
	},[timeStartForm,timeEndForm,notShow])

	const dates = useNextSevenDays(initDate)
	const hours = useCalendarHour()

	useEffect(() => {
		if (!startDate || !endDate) {
			return;
		}

		if (initDate.getTime() != getTime(startDate)) {
			return;
		}

		refreshTime(startDate,endDate);
	},[hiddenDates])

	const revertDefault = () =>{
		startDate = null;
		endDate = null;
		checkChoooseDate(defaulStart)
		endDate = null;
		if(getTime(defaulStart) != getTime(defaulEnd))
			checkChoooseDate(defaulEnd)

		setStartDate(defaulStart ?? null);
		setEndDate(defaulEnd ?? null);
		if(defaulStart && getTime(defaulStart) != getTime(initDate))
			setInitDate(defaulStart);
	}

	const refreshTime = (start,end) => {

		// if(notShow){
		// 	return;
		// }

		let oldStart = new Date(start);
		let oldEnd = new Date(end);

		startDate = null;
		endDate = null;

		if(oldStart && oldEnd){
			const comperData = hiddenDates?.map(v => v.getTime())
			
			if(!comperData?.includes(getTime(oldStart))){
				revertDefault();
				errorMsg('予約できません。');
				return;
			}
			if(isNotChangeBlock && getTime(oldStart) >= getTime(oldEnd) ){
				revertDefault();
				return;
			}

			let result = eachHourOfInterval({
				start: oldStart,
				end: oldEnd
			})

			for (let i = 0; i < result.length; i++) {
				if(!comperData?.includes(result[i].getTime())){
					if(isNotChangeBlock){
						revertDefault();
						errorMsg('予約できません。')
						return;
					}
					break;
				}
				if(!isNotChangeBlock){
					oldEnd = result[i];
				}
				
			}

			checkChoooseDate(oldStart)
			startDate = oldStart;
			endDate = null;
			if(oldEnd.getTime() != oldStart.getTime())
				checkChoooseDate(oldEnd)
		}
			
		setStartDate(oldStart);
		setEndDate(oldEnd)
	}

	const clickChooseDate = (time, index) => {
		let chooseDate;
		const month = dates[index].getMonth() + 1
		const day = dates[index].getDate()
		const year = dates[index].getFullYear()
		if(userAgent.indexOf("Safari") !== -1) {
			chooseDate = new Date(`${year}/${month}/${day} ${time}`)
		}else {
			chooseDate = new Date(`${year}-${month}-${day} ${time}`)
		}
		
		setHide(false);
		if(isNotChangeBlock){
			checkChoooseDateKeepBlock(chooseDate)
		}
		else{
			checkChoooseDate(chooseDate);
		}
	}

	const checkChoooseDate = (chooseDate) => {
		if(!chooseDate) return false;

		let check = false
		if (startDate && getTime(startDate)  != getTime(chooseDate) ) {
            let result = []
            const comperData = hiddenDates?.map(v => v.getTime())
            if (getTime(startDate) < getTime(chooseDate)) {
                result = eachHourOfInterval({
                    start: new Date(startDate),
                    end: chooseDate
                })
            } else {
                result = eachHourOfInterval({
                    start: chooseDate,
                    end: new Date(startDate),
                })
            }
            for (let i = 0; i < result.length; i++) {
                if(!comperData?.includes(result[i].getTime())){
                    check = true
                }
            }
        }

		if(startDate == undefined){
			startDate = null;
		}

		if (check) {
			errorMsg('予約できません。')
			return false;
		} else {
			// Trường hợp chỉ còn 1 giờ chọn
			if (
				startDate &&
				endDate &&
				chooseDate.getTime() === getTime(startDate) &&
				chooseDate.getTime() === getTime(endDate)
			) {
				setStartDate(null)
				setEndDate(null)
				return
				// trường hợp bỏ chọn từ trên xuống
			} else if (startDate !== null && chooseDate.getTime() === getTime(startDate)) {
				chooseDate.setMinutes(chooseDate.getMinutes() + 60)
				setStartDate(chooseDate)
				return
			}

			// Trường hợp set giá trị cho giờ bắt đầu
			if (startDate === null) {
				setStartDate(chooseDate)
			} else if (chooseDate.getTime() < getTime(startDate)) {
				setStartDate(chooseDate)
			}

			// Trường hợp set giá trị cho giờ kết thúc
			if (endDate === null) {
				setEndDate(chooseDate)
			} else if (
				// Trường hợp giờ chọn lớn hơn giờ kết thúc hoặc (giờ chon nhỏ hơn hoặc bằng giờ kết thúc đồng thời lớn hơn giờ bắt đầu)
				chooseDate.getTime() > getTime(endDate) ||
				(chooseDate.getTime() <= getTime(endDate) && chooseDate.getTime() > getTime(startDate))
			) {
				// Nếu giờ chọn nhỏ hơn hoặc bằng giờ kết thúc thì trừ đi 1 giờ
				if (chooseDate.getTime() <= getTime(endDate)) chooseDate.setMinutes(chooseDate.getMinutes() - 60)

				setEndDate(chooseDate)
			}
		}

		return true;
	}


	const checkChoooseDateKeepBlock = (chooseDate) =>{
		let detatime = new Date(end).getTime() - new Date(start).getTime();
		const chooseLastTime = new Date(chooseDate)
		chooseLastTime.setSeconds(chooseDate.getSeconds() + detatime/1000);
		refreshTime(chooseDate,chooseLastTime);
	}



	return (
		<div className="calendar">
			<CalendarHead setInitDate={setInitDate} dates={dates} plan_id={plan_id}/>
			<div className="calendar_header">
				<div className="calendar_header_item"></div>
				{dates.map((date, i) => (
					<div key={i} className="calendar_header_item w-auto">
						{getDateHeaderString(date)}
					</div>
				))}
			</div>
			<div className="calendar_body" id={isMobile ? "" : "style-4"}>
				{hours.map((hour, i) => (
					<div className={plan_id === 2 || plan_id === 4 ? "calendar_body_item24" : "calendar_body_item"} key={i}>
						<div>{hour}</div>
						<div
							className={`${
								getDateInBox(dates, 0, hour) >= getTime(startDate)  &&
								getDateInBox(dates, 0, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 0, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 0)}
						></div>
						<div
							className={`${
								getDateInBox(dates, 1, hour) >= getTime(startDate) &&
								getDateInBox(dates, 1, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 1, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 1)}
						></div>
						<div
							className={`${
								getDateInBox(dates, 2, hour) >= getTime(startDate) &&
								getDateInBox(dates, 2, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 2, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 2)}
						></div>
						<div
							className={`${
								getDateInBox(dates, 3, hour) >= getTime(startDate) &&
								getDateInBox(dates, 3, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 3, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 3)}
						></div>
						<div
							className={`${
								getDateInBox(dates, 4, hour) >= getTime(startDate) &&
								getDateInBox(dates, 4, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 4, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 4)}
						></div>
						<div
							className={`${
								getDateInBox(dates, 5, hour) >= getTime(startDate) &&
								getDateInBox(dates, 5, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 5, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 5)}
						></div>
						<div
							className={`${
								getDateInBox(dates, 6, hour) >= getTime(startDate) &&
								getDateInBox(dates, 6, hour) <= getTime(endDate)
									? 'active'
									: ''
							} ${!checkDisabledDate(hiddenDates, getDateInBox(dates, 6, hour)) ? 'disable' : ''}`}
							onClick={clickChooseDate.bind(this, hour, 6)}
						></div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Calendar

Calendar.defaultProps = {
	disableDates: [],
	start: null,
	end: null
}

Calendar.propTypes = {
	disableDates: PropTypes.array
}

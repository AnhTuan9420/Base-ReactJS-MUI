import React from 'react'
import useDate from '../hooks/useDate'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useMediaQuery } from '@mui/material'

const CalendarHead = ({ setInitDate, dates, plan_id }) => {
	const isMobile = useMediaQuery('(max-width:600px)')
	const { year: startYear, month: startMonth, dayTime: startDayTime } = useDate(dates[0])
	const { year: endYear, month: endMonth, dayTime: endDayTime } = useDate(dates[dates.length - 1])

	return (
		<div className="calendar_head">
			<div>
				<div className="calendar_head_header">
					<button
						className={`calendar_head_header_button rounded-4 h-32 w-32 ${
							dates[0].getTime() <= new Date().getTime() ? 'disabled' : ''
						}`}
						onClick={() => setInitDate(new Date(dates[0].getTime() - 6 * 86400000))}
					>
						<ArrowBackIosNewIcon fontSize="small" color="primary" />
					</button>
					<div className="calendar_head_date items-center ">
						<p className='text-16 text-[#222222] font-light leading-[140%]'>
							{startYear}年 {startMonth}月 {startDayTime}日
						</p>
						<span className='text-16 text-[#222222] font-light leading-[140%]'>〜</span>
						<p className='text-16 text-[#222222] font-light leading-[140%]'>
							{endYear}年 {endMonth}月 {endDayTime}日
						</p>
					</div>
					<button className="rounded-4 h-32 w-32" onClick={() => setInitDate(dates[dates.length - 1])}>
						<ArrowForwardIosIcon fontSize="small" color="primary" />
					</button>
				</div>
			</div>
			<div>
				<div className={plan_id === 2 || plan_id === 4 ? "calendar_head_box24" : "calendar_head_box"}>
					<div className='sm:ml-0 ml-16'></div>
					<p className='sm:text-16 text-14 text-[#222222] font-normal leading-[125%]'>予約可能</p>
				</div>
				<div className="calendar_head_box">
					<div></div>
					<p className='sm:text-16 text-14 text-[#222222] font-normal leading-[125%]'>
						{isMobile ? '満室・利用時間外' : '予約不可'}</p>
				</div>
			</div>
			<div>
				<button
					className={`calendar_head_header_button rounded-4 h-32 w-32 ${
						dates[0].getTime() <= new Date().getTime() ? 'disabled' : ''
					}`}
					onClick={() => setInitDate(new Date(dates[0].getTime() - 6 * 86400000))}
				>
					<ArrowBackIosNewIcon fontSize="inherit" color='primary' />
				</button>
				<p className='text-16 text-[#222222] font-light leading-[140%]'>
					{parseInt(startYear)}年 {parseInt(startMonth)}月 {parseInt(startDayTime)}日
				</p>
				<button
					className="rounded-4 h-32 w-32 "
					onClick={() => setInitDate(dates[dates.length - 1])}
				>
					<ArrowForwardIosIcon fontSize="inherit" color='primary' />
				</button>
			</div>
		</div>
	)
}

export default CalendarHead

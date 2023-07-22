import { Badge, Box, Button, CircularProgress, Divider, Tab, Typography, useMediaQuery } from '@mui/material'
import React, { memo, useEffect, useRef, useState } from 'react'
import notice from '@App/Social/assets/notice.svg'
import notify from '@App/Social/assets/notify.svg'
import clsx from 'clsx'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate } from 'react-router-dom'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CloseIcon from '@mui/icons-material/Close'
import { notificationsService } from '@App/Social/services/notificationService'
import { useRequest } from 'ahooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSocialUser } from '@Core/helper/Session'

const HeaderNotification = props => {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const [value, setValue] = useState('1')
	const el = useRef()
	const [page, setPage] = useState(1)
	const [hasRead, setHasRead] = useState(null)
	const isMobile = useMediaQuery('(max-width:600px)')

	const {
		data: listNotification,
		run: getNotification,
		loading
	} = useRequest(notificationsService.getList, {
		manual: true,
		onSuccess: data => {
			const hasNotiIds = data?.notifications?.filter(v => v?.status === 2).map(item => item?.id)
			setHasRead(hasNotiIds)
		}
	})

	useEffect(() => {
		const params = {
			page: page
		}
		getNotification(params)
	}, [])

	const [data, setData] = useState([])

	useEffect(() => {
		if (listNotification) {
			setData(prev => {
				return [...prev, ...listNotification?.notifications]
			})
		}
	}, [listNotification])

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleFetchData = () => {
		const params = {
			page: page + 1
		}
		setPage(page + 1)
		getNotification(params)
	}

	const handleUpdateStatus = item => {
		setOpen(false)
		setHasRead(prev => {
			return [...prev, item?.id]
		})
		navigate(`${ROUTER_SOCIAL.detail_notification}/?notification_id=${item?.information_id}`)
	}

	useEffect(() => {
		if (open && isMobile) {
			document.body.style.overflowY = 'hidden'
		} else {
			document.body.style.overflowY = 'auto'
		}
	}, [open])

	useEffect(() => {
		function handleClickOutside(event) {
			if (el.current && !el.current.contains(event.target)) {
				setOpen(false)
			}
		}
		// window.addEventListener('scroll', () => setOpen(false))
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// window.removeEventListener('scroll', () => {})
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div ref={el} className="z-9999">
			<TabContext value={value}>
				<Button
					className="show-notify-header cursor-pointer flex lg:ml-40 sm:ml-20 px-0 min-w-[45px]"
					onClick={() => {
						setOpen(!open)
					}}
				>
					{data?.filter(item => item?.status === 1).length >= 1 ? (
						<Badge color="error" variant="dot" className="sm:mr-10">
							<img className='sm:h-auto h-20' src={notice} />
						</Badge>
					) : (
						<img className="sm:mr-10 sm:h-auto h-20" src={notice} />
					)}
					<Typography className="sm:block hidden sm:text-[16px] font-bold text-[14px] text-black ">
						お知らせ
					</Typography>
				</Button>
				<Box
					className={
						data?.length > 0
							? clsx(
									'z-9999 absolute sm:top-[62px] lg:right-[230px] sm:right-[100px] top-0 right-0 bottom-0 sm:shadow-4 sm:min-w-[560px] sm:w-auto w-[100%] sm:h-[557px] bg-white rounded-[10px] ease-out duration-200 origin-top-right',
									open ? 'scale-100' : 'scale-0'
							  )
							: clsx(
									'z-9999 absolute sm:top-[62px] lg:right-[230px] sm:right-[100px] top-0 right-0 bottom-0 sm:shadow-4 sm:min-w-[560px] sm:w-auto w-[100%] sm:h-full bg-white rounded-[10px] ease-out duration-200 origin-top-right',
									open ? 'scale-100' : 'scale-0'
							  )
					}
				>
					<Box className="flex justify-center sm:justify-start items-center sm:p-16 pt-[18px] relative">
						<img className="sm:mt-2 sm:mr-12 mr-2" src={notify} />
						<Typography className="sm:text-[16px] font-semibold text-[20px] text-[#222222] ">
							お知らせ
						</Typography>
						<CloseIcon
							color="primary"
							className="absolute top-[19px] right-[19px] sm:hidden block"
							onClick={() => setOpen(false)}
						/>
					</Box>
					<Divider className="sm:block hidden" />
					{data?.length > 0 ? (
						<>
							<TabList onChange={handleChange} className="sm:pt-16 sm:pl-16  border-b-[1px] border-[#ccc]">
								<Tab label="全て表示" value="1" className="sm:w-auto" />
								<Tab label="未読のみ表示" value="2" className="sm:w-auto " />
							</TabList>
						</>
					) : null}

					<TabPanel value="1" className="p-0 ">
						<Box
							className={
								data?.length > 0
									? 'sm:h-[444px] h-[calc(100vh_-_105px)] overflow-y-scroll sm:w-[600px] bg-white w-[100%]'
									: 'sm:h-[57px] h-[calc(100vh_-_105px)] overflow-y-scroll sm:w-[600px] bg-white w-[100%] sm:shadow-4 rounded-b-[10px]'
							}
							id="scrollNotify"
							sx={{
								'::-webkit-scrollbar': { width: '5px' },
								'::-webkit-scrollbar-track': {
									background: '#f1f1f1'
								},
								'::-webkit-scrollbar-thumb': {
									background: '#888',
									borderRadius: '10px'
								},
								'& .MuiTabPanel-root': {
									padding: '0px'
								}
							}}
						>
							{loading ? (
								<div className="mt-10 text-center">
									<CircularProgress />
								</div>
							) : data?.length > 0 ? (
								<>
									<InfiniteScroll
										dataLength={data?.length ?? 10}
										next={() => handleFetchData()}
										hasMore={listNotification?.page < listNotification?.max_page}
										scrollableTarget="scrollNotify"
									>
										{data?.map((item, index) => {
											return (
												<Box key={index}>
													<Box
														className="flex items-center cursor-pointer"
														onClick={() => handleUpdateStatus(item)}
													>
														<Box className="pl-[20px] py-16 w-full">
															{item?.status === 1 ? (
																<Badge
																	color="error"
																	variant={
																		hasRead.includes(item?.id) ? 'standard' : 'dot'
																	}
																	className=""
																	anchorOrigin={{
																		vertical: 'top',
																		horizontal: 'left'
																	}}
																	sx={{
																		'.css-3za40p-MuiBadge-badge': {
																			marginTop: '12px'
																		}
																	}}
																>
																	<Typography className="text-[#222222] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%] ml-14 sm:w-[500px] w-[300px] break-all">
																		{item?.title}
																	</Typography>
																</Badge>
															) : (
																<Typography className="text-[#222222] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%] ml-14 sm:w-[500px] w-[300px] break-all">
																	{item?.title}
																</Typography>
															)}
															<Box className="flex items-center mt-[8px] ml-14">
																<Typography className="text-[#222222] sm:text-16 text-14 px-[9px] py-[3px] font-light bg-[#D3F1FF] mr-8">
																	お知らせ
																</Typography>
																<Typography className="text-[#8E8E8E] sm:text-16 text-14 font-light">
																	{item?.updated_at}
																</Typography>
															</Box>
														</Box>
														<Box className="items-center ml-16 mr-[24px]">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="8"
																height="12"
																viewBox="0 0 8 12"
																fill="none"
																color="blue"
															>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6L0 1.4Z"
																	fill="#00A0E9"
																/>
															</svg>
														</Box>
													</Box>
													<Divider />
												</Box>
											)
										})}
									</InfiniteScroll>
								</>
							) : (
								<Typography className="text-[#222222] text-16 font-light ml-16 sm:mt-16 sm:mb-16 sm:mr-16 mt-[38px]">
									お知らせはありません。
								</Typography>
							)}
						</Box>
					</TabPanel>

					<TabPanel value="2" className="p-0">
						<Box
							className="sm:h-[444px] h-[85vh] overflow-y-scroll sm:w-[600px] bg-white w-[100%]"
							id="scrollNotify2"
							sx={{
								'::-webkit-scrollbar': { width: '5px' },
								'::-webkit-scrollbar-track': {
									background: '#f1f1f1'
								},
								'::-webkit-scrollbar-thumb': {
									background: '#888',
									borderRadius: '10px'
								},
								'& .MuiTabPanel-root': {
									padding: '0px'
								}
							}}
						>
							{loading ? (
								<div className="mt-40 text-center">
									<CircularProgress />
								</div>
							) : data?.filter(item => item?.status === 1).length > 0 ? (
								<>
									<InfiniteScroll
										dataLength={data?.length ?? 10}
										next={() => handleFetchData()}
										hasMore={listNotification?.page < listNotification?.max_page}
										scrollableTarget="scrollNotify2"
									>
										{data
											?.filter(item => item?.status === 1)
											.map((value, i) => (
												<Box key={i}>
													<Box
														className="flex items-center cursor-pointer"
														onClick={() =>
															navigate(
																`${ROUTER_SOCIAL.detail_notification}/?notification_id=${value?.information_id}`
															) & setOpen(false)
														}
													>
														<Box className="pl-[20px] py-16 w-full">
															<Badge
																color="error"
																variant={
																	hasRead.includes(value?.id) ? 'standard' : 'dot'
																}
																className=""
																anchorOrigin={{
																	vertical: 'top',
																	horizontal: 'left'
																}}
																sx={{
																	'.css-3za40p-MuiBadge-badge': { marginTop: '12px' }
																}}
															>
																<Typography className="text-[#222222] sm:text-20 text-16 font-light sm:leading-[160%] leading-[140%] ml-14 sm:w-[500px] w-[300px] break-all">
																	{value?.title}
																</Typography>
															</Badge>
															<Box className="flex items-center mt-[8px] ml-14">
																<Typography className="text-[#222222] sm:text-16 text-14 px-[9px] py-[3px] font-light bg-[#D3F1FF] mr-8">
																	お知らせ
																</Typography>
																<Typography className="text-[#8E8E8E] sm:text-16 text-14 font-light">
																	{value?.updated_at}
																</Typography>
															</Box>
														</Box>
														<Box className="items-center ml-16 mr-[24px]">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="8"
																height="12"
																viewBox="0 0 8 12"
																fill="none"
															>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6L0 1.4Z"
																	fill="#00A0E9"
																/>
															</svg>
														</Box>
													</Box>
													<Divider />
												</Box>
											))}
									</InfiniteScroll>
								</>
							) : (
								<Typography className="text-[#222222] text-16 font-light ml-16 sm:mt-16 mt-[38px]">
									お知らせはありません。
								</Typography>
							)}
						</Box>
					</TabPanel>
				</Box>
			</TabContext>
		</div>
	)
}

export default memo(HeaderNotification)

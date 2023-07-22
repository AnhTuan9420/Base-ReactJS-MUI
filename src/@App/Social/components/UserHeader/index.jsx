import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { IconButton, Typography, Button, useMediaQuery } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useHref, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { getDataSession } from '@Core/helper/Session'
import LeftMenu from '../AppHeader/LeftMenu'
import { ShowLoginDialog } from '../LoginDialog'
import HeaderNotification from './HeaderNotification'
import HeaderPerson from './HeaderPerson'
import CalendarHeader from '@App/Social/assets/CalendarHeader.svg'
import Star from '@App/Social/assets/Star.svg'
import list from '@App/Social/assets/list.svg'
// import PropTypes from 'prop-types'
const UserHeader = props => {
	const user = getDataSession('local', 'social_user')
	const [open, setOpen] = useState(false)
	const isMobile = useMediaQuery('(max-width:600px)')

	const navigate = useNavigate()
	const location = useLocation()
	const endpoint = useHref()

	const { handleOpen, renderShowLoginDialog } = ShowLoginDialog()

	const handleShowLoginDialog = () => {
		handleOpen()
	}

	if (location.pathname === '/cyclist-info') {
		return (
			<Button onClick={() => navigate('/cycedit-info')} className="self-center">
				<Box>
					<Box className="">
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19" fill="none">
							<path
								d="M7.137 18.3334L9.38059 16H21.0192V18.3334H7.137ZM1.9487 17.1667H3.15463L14.2604 5.61669L13.0545 4.36252L1.9487 15.9125V17.1667ZM16.6442 4.77085L13.8397 1.88335L15.2139 0.454187C15.4383 0.220854 15.7094 0.104187 16.0272 0.104187C16.3451 0.104187 16.6068 0.220854 16.8125 0.454187L18.0184 1.70835C18.2428 1.92224 18.3549 2.19446 18.3549 2.52502C18.3549 2.85558 18.2521 3.1278 18.0465 3.34169L16.6442 4.77085ZM15.859 5.61669L3.63139 18.3334H0.826904V15.4167L13.0545 2.70002L15.859 5.61669Z"
								fill="#ffff"
							/>
						</svg>
					</Box>
					<Typography className="text-[10px] text-[#ffff]">編集</Typography>
				</Box>
			</Button>
		)
	}

	if (user) {
		return (
			<div className="flex justify-between">
				{!isMobile ? (
					<>
						<Button className="cursor-pointer flex" onClick={() => navigate(ROUTER_SOCIAL.event.favorite)}>
							<img src={Star} className="mr-[7px]" />
							<Typography className=" sm:text-[16px] font-bold text-[14px] text-black ">
								お気に入り
							</Typography>
						</Button>
						<Button
							className="cursor-pointer flex lg:ml-40 sm:ml-20"
							onClick={() => navigate(ROUTER_SOCIAL.event.history)}
						>
							<img src={CalendarHeader} className="mr-[7px]" />
							<Typography className=" sm:text-[16px] font-bold text-[14px] text-black ">
								利用履歴
							</Typography>
						</Button>
						<HeaderNotification />
					</>
				) : (
					<HeaderNotification />
				)}

				{isMobile ? (
					<Box className="cursor-pointer my-auto" onClick={() => setOpen(true)}>
						<IconButton
							size="small"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							color="primary"
							className="pr-16 pl-0"
						>
							<MenuIcon />
						</IconButton>
						{/* {auth?.displayName && <Typography>{auth?.displayName}</Typography>} */}
					</Box>
				) : (
					<HeaderPerson />
				)}

				<LeftMenu open={open} setOpen={setOpen} />
			</div>
		)
	}

	return (
		<div className="flex">
			{isMobile ? (
				<>
					<HeaderNotification className='min-w-[47px]'/>
					<Box className="cursor-pointer sm:ml-40 ml-0" onClick={() => setOpen(true)}>
						<IconButton
							size="small"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							color="primary"
							className="pr-16 pl-0"
						>
							<MenuIcon />
						</IconButton>
					</Box>
				</>
			) : (
				<>
					<Button className="cursor-pointer flex">
						<img src={list} className="mr-[7px]" />
						<Typography
							className="font-semibold leading-[140%] text-[16px] text-[#333333]"
							onClick={() => navigate(ROUTER_SOCIAL.event.teaser)}
						>
							施設を掲載する
						</Typography>
					</Button>
					<Box
						textAlign="center"
						className="cursor-pointer ml-[30px] mr-[80px] bg-[#00A0E9] w-[200px] rounded-4"
					>
						{endpoint === ROUTER_SOCIAL.event.teaser ? (
							<a href={import.meta.env.VITE_CMS_LOGIN_URL} target="_blank">
								<Typography className="text-white py-[9px] px-28 font-semibold leading-[140%] text-[16px] ">
									ログイン・会員登録
								</Typography>
							</a>
						) : (
							<Typography
								className="text-white py-[9px] px-28 font-semibold leading-[140%] text-[16px] "
								// onClick={handleShowLoginDialog}
								onClick={() => navigate(ROUTER_SOCIAL.auth.login)}
							>
								ログイン・会員登録
							</Typography>
						)}
					</Box>
				</>
			)}

			<LeftMenu open={open} setOpen={setOpen} />
			{renderShowLoginDialog()}
			{/* <Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>My account</MenuItem>
			</Menu> */}
		</div>
	)
}

//UserHeader.defaultProps = {}

//UserHeader.propTypes = {}

export default React.memo(UserHeader)

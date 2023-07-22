import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { deleteAccount, userInfoMenuMobile, userInfoMenus } from '@App/Social/configs/menuConfig'
import { clearSession } from '@Core/helper/Session'
import PropTypes from 'prop-types'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
	Breadcrumbs,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	MenuItem,
	Typography,
	useMediaQuery
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useBoolean, useRequest } from 'ahooks'
import Person from '@App/Social/assets/Person.svg'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { successMsg } from '@Core/helper/Message'
import { getDataSession } from '@Core/helper/Session'
import { getQueryUrlObject } from '@Core/helper/Url'

const UserLayout = props => {
	const { headerTile, content, maxWidth, breadcrumbText, changeName } = props
	const isVerifyCode = getQueryUrlObject('status') === 'verify-code'

	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')

	const [name, setName] = useState(getDataSession('local', 'social_user')?.name)

	const handleLogout = () => {
		setFalse()
		successMsg('ログアウトしました。')
		navigate(ROUTER_SOCIAL.event.event_top)
		clearSession()
	}

	useEffect(() => {
		if (changeName) {
			setName(changeName?.name)
		}
	}, [changeName?.name])

	const [openConfirmLogout, { setTrue, setFalse }] = useBoolean(false)
	const handleOpenModal = async () => {
		await setTrue()
	}
	const handleCloseModal = () => {
		setFalse()
	}

	return (
		<Box className={`mx-auto min-h-[60vh] sm:w-[95%] lg:w-['${maxWidth}px']`} sx={{ maxWidth: `${maxWidth}px` }}>
			<Breadcrumbs
				className="sm:mt-[26px] mt-16 sm:ml-0 ml-16"
				separator={<NavigateNextIcon fontSize="medium" />}
				sx={{ '.MuiBreadcrumbs-separator': { marginX: '2px', color: '#222222' } }}
			>
				<Link to={ROUTER_SOCIAL.event.event_top} className="text-[#00A0E9] sm:text-16 text-14 font-light">
					トップ
				</Link>
				<Link
					to={ROUTER_SOCIAL.user.info}
					className={
						breadcrumbText
							? 'text-[#00A0E9] sm:text-16 text-14 font-light'
							: 'text-[#222222] sm:text-16 text-14 font-light'
					}
				>
					マイページ
				</Link>
				{isVerifyCode ? (
					<Box className="flex">
						<Link
							to={ROUTER_SOCIAL.user.change_email}
							className="text-[#00A0E9] sm:text-16 text-14 font-light"
						>
							メールアドレスの変更
						</Link>
						{!isMobile ? (
							<>
								<NavigateNextIcon fontSize="medium" className="mb-2 self-center text-[#222222] mx-2" />
								<Typography className="text-[#222222] sm:text-16 text-14 font-light">
									認証コード入力
								</Typography>
							</>
						) : null}
					</Box>
				) : (
					breadcrumbText && <Typography color="text.primary">{breadcrumbText}</Typography>
				)}
				{isVerifyCode && isMobile ? (
					<Typography className="text-[#222222] sm:text-16 mt-4 text-14 font-light">
						認証コード入力
					</Typography>
				) : null}
			</Breadcrumbs>
			<Box className="flex flex-col-reverse sm:flex-row flex-wrap sm:flex-nowrap items-start sm:mt-[72px] mt-[32px] sm:mb-[82px] mb-0 sm:gap-x-[24px]">
				<Box className="sm:w-[300px] w-full sm:rounded-[10px] sm:shadow-lg ">
					<Box className="sm:px-16 px-[18px] sm:py-[24px] py-[25px]">
						{isMobile ? (
							<Box className="flex">
								<img src={Person} className="h-20 w-20 mr-10 mt-2" />
								<Typography className="text-16 font-semibold leading-[140%] text-[#222222]">
									マイページメニュー
								</Typography>
							</Box>
						) : (
							<Box className="flex">
								<img src={Person} className="h-20 w-20  mr-10 mt-8" />
								<Typography className="text-20 font-semibold self-center leading-[160%] text-[#222222] break-all">
									{name} 様
								</Typography>
							</Box>
						)}
					</Box>
					<Divider />
					<>
						{(isMobile ? userInfoMenuMobile : userInfoMenus)?.map((item, i) => {
							if (item?.title === headerTile) {
								return (
									<Box key={i} onClick={() => navigate(item?.url)}>
										<MenuItem className="p-[16px] text-[#00A0E9] font-semibold bg-[#EFFAFF] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
											{item?.title}
										</MenuItem>
									</Box>
								)
							} else {
								return (
									<Box key={i} onClick={() => navigate(item?.url)}>
										<MenuItem className="p-[16px] text-[#222222] font-light sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
											{item?.title}
										</MenuItem>
									</Box>
								)
							}
						})}
						<div>
							<button onClick={handleOpenModal} className="w-full">
								<MenuItem className="p-[16px] text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%]">
									ログアウト
								</MenuItem>
							</button>
						</div>
						<div>
							<button onClick={() => navigate(deleteAccount?.url)} className="w-full">
								<MenuItem
									className={
										deleteAccount?.title === headerTile
											? 'p-[16px] text-[#00A0E9] font-semibold bg-[#EFFAFF] sm:text-20 text-16 sm:leading-[160%] leading-[140%]'
											: 'p-[16px] text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%]'
									}
								>
									{deleteAccount?.title}
								</MenuItem>
							</button>
						</div>
					</>
				</Box>
				<Box className="sm:w-[676px] w-full sm:min-h-[656px] min-h-max sm:rounded-[10px] sm:shadow-lg">
					<Box className="sm:p-[24px] sm:mb-0 mb-24">
						<Typography className="sm:text-[24px] text-[22px] text-center sm:text-left font-semibold text-[#222222]">
							{headerTile}
						</Typography>
					</Box>
					<Divider className="sm:block hidden" />
					<Box className="sm:p-[24px] sm:px-[24px] px-[16px]">{content}</Box>
				</Box>
			</Box>

			<Dialog
				onClose={handleCloseModal}
				open={openConfirmLogout}
				maxWidth="md"
				fullWidth
				PaperProps={{
					style: {
						borderRadius: '20px',
						maxWidth: '800px',
						minWidth: '358px'
					}
				}}
			>
				<DialogTitle className=" font-bold py-[19px] px-16 p-0">
					<Box className="flex items-center">
						<Typography className="mx-auto sm:text-[26px] text-16 font-semibold text-[#000000] leading-[140%]">
							確認
						</Typography>
						<IconButton onClick={() => handleCloseModal()} className="p-0">
							<CloseOutlinedIcon color="primary" />
						</IconButton>
					</Box>
				</DialogTitle>
				<Divider className="" />
				<DialogContent className="sm:py-[24px] py-16 sm:px-24 px-16">
					<Typography className="text-[#222222] sm:text-20 sm:mb-24 mb-16 text-16 sm:leading-[160%] leading-[140%] font-light">
						ログアウトしますか？
					</Typography>
					<Box className="text-center mt-24">
						<Button
							onClick={handleLogout}
							variant="contained"
							type="submit"
							color="primary"
							className="sm:w-[400px] w-full sm:text-20 text-16 py-[17px] px-0 leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
						>
							ログアウト
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	)
}

UserLayout.defaultProps = {
	maxWidth: 1000
}

UserLayout.propTypes = {
	headerTile: PropTypes.any,
	content: PropTypes.any,
	breadcrumbText: PropTypes.string,
	maxWidth: PropTypes.number
}

export default React.memo(UserLayout)

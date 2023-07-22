import { Box, Divider, IconButton, Icon, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'
import React, { memo, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { clearSession, getSocialUser } from '@Core/helper/Session'
import { useBoolean } from 'ahooks'
import { successMsg } from '@Core/helper/Message'
import Person from '@App/Social/assets/Person.svg'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

const HeaderPerson = () => {
	const user = getSocialUser()
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const el = useRef()

	useEffect(() => {
		window.addEventListener('scroll', () => setOpen(false))
		function handleClickOutside(event) {
			if (el.current && !el.current.contains(event.target)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			window.removeEventListener('scroll', () => {})
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleLogout = () => {
		setFalse()
		successMsg('ログアウトしました。')
		navigate(ROUTER_SOCIAL.event.event_top)
		clearSession()
	}

	const [openConfirmLogout, { setTrue, setFalse }] = useBoolean(false)
	const handleOpenModal = async () => {
		await setTrue()
	}
	const handleCloseModal = () => {
		setFalse()
	}

	return (
		<div ref={el}>
			<Box className="cursor-pointer ml-40 mt-2 lg:pr-[80px] sm:pr-[40px] pr-16" onClick={() => setOpen(!open)}>
				<IconButton
					size="small"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					color="primary"
				>
					<img src={Person} />
				</IconButton>
			</Box>

			<Box
				className={clsx(
					'z-9999 fixed sm:top-[62px] sm:right-[80px] top-0 right-0 bottom-0 shadow-4 sm:min-w-[300px] sm:w-auto w-[100%] sm:h-[370px] bg-white rounded-[10px] ease-out duration-200 origin-top-right',
					open ? 'scale-100' : 'scale-0'
				)}
			>
				<Box className="p-16">
					<Typography className="text-[16px] break-all font-semibold text-[#000000] ">{user?.name} 様</Typography>
				</Box>
				<Divider />

				<Typography
					className="text-[16px] px-16 pb-8 pt-16 text-[#000000] leading-[140%] cursor-pointer "
					onClick={() => navigate(ROUTER_SOCIAL.user.info) & setOpen(!open)}
				>
					マイページ
				</Typography>

				<Typography
					className="text-[16px] px-16 py-8 text-[#000000] leading-[140%] cursor-pointer "
					onClick={() => navigate(ROUTER_SOCIAL.questions) & setOpen(!open)}
				>
					よくある質問
				</Typography>

				<Typography
					className="text-[16px] px-16 py-8 text-[#000000] leading-[140%] cursor-pointer "
					onClick={() => navigate(ROUTER_SOCIAL.inquiry) & setOpen(!open)}
				>
					お問い合わせ
				</Typography>

				<Typography
					className="text-[16px] px-16 py-8 text-[#000000] leading-[140%] cursor-pointer "
					onClick={() => navigate(ROUTER_SOCIAL.privacy) & setOpen(!open)}
				>
					プライバシーポリシー
				</Typography>

				<Typography
					className="text-[16px] px-16 py-8 text-[#000000] leading-[140%] cursor-pointer "
					onClick={() => navigate(ROUTER_SOCIAL.cancellation) & setOpen(!open)}
				>
					キャンセルポリシー
				</Typography>

				<Typography
					className="text-[16px] px-16 pt-8 pb-16 text-[#000000] leading-[140%] cursor-pointer "
					onClick={() => navigate(ROUTER_SOCIAL.terms) & setOpen(!open)}
				>
					利用規約
				</Typography>
				<Divider />

				<Typography className="text-[16px] p-16 text-[#000000] leading-[140%] cursor-pointer " onClick={handleOpenModal}>
					ログアウト
				</Typography>
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
		</div>
	)
}

export default memo(HeaderPerson)

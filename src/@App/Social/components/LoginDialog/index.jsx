import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Typography,
	useMediaQuery
} from '@mui/material'
import { useBoolean } from 'ahooks'
import React, { useCallback, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate } from 'react-router-dom'
// import PropTypes from 'prop-types'

export const ShowLoginDialog = props => {
	const [open, { setTrue, setFalse }] = useBoolean(false)
	const [refreshData, setRefreshData] = useState(false)
	const navigate = useNavigate()

	const handleOpen = () => {
		setTrue()
	}

	const handleNavigateLogin = () => {
		navigate(ROUTER_SOCIAL.auth.login)
		setFalse()
	}

	const handleNavigateRegister = () => {
		navigate(ROUTER_SOCIAL.auth.register.profile)
		setFalse()
	}

	const handleClose = () => {
		setFalse()
	}

	const setDefaultRefreshData = () => {
		setRefreshData(false)
	}

	const isMobile = useMediaQuery('(max-width:600px)')

	const renderShowLoginDialog = useCallback(() => {
		return (
			<Dialog
				onClose={handleClose}
				open={open}
				maxWidth="md"
				fullWidth
				PaperProps={{
					style: {
						borderRadius: '20px',
						maxWidth: '800px'
					}
				}}
			>
				<DialogTitle className="py-[19px] px-16 p-0">
					<Box className="flex items-center">
						<IconButton onClick={() => handleClose()} className="p-0">
							<CloseOutlinedIcon color="primary" />
						</IconButton>
						<Typography className="mx-auto sm:text-[26px] text-16 font-semibold text-[#222222] leading-[140%]">
							ログイン・会員登録
						</Typography>
					</Box>
				</DialogTitle>
				<Divider />

				<DialogContent className='sm:py-[24px] py-16 sm:px-0 px-16'>

					<Typography className="text-center sm:text-[20px] text-[16px] sm:leading-[160%] leading-[140%] text-[#222222]">
						すでにアカウントをお持ちの方はこちら
					</Typography>

					<Box className="text-center sm:mt-16 mt-8">
						<Button
                        variant="outlined"
                        color="primary"
							className="sm:w-[400px] sm:text-[20px] sm:py-[12px] px-0 py-[17px] sm:leading-[160%] leading-[140%] w-full font-semibold border-solid border-1 rounded-[4px]"
							onClick={handleNavigateLogin}
						>
							ログインする
						</Button>
					</Box>
					<Typography className="mt-[24px] sm:text-[20px] text-[16px] sm:leading-[160%] leading-[140%] sm:text-center text-[#222222]">
						サービスのすべての機能を利用するには会員登録が必要です
					</Typography>
					<Box className="text-center sm:mt-16 mt-8">
						<Button
							variant="contained"
							color="primary"
							className="sm:w-[400px] w-full sm:text-20 text-16 sm:py-[12px] py-[17px] px-0 leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
							onClick={handleNavigateRegister}
						>
							新規会員登録する
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		)
	}, [open])
	return { handleOpen, handleClose, renderShowLoginDialog, setDefaultRefreshData, refreshData }
}

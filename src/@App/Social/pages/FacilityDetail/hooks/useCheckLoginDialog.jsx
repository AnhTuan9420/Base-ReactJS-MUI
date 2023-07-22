import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material'
import { useBoolean } from 'ahooks'
import React, { useCallback, useState } from 'react'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { useNavigate } from 'react-router-dom'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
// import PropTypes from 'prop-types'

export const useCheckLoginDialog = props => {
	const [open, { setTrue, setFalse }] = useBoolean(false)
	const [refreshData, setRefreshData] = useState(false)
	const navigate = useNavigate()

	const handleOpenDialog = () => {
		setTrue()
	}

	const handleClose = () => {
		setFalse()
	}

	const handleDataSuccess = val => {
		setRefreshData(val)
		handleClose()
	}

	const setDefaultRefreshData = () => {
		setRefreshData(false)
	}

	const renderCheckLoginDialog = useCallback(
		id => {
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
					<DialogTitle className="font-semibold py-[19px] px-16 p-0">
						<Box className="flex items-center">
							<IconButton onClick={() => handleClose()} className="p-0">
								<CloseOutlinedIcon color="primary" />
							</IconButton>
							<Typography className="mx-auto sm:text-[26px] text-16 font-semibold text-[#222222] leading-[140%]">
								会員限定の機能です
							</Typography>
						</Box>
					</DialogTitle>
					<Divider />

					<DialogContent className="sm:p-[24px] p-16 text-center">
						<Typography className="sm:text-[20px] text-start text-[16px] sm:leading-[160%] leading-[140%] text-[#222222]">
							この機能はログインしていないと使用できません。
							<br />
							ログイン・会員登録を行いますか？
						</Typography>
						<Button
							variant="contained"
							color="primary"
							className="sm:w-[400px] mt-24 h-56 sm:text-20 text-16 px-0 w-full rounded-[4px] shadow-none text-[#FFFFFF] font-semibold sm:py-12 py-[17px]"
							onClick={() => navigate(ROUTER_SOCIAL.auth.login)}
						>
							ログインする
						</Button>
						<Button
							variant="contained"
							color="primary"
							className="sm:w-[400px] mt-16 sm:text-20 text-16 w-full px-0 text-[#00A0E9] rounded-[4px font-semibold h-56 bg-white border-solid border-1 shadow-none sm:py-12 py-[17px]"
							onClick={() => navigate(ROUTER_SOCIAL.auth.register.profile)}
						>
							会員登録する
						</Button>
					</DialogContent>
				</Dialog>
			)
		},
		[open]
	)
	return { handleOpenDialog, handleClose, renderCheckLoginDialog, setDefaultRefreshData, refreshData }
}

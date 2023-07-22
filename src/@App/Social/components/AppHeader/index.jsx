import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import logoMobile from '@App/Social/assets/logoMobile.svg'
import logoFooter from '@App/Social/assets/logoFooter.svg'
import UserHeader from '../UserHeader'
import { useNavigate } from 'react-router-dom'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
// import PropTypes from 'prop-types'

const AppHeader = props => {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<Box>
			<AppBar position="sticky" className='bg-[#FFFFFF] shadow-none border-b-1 border-[#E0E0E0]'>
				<Toolbar className='justify-between p-0'>
					<Typography component="div" className='cursor-pointer text-[#BDBDBD]'>
						<img src={isMobile? logoMobile : logoFooter} alt="" className="text-[#E0E0E0] lg:pl-[80px] sm:pl-[40px] pl-16" onClick={() =>  navigate(ROUTER_SOCIAL.event.event_top)} />
					</Typography>
					<UserHeader />
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default React.memo(AppHeader)

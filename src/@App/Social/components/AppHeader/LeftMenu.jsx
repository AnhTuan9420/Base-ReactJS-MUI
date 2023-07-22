import { menuAboutUserConfig, menuAboutAppConfig, menuBeforeLoginConfig } from '@App/Social/configs/menuConfig'
import {
	Box,
	Icon,
	IconButton,
	List,
	SwipeableDrawer,
	Typography
} from '@mui/material'
import React from 'react'
import LeftMenuItem from './components/LeftMenuItem'
import { getSocialUser, getToken } from '@Core/helper/Session'

const LeftMenu = props => {
	const { open, setOpen } = props
	const token = getToken()
	const user = getSocialUser()

	const renderListMenu = () => {
		return (
			<Box className='bg-[#F9F9F9] h-full'>
				<Box className="mt-12 sm:mb-[80px] mb-[40px]">
					<IconButton className='float-right' onClick={() => setOpen(false)}>
						<Icon>close</Icon>
					</IconButton>
				</Box>
				<Box
					sx={{
						width: {
							sm: 360,
							xs: 320
						}
					}}
					className=" bg-[#F9F9F9]"
					role="presentation"
					onClick={() => setOpen(false)}
					onKeyDown={() => setOpen(false)}
				>
					{token ? (
						<Box>
							<List>
								<Box className='sm:mb-[60px] mb-20'>
									<Typography className='py-[10px] ml-[16px] font-bold'>{user?.name} 様</Typography>
									{menuAboutUserConfig.map((item, index) => {
										return <LeftMenuItem className='bg-white' key={index} item={item} />
									})}
								</Box>
							</List>
						</Box>
					) : (
						<Box>
							<List>
								<Box className='sm:mb-[60px] mb-20'>
									<Typography className='py-[10px] ml-[16px]'>メインメニュー</Typography>
									{menuBeforeLoginConfig.map((item, index) => {
										return <LeftMenuItem className='bg-white' key={index} item={item} />
									})}
								</Box>
							</List>
						</Box>
					)}
				</Box>

				<Box
					sx={{
						width: {
							sm: 360,
							xs: 320
						}
					}}
					className=" bg-[#F9F9F9]"
					role="presentation"
					onClick={() => setOpen(false)}
					onKeyDown={() => setOpen(false)}
				>

					<Box>
						<List>
							<Box className=''>
								<Typography className='py-[10px] ml-[16px]'>このアプリについて</Typography>
								<Box>
									{menuAboutAppConfig.map((item, index) => {
										return <LeftMenuItem className='bg-white' key={index} item={item} />
									})}
								</Box>
							</Box>
						</List>
					</Box>
				</Box>
			</Box>
		)
	}

	return (
		<SwipeableDrawer anchor="left" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
			{renderListMenu()}
		</SwipeableDrawer>
	)
}

export default React.memo(LeftMenu)

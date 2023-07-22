import CoreDialog from '@Core/components/Dialog/CoreDialog'
import { useBoolean } from 'ahooks'
import { useCallback } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FacilityImageSlide from '../components/FacilityImageSlide'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

export const useImageModal = () => {
	const [open, { setTrue, setFalse }] = useBoolean()

	const render = useCallback(
		images => {
			return (
				<Dialog
					onClose={setFalse}
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
					<DialogTitle className="sm:p-24 p-16">
						<Box className="flex items-center">
							<IconButton onClick={() => setFalse()} className="p-0">
								<CloseOutlinedIcon color="primary" />
							</IconButton>
							<Typography className="mx-auto sm:text-[26px] text-16 font-semibold text-[#222222] leading-[140%]">
								写真
							</Typography>
						</Box>
					</DialogTitle>

					<DialogContent className="p-0">
						<FacilityImageSlide data={images} />
						<Box className="sm:p-24 p-16 items-center text-center sm:h-80 h-[54px]">
							<Typography className='text-[#222222] sm:text-20 text-16'></Typography>
						</Box>
					</DialogContent>
				</Dialog>
			)
		},
		[open]
	)

	return { onOpen: setTrue, render }
}

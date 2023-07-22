import { hideLoadingPage, showLoadingPage } from '@Core/helper/System'
import { useTheme } from '@mui/material/styles'
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
	useMediaQuery
} from '@mui/material'
import { useBoolean, useRequest } from 'ahooks'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Divider from '@mui/material/Divider'
import React, { useCallback, useEffect, useState } from 'react'
import { tagService } from '@App/Social/services/tagService'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { getDataSession, setDataSession } from '@Core/helper/Session'

const checkTag = (tag, tagArr) => {
	const index = tagArr.findIndex(t => t.id === tag?.id)
	if (index !== -1) return true
	return false
}

export const useSearchDialog = searchTags => {
	const theme = useTheme()
	const [open, { setTrue, setFalse }] = useBoolean()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
	const [chooseTags, setChooseTags] = useState(searchTags ?? [])
	const [addTags, setAddTags] = useState(searchTags ?? [])
	const isMobile = useMediaQuery('(max-width:600px)')

	const {
		data: tags,
		run: getTags,
		loading: loadingTags
	} = useRequest(tagService.getListTagList, {
		manual: true
	})
	useEffect(() => {
		getTags()
	}, [])

	const handleOpenSearchDialog = async () => {
		showLoadingPage()
		setTrue()
		hideLoadingPage()
	}

	const handleCloseSearchDialog = () => {
		setFalse()
	}

	const handleAddTag = tag => {
		const index = chooseTags?.findIndex(t => t === tag)
		if (index === -1) {
			setChooseTags([...chooseTags, tag])
		} else {
			const newChooseTags = chooseTags?.filter(t => t !== tag)
			setChooseTags(newChooseTags)
		}
	}

	const handleDeleteTag = tag => {
		let tags = getDataSession('session', 'tags')
		const index = tags?.findIndex(t => t.id === tag.id)
		if (index && index !== -1) {
			setDataSession(
				'session',
				'tags',
				tags?.filter(t => t?.id !== tag?.id)
			)
		}
		setChooseTags(prev => {
			const tags = prev.filter(t => t?.id !== tag?.id)
			return [...tags]
		})
	}
	const handleClose = () => {
		setFalse()
	}

	const renderSearchDialog = useCallback(() => {
		return (
			<Dialog
				onClose={handleCloseSearchDialog}
				open={open}
				maxWidth="md"
				fullWidth
				fullScreen={fullScreen}
				className="mt-48"
				sx={
					fullScreen
						? { '& .MuiPaper-root': { borderRadius: '20px 20px 0 0' } }
						: { '& .MuiPaper-root': { borderRadius: '20px 20px 20px 20px', maxWidth: '800px' } }
				}
			>
				<DialogTitle className="font-bold text-center sm:px-24 px-16">
					<IconButton onClick={() => handleClose()} className="float-left">
						<CloseOutlinedIcon color="primary" />
					</IconButton>
					<Typography className="sm:text-[26px] not-italic text-20 font-semibold sm:leading-[140%] text-[#000000]">
						タグを選択
					</Typography>
					{isMobile ? (
						<Typography
							className="text-start sm:text-20 text-16 sm:pt-16 pt-8 sm:pb-[3px] not-italic sm:leading-[160%] leading-[140%] text-[#000000] font-light"
							style={{
								marginBlockStart: '1px'
							}}
						>
							タグをタップすると選択できます。
							<br />
							選択したタグを解除したい際は再度タグをタップしてください。
						</Typography>
					) : (
						<Typography className="text-start sm:text-20 text-16 sm:pt-16 pt-8 sm:pb-[3px] not-italic sm:leading-[160%] leading-[140%] text-[#000000] font-light">
							タグをタップすると選択できます。 <br />
							選択したタグを解除したい際は再度タグをタップしてください。 <br />
							タグは複数選択可能です。
						</Typography>
					)}
				</DialogTitle>
				<Divider />
				<DialogContent className="sm:py-24 py-16 sm:px-24 px-16">
					<Box className="flex flex-wrap">
						{loadingTags ? (
							<div className="mx-auto">
								<CircularProgress />
							</div>
						) : (
							tags?.map((tag, index) => (
								<Chip
									label={`#${tag?.name}`}
									color="secondary"
									key={index}
									variant={checkTag(tag, chooseTags) ? 'filled' : 'outlined'}
									onClick={handleAddTag.bind(this, tag)}
									className={
										checkTag(tag, chooseTags)
											? 'text-white text-16 sm:mr-16 mr-8 sm:mb-14 mb-16 bg-[#00A0E9]'
											: 'text-16 sm:mr-16 mr-8 sm:mb-14 mb-16'
									}
									onDelete={
										checkTag(tag, chooseTags)
											? checkTag(tag, chooseTags)
												? handleDeleteTag.bind(this, tag)
												: () => {}
											: null
									}
									deleteIcon={<CloseRoundedIcon fontSize="small" className="text-white" />}
								/>
							))
						)}
					</Box>
				</DialogContent>
				<Divider />
				<DialogActions className="p-0">
					<Box className="sm:flex items-center w-full justify-between">
						{chooseTags?.length > 0 ? (
							<Box className="flex sm:pl-24 sm:py-[36px] sm:pt-36 pt-16 justify-center">
								<Typography className="sm:text-[20px] text-[16px] not-italic text-[#000000] mr-16 font-semibold">
									選択中のタグ
								</Typography>{' '}
								<Typography className="sm:text-[20px] text-[16px] not-italic mr-4 font-light text-[#000000]">
									{chooseTags?.length}
								</Typography>
								<Typography className="sm:text-[20px] text-[16px] not-italic font-light text-[#000000]">
									件
								</Typography>
							</Box>
						) : (
							<Box></Box>
						)}
						<Box className="py-0 p-[0] justify-end items-end sm:py-[24px] pt-16 sm:pl-0 pl-16 pb-32 pr-16 sm:pr-[24px]">
							<Button
								variant="contained"
								color="primary"
								size="large"
								fullWidth
								onClick={() => {
									setAddTags(chooseTags)
									// setDataSession('session', 'tags', addTags )
									setFalse()
								}}
								className="shadow-none sm:text-[20px] h-56 text-[16px] w-full sm:w-[200px] px-0 sm:py-12 py-[17px]"
							>
								保存
							</Button>
						</Box>
					</Box>
				</DialogActions>
			</Dialog>
		)
	}, [open, fullScreen, chooseTags, loadingTags])

	return { handleOpenSearchDialog, handleCloseSearchDialog, renderSearchDialog, addTags }
}

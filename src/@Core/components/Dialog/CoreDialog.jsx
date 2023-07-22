import { Icon, IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const CoreDialog = props => {
	const {
		open,
		dialogAction,
		dialogStyle,
		maxWidth,
		PaperPropsStyle,
		dialogTitle,
		dialogTitleClassName,
		dialogCloseButtonClassName,
		dialogContent,
		dialogContentStyle,
		DialogProps,
		DialogTitleProps,
		handleClose,
		DialogContentProps,
		dialogActionClassName,
		dialogContentClassName,
		...restProps
	} = props

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			PaperProps={{
				style: {
					// minWidth: 400,
					...PaperPropsStyle
				}
			}}
			style={dialogStyle}
			fullWidth
			maxWidth={maxWidth}
			{...DialogProps}
			{...restProps}
		>
			{dialogTitle && (
				<DialogTitle
					sx={{
						fontSize: 18
					}}
					className={clsx('text-center uppercase', dialogTitleClassName)}
					{...DialogTitleProps}
				>
					{dialogTitle}
				</DialogTitle>
			)}
			<DialogContent
				className={clsx('custom-dialog-content', dialogContentClassName)}
				{...DialogContentProps}
				style={dialogContentStyle}
			>
				{dialogContent}
			</DialogContent>
			{dialogAction && (
				<DialogActions className={clsx('shadow', dialogActionClassName)}>{dialogAction}</DialogActions>
			)}
			{handleClose && (
				<div className="absolute top-0 right-0">
					<IconButton className={clsx('', dialogCloseButtonClassName)} onClick={handleClose}>
						<Icon fontSize="small">close</Icon>
					</IconButton>
				</div>
			)}
		</Dialog>
	)
}
CoreDialog.defaultProps = {
	handleClose: undefined,
	open: false,
	dialogTitle: null,
	dialogTitleClassName: null,
	dialogCloseButtonClassName: null,
	dialogContentClassName: null,
	dialogContent: 'Content',
	dialogContentStyle: {},
	dialogStyle: {},
	PaperPropsStyle: {},
	DialogProps: {},
	DialogTitleProps: {},
	maxWidth: 'xs'
}
CoreDialog.propTypes = {
	open: PropTypes.bool,
	dialogTitle: PropTypes.node,
	dialogContent: PropTypes.node,
	dialogAction: PropTypes.node,
	handleClose: PropTypes.func,
	dialogTitleClassName: PropTypes.string,
	dialogCloseButtonClassName: PropTypes.string,
	dialogContentStyle: PropTypes.object,
	dialogContentClassName: PropTypes.string,
	dialogStyle: PropTypes.object,
	PaperPropsStyle: PropTypes.object,
	DialogProps: PropTypes.object,
	DialogTitleProps: PropTypes.object,
	maxWidth: PropTypes.string,
	DialogContentProps: PropTypes.object,
	dialogActionClassName: PropTypes.string
}
export default memo(CoreDialog)

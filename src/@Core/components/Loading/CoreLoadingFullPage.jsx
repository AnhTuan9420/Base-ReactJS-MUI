import { CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'

const useStyles = makeStyles(theme => ({
	loadingPage: {
		display: 'none',
		position: 'fixed',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 99999999
	},
	loadingPageContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		minHeight:'60vh',
		justifyContent: 'center',
		background: 'rgba(238, 238, 238, 0.4)'
	},
	loading: {
		textAlign: 'center'
	}
}))
export const CoreLoadingFullPage = props => {
	const classes = useStyles()
	return (
		<div className={classes.loadingPage} id="loading-page">
			<div className={classes.loadingPageContent}>
				<CircularProgress {...props.loadingProps} />
			</div>
		</div>
	)
}

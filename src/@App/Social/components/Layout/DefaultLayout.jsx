import { Box, CircularProgress } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { Outlet,useLocation } from 'react-router-dom'
import AppFooter from '../AppFooter'
import AppHeader from '../AppHeader'
// import PropTypes from 'prop-types'
const TraveloLayouContext = React.createContext()

export const useTraveloLayoutContext = () => useContext(TraveloLayouContext)

const DefaultLayout = props => {
	const location = useLocation()
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [location.pathname])

	return (
		<TraveloLayouContext.Provider value={props}>
			<Box className="flex flex-col h-screen">
				<AppHeader className='bg-white' />
				<div className="app-content bg-white">
					<React.Suspense
						fallback={
							<div className="mt-200 text-center min-h-[80vh]">
								<CircularProgress />
							</div>
						}
					>
						<Outlet />
					</React.Suspense>
				</div>
				<AppFooter />
			</Box>
		</TraveloLayouContext.Provider>
	)
}

//DefaultLayout.defaultProps = {}

//DefaultLayout.propTypes = {}

export default React.memo(DefaultLayout)

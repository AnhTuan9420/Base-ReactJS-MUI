import React from 'react'
import CoreAppTheme from '../@Core/components/CoreAppTheme'
// import PropTypes from 'prop-types'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import { appRouterConfig } from './appConfig'
import { ToastContainer } from 'react-toastify'
import CoreAuthProvider from '@Core/components/Provider/CoreAuthProvider'
import { CoreConfirmProvider } from '@Core/components/Confirm/CoreConfirm'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { CoreLoadingFullPage } from '@Core/components/Loading/CoreLoadingFullPage'

// Create the function
export function AddLibrary(urlOfTheLibrary) {
	const script = document.createElement('script')
	script.src = urlOfTheLibrary
	script.async = true
	document.body.appendChild(script)
}
const App = props => {
	return (
		<CoreAppTheme>
			<CoreConfirmProvider>
				<CoreAuthProvider>
					<RouterProvider router={appRouterConfig} />
					<ToastContainer />
					<CoreLoadingFullPage />
					{AddLibrary('https://js.elepay.io/v1/elepay.js')}
				</CoreAuthProvider>
			</CoreConfirmProvider>
		</CoreAppTheme>
	)
}

//App.defaultProps = {}

//App.propTypes = {}

export default React.memo(App)

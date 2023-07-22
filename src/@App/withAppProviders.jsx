// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { StyledEngineProvider } from '@mui/material/styles'

import jaLocale from 'date-fns/locale/ja'

import { useState } from 'react'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import AppContext from './AppContext'

const withAppProviders = Component => props => {
	const WrapperComponent = () => {
		const [error, setError] = useState(false)
		return (
			<AppContext.Provider
				value={{
					error,
					setError
				}}
			>
				<LocalizationProvider dateAdapter={AdapterDateFns} locale={jaLocale}>
					<StyledEngineProvider injectFirst>
						<Component {...props} />
					</StyledEngineProvider>
				</LocalizationProvider>
			</AppContext.Provider>
		)
	}

	return WrapperComponent
}

export default withAppProviders

import React from 'react'
import ReactDOM from 'react-dom/client'
import './@system/i18n'

import '@fontsource/noto-sans-jp'
import '@fontsource/noto-sans-jp/400.css'
import '@fontsource/noto-sans-jp/700.css'
import './styles/base.css'
import App from './@App/App'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)

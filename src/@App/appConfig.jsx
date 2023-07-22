import { createBrowserRouter } from 'react-router-dom'

import DefaultLayout from './Social/components/Layout/DefaultLayout'
import { routerTraveloConfig } from './Social/configs/routerConfig'
import Page404 from './Social/pages/Error/Page404'

export const appRouterConfig = createBrowserRouter([
	{
		path: '/',
		element: <DefaultLayout />,
		// errorElement: <Page404 />,
		children: [
			...routerTraveloConfig,
			{
				path: '/*',
				element: <Page404 />
			}
		]
	},
	{
		path: '/*',
		element: <Page404 />
	}
])

const fuseDark = {
	50: '#e5e6e8',
	100: '#bec1c5',
	200: '#92979f',
	300: '#666d78',
	400: '#464e5b',
	500: '#252f3e',
	600: '#212a38',
	700: '#1b2330',
	800: '#161d28',
	900: '#0d121b',
	A100: '#5d8eff',
	A200: '#2a6aff',
	A400: '#004af6',
	A700: '#0042dd',
	contrastDefaultColor: 'light'
}

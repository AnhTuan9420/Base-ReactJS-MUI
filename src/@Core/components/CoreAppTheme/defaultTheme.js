import { createTheme } from '@mui/material/styles'
import { lightBlue, red } from '@mui/material/colors'

// Create a theme instance.
const defaultTheme = createTheme({
	palette: {
		primary: {
			main: '#00A0E9',
			contrastText:'#fff'
		},
		secondary: {
			main: '#00A0E9',
			contrastText:'#fff'
		},
		third: {
			main: '#E7E7D6'
		},
		accent: {
			main: '#FF4E02'
		},
		mission: {
			main: '#FF7438'
		},
		error: {
			main: '#E50000'
		},
		info: {
			main: '#333333'
		}
	},
	status: {
		danger: 'orange'
	},
	typography: {
		fontFamily: ['Hiragino Sans'].join(','),
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		htmlFontSize: 10,
		fontSize: 13,
		h1: {
			fontSize: '2.2rem',
			fontWeight: 700
		},
		h2: {
			fontSize: '2rem',
			fontWeight: 700
		},
		h3: {
			fontSize: '1.8rem',
			fontWeight: 700
		},
		h4: {
			fontSize: '1.6rem',
			fontWeight: 700
		},
		h6: {
			fontSize: '1.4rem',
			fontWeight: 700
		},
		subtitle1: {
			fontSize: '1.5rem',
			fontWeight: 700
		},
		subtitle2: {
			fontSize: '1.4rem',
			fontWeight: 700
		},
		body1: {
			fontSize: '1.6rem',
			fontWeight: 400
		},
		body2: {
			fontSize: '1.4rem',
			fontWeight: 700
		},
		body3: {
			fontSize: '1.4rem',
			fontWeight: 400
		},
		caption: {
			fontSize: '1.2rem'
		}
	},
	components: {
		// MuiTypography: {
		// 	styleOverrides: {
		// 		root: {
		// 			margin: 'unset'
		// 		}
		// 	}
		// }
	}
})

export default defaultTheme

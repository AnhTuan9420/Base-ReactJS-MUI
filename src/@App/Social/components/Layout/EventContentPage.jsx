import { Typography, useMediaQuery } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import CoreBreadcrumb from '@Core/components/CoreBreadcrumb'
import { routerTraveloConfig } from '@App/Social/configs/routerConfig'

const EventContentPage = props => {
	const { t } = useTranslation()
	const { header, content, hasBreadcrumb, pageClassName, maxWidth, auth, minHeight, status } = props

	return (
		<Box className={auth ? 'bg-[#f7fcfe]': pageClassName}>
			{hasBreadcrumb && (
				<Box sx={{ maxWidth: `${maxWidth}px` }} className={`w-full sm:w-[80%] lg:w-['${maxWidth}px'] mx-auto sm:text-16 text-14 font-light sm:pt-[26px] pt-16 sm:pl-0 pl-16`}>
					<CoreBreadcrumb status={status} routes={routerTraveloConfig} />
				</Box>
			)}

			{header && <Box className="w-full bg-[#F9F9F9]">{header}</Box>}
			<Box sx={{ maxWidth: `${maxWidth}px` }} className={minHeight ? `w-full sm:w-[80%] lg:w-['${maxWidth}px'] mx-auto min-h-[auto]` : `w-full sm:w-[80%] lg:w-['${maxWidth}px'] mx-auto min-h-[80vh]`}>
				{content}
			</Box>
		</Box>
	)
}

EventContentPage.defaultProps = {
	// header: 'Header',
	// content: 'Content'
	hasBreadcrumb: true,
	// maxWidth:1200
}

EventContentPage.propTypes = {
	header: PropTypes.any,
	content: PropTypes.any,
	hasBreadcrumb: PropTypes.bool,
	maxWidth:PropTypes.number
}

export default React.memo(EventContentPage)

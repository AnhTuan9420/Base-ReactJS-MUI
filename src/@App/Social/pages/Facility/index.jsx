import { CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { facilityService } from '@App/Social/services/facilityService'
import FacilityList from './FacilityList'
import { useLocation, useSearchParams } from 'react-router-dom'
import { getDataSession } from '@Core/helper/Session'

const HomePage = props => {
	const state = useLocation()
	const tags = getDataSession('session', 'tags') ?? []
	const facility_type = state?.state ?? ''

	const {
		data: facility,
		run: getFacility,
		loading: loadingFacility
	} = useRequest(facilityService.getListFacility, {
		manual: true
	})

	return <FacilityList facility={facility} getFacility={getFacility} loadingFacility={loadingFacility} tags={tags} facility_type={facility_type} />
}

export default React.memo(HomePage)

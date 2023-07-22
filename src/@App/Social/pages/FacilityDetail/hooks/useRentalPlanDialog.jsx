import { facilityService } from '@App/Social/services/facilityService'
import { useRequest } from 'ahooks'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useRentalPlan = props => {
	let [searchParams] = useSearchParams()

	const id = searchParams.get('facility_id')

	const {
		data: rentalPlan,
		run: getRentalPlan,
		loading: loadingRentalPlan
	} = useRequest(facilityService.getRentalPlan, {
		manual: true,
	})

	useEffect(() => {
		if (id) {
			getRentalPlan(id)
		}
	}, [id])

	return { rentalPlan: rentalPlan, getRentalPlan, loadingRentalPlan }
}

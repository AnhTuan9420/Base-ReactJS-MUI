import { authService } from '@App/Social/services/authService'
import { facilityService } from '@App/Social/services/facilityService'
import { useRequest } from 'ahooks'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'
import { setDataSession } from '@Core/helper/Session'

export const useFacilityDetail = initDate => {
	const navigate = useNavigate()
	let [searchParams] = useSearchParams()

	const id = searchParams.get('facility_id')
	const email = searchParams.get('email')
	const password = searchParams.get('password')

	const {
		data: facilityDetail,
		run: getFacilityDetail,
		loading
	} = useRequest(facilityService.facilityDetail, {
		manual: true
	})

	const { data: timeBookingDetail, run: getTimeBookingDetail } = useRequest(facilityService.timeBookingFacility, {
		manual: true
	})

	if (email && password) {
		const dataSubmit = {
			email: email,
			password: password
		}
		const fetchDatalogin = async () => {
			try {
				const res = await authService.login(dataSubmit)
				setDataSession('local', 'social_user', {
					id: res?.account?.id,
					email: res?.account?.email,
					name: res?.account?.name
				})
				Cookies.set('token', res?.account?.idToken, { expires: 1 / 24 })
				Cookies.set('refresh_token', res?.account?.refreshToken, { expires: 1 })
				navigate(`${ROUTER_SOCIAL.event.detail}/?facility_id=${id}`)
			} catch (error) {
				console.log(error)
			}
		}
		fetchDatalogin()
	}

	useEffect(() => {
		if (id) {
			getFacilityDetail(id)
		}
	}, [id])

	useEffect(() => {
		if (id && initDate) {
			getTimeBookingDetail(id, initDate)
		}
	}, [id, initDate])

	return {
		facilityDetail: facilityDetail,
		timeBookingDetail: timeBookingDetail,
		getTimeBookingDetail,
		getFacilityDetail,
		loading
	}
}

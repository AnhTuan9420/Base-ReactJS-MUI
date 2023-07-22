import React, { useMemo } from 'react'

const useDisableDate = disableDates => {
	const hiddenDates = useMemo(() => {
		const data = []

		for (const item of disableDates) {
			item[Object.keys(item)[0]]?.map(time => {
				data.push(new Date(`${Object.keys(item)[0]} ${time}`))
			})
		}

		return data
	}, [disableDates])

	return [hiddenDates]
}

export default useDisableDate

import { CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { useRequest } from 'ahooks'
import ListFavoriteContent from './ListFavoriteContent'
import { facilityService } from '@App/Social/services/facilityService'

const ListFavorite = props => {
	const {
		data: listFavorite,
		runAsync: getFavorite,
		loading: loadingFavorite,
		refresh
	} = useRequest(facilityService.getListFavorite, {
		manual: true
	})

	return <ListFavoriteContent refresh={refresh} loadingFavorite={loadingFavorite} listFavorite={listFavorite} getFavorite={getFavorite} />
}

export default React.memo(ListFavorite)

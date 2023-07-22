import React, { useEffect } from 'react'
import { useRequest } from 'ahooks'
import ListHistory from './ListHistory'
import { historyService } from '@App/Social/services/historyService'

const GetListHistory = props => {
	const {
		data: listHistory,
		run: getHistoryList,
		loading
	} = useRequest(historyService.listHistory, {
		manual: true
	})
	
	return <ListHistory listHistory={listHistory} loading={loading} getHistoryList={getHistoryList} />
	
}

export default React.memo(GetListHistory)

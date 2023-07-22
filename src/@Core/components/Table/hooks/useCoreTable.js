import { DEFAULT_PAGE_SIZE } from '@App/core/constants'
import { useTranslation } from 'next-i18next'
import { useCallback, useMemo } from 'react'
import { useConfirm } from '../../Confirm/CoreConfirm'

let params = {
	size: DEFAULT_PAGE_SIZE
}
const useCoreTable = (requestFetchData, options = { isQueryUrl: true, tableId: '', page: 1, size: 10 }) => {
	const { t } = useTranslation('common')
	const baseConfigs = useMemo(
		() => ({
			isQueryUrl: true,
			deleteConfirmMsg: t('table.delete_confirm'),
			onConfirmDelete: async () => {},
			...options
		}),
		[options]
	)

	const { data, loading, run } = requestFetchData
	// const [queryUrl, setQueryUrl] = useUrlState()
	const handleFetchData = useCallback(query => {
		params = {
			...params,
			...query
		}
		return run(params)
	}, [])

	return {
		...data,
		pageIndex: data?.current_page ? data?.current_page - 1 : 0,
		pageSize: data?.per_page ?? 10,
		loading,
		handleFetchData
	}
}

export default useCoreTable

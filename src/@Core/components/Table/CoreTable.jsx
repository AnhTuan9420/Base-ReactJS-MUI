// import TableHeader from '@crema/core/AppTable/TableHeader'
import { CircularProgress, Table, TableContainer, TablePagination } from '@mui/material'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useUpdateEffect } from 'ahooks'

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import CoreTableBody from './components/CoreTableBody'
import CoreTableHead from './components/CoreTableHead'
import CoreTableToolbar from './components/CoreTableToolbar'
// import PropTypes from 'prop-types'
const CoreTableContext = React.createContext()

export const useCoreTableContext = () => useContext(CoreTableContext)

export const columnHelper = createColumnHelper()
const CoreTable = ({
	data = [],
	columns = [],
	total = 0,
	isShowPagination = false,
	pageSize = 10,
	pageIndex = 1,
	handleFetchData = () => {},
	loading = false,
	...restProps
}) => {
	const { t } = useTranslation('common')
	const rerender = React.useReducer(() => ({}), {})[1]
	const defaultData = React.useMemo(() => [], [])

	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize
		}),
		[pageIndex, pageSize]
	)

	const table = useReactTable({
		data: data ?? defaultData,
		columns,
		pageCount: total,
		getCoreRowModel: getCoreRowModel(),
		state: {
			pagination
		},
		// onPaginationChange: setPagination,
		manualPagination: true,
		debugTable: true
	})

	useUpdateEffect(() => {
		// console.log('============= table', table.setCo())
		// rerender()
	}, [columns])

	return (
		<CoreTableContext.Provider value={{ table, t }}>
			<CoreTableToolbar handleFetchData={handleFetchData} />
			<TableContainer
				className="relative"
				sx={{
					'& tr > th, & tr > td': {
						whiteSpace: 'nowrap'
					}
				}}
			>
				<Table sx={{ minWidth: 650 }} stickyHeader className="table">
					<CoreTableHead table={table} columns={columns} />
					<CoreTableBody table={table} />
				</Table>
				{loading && (
					<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-99 table-loading">
						<CircularProgress />
					</div>
				)}
			</TableContainer>
			{isShowPagination && (
				<TablePagination
					component="div"
					classes={{
						root: 'flex-shrink-0'
					}}
					rowsPerPageOptions={[5, 10, 20, 50]}
					colSpan={5}
					count={total ?? 0}
					rowsPerPage={pageSize}
					page={pageIndex}
					SelectProps={{
						inputProps: { 'aria-label': 'rows per page' },
						native: false
					}}
					lang="vi"
					labelRowsPerPage={t('table.row_per_page')}
					onPageChange={(event, newPage) => {
						handleFetchData({ page: newPage + 1 })
					}}
					onRowsPerPageChange={event => {
						handleFetchData({ size: Number(event.target.value) })
					}}
				/>
			)}
		</CoreTableContext.Provider>
	)
}

//CoreTable.defaultProps = {}

//CoreTable.propTypes = {}

export default React.memo(CoreTable)

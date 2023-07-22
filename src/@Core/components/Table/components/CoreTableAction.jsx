import { IconButton, Tooltip, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { BiEdit, BiShow, BiTrash } from 'react-icons/bi'

export const CoreActionEdit = ({ onClick = () => {}, disabled = false }) => {
	const { t } = useTranslation('common')
	if (disabled) {
		return (
			<IconButton disabled className="text-sm" color="primary">
				<BiEdit />
			</IconButton>
		)
	}
	return (
		<Tooltip title={t('btn.edit')}>
			<IconButton onClick={onClick} className="text-sm" color="primary">
				<BiEdit />
			</IconButton>
		</Tooltip>
	)
}

export const CoreActionView = ({ onClick = () => {}, title = null, placement }) => {
	const { t } = useTranslation('common')
	const theme = useTheme()
	return (
		<Tooltip title={title ?? t('btn.view')} placement={placement}>
			<IconButton style={{ color: theme.palette.success.main }} onClick={onClick}>
				<BiShow />
			</IconButton>
		</Tooltip>
	)
}

export const CoreActionDelete = ({ onClick = () => {}, disabled = false }) => {
	const { t } = useTranslation('common')
	if (disabled) {
		return (
			<IconButton onClick={onClick} className="text-sm" color="secondary" disabled={disabled}>
				<BiTrash />
			</IconButton>
		)
	}
	return (
		<Tooltip title={t('btn.delete')}>
			<IconButton onClick={onClick} className="text-sm" color="secondary">
				<BiTrash />
			</IconButton>
		</Tooltip>
	)
}

import { Collapse, Divider, Icon, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { ArrowRight, ArrowRightAlt, ExpandLess, ExpandMore } from '@mui/icons-material'
import LeftMenuItem from './LeftMenuItem'
import { useLocation } from 'react-router-dom'

const needsToBeOpened = (pathname, item) => {
	return pathname && isUrlInChildren(item, pathname)
}

const isUrlInChildren = (parent, url) => {
	if (!parent.children) {
		return false
	}

	for (let i = 0; i < parent.children.length; i++) {
		if (parent.children[i].children) {
			if (isUrlInChildren(parent.children[i], url)) {
				return true
			}
		}

		if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
			return true
		}
	}

	return false
}

const LeftMenuItemCollapse = props => {
	const { item } = props
	// const [open, setOpen] = useState(false)
	const { pathname } = useLocation()
	const [open, setOpen] = useState(() => needsToBeOpened(pathname, item))

	useEffect(() => {
		if (needsToBeOpened(pathname, item)) {
			setOpen(true)
		}
	}, [pathname, item])

	const handleToggleMenuChildren = e => {
		e.stopPropagation()
		setOpen(!open)
	}

	const renderChildrenMenu = () => {
		if (Array.isArray(item.children) && item.children.length > 0) {
			return (
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="nav">
						{item.children.map((_item, index) => {
							return <LeftMenuItem item={_item} key={index} sx={{ pl: 2 }} />
						})}
					</List>
				</Collapse>
			)
		}
	}

	return (
		<>
			<ListItemButton onClick={handleToggleMenuChildren}>
				<ListItemText primary={<Typography variant="body2">{item?.title}</Typography>} />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Divider />
			{renderChildrenMenu()}
		</>
	)
}

//LeftMenuItemCollapse.defaultProps = {}

//LeftMenuItemCollapse.propTypes = {}

export default React.memo(LeftMenuItemCollapse)

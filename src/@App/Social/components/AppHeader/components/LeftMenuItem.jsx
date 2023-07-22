import { useFirebaseAuthContext } from '@Core/components/Provider/FirebaseAuthProvider'
import { Collapse, Divider, Icon, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
// import PropTypes from 'prop-types'

const LeftMenuItem = props => {
	const { item, color, ...resProps } = props
	// console.log('============= item', item)
	const navigate = useNavigate()
	const match = useMatch(item.url ?? '/')
	// console.log('============= match', match)
	const handleClickMenu = url => {
		if (url) navigate(url)
	}

	// if (!checkPermission(item?.role, authRole)) return null

	return (
		<>
			<ListItem
				disablePadding
				secondaryAction={<Icon>navigate_next</Icon>}
				onClick={() => handleClickMenu(item?.url)}
				// components={NavLink}
				selected={Boolean(match)}
				{...resProps}
			>
				{match?.pattern?.end === true ? (
					<ListItemButton className='bg-[#e6f2f7]'>
					
					<ListItemText
						primary={
							<Box className="flex">
								<Typography variant="body1">{item?.title}</Typography>
								{item?.bagde}
							</Box>
						}
					/>
				</ListItemButton>
				) : (
					<ListItemButton>
					
					<ListItemText
						primary={
							<Box className="flex">
								<Typography variant="body1">{item?.title}</Typography>
								{item?.bagde}
							</Box>
						}
					/>
				</ListItemButton>
				)}
			</ListItem>
			<Divider />
		</>
	)
}

//LeftMenuItem.defaultProps = {}

//LeftMenuItem.propTypes = {}

export default React.memo(LeftMenuItem)

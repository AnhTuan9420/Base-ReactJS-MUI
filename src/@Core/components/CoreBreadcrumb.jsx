import { Box, Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
// import PropTypes from 'prop-types'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Link } from 'react-router-dom'
import { ROUTER_SOCIAL } from '@App/Social/configs/constants'

const CoreBreadcrumb = props => {
	const { routes, status } = props
	const breadcrumbs = useBreadcrumbs(routes)

	return (
		<Breadcrumbs separator={null} aria-label="breadcrumb" sx={{ '.MuiBreadcrumbs-separator': { marginX: '0px' } }}>
			{breadcrumbs?.map(({ match, breadcrumb }) => {
				return match.pathname === '/event-detail' || match.pathname === '/detail-notification' ? (
					''
				) : (
					<Box className="flex flex-wrap ">
						{match.pathname === ROUTER_SOCIAL.event.favorite ? (
							<Box className="flex">
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.event.event_top}
								>
									トップ
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								<Typography className="text-[#222222] sm:text-16 text-14 font-light">
									{breadcrumb}
								</Typography>
							</Box>
						) : null}
						{match.pathname === ROUTER_SOCIAL.event.history ? (
							<Box className="flex">
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.event.event_top}
								>
									トップ
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								<Typography className="text-[#222222] sm:text-16 text-14 font-light">
									{breadcrumb}
								</Typography>
							</Box>
						) : null}
						{match.pathname === ROUTER_SOCIAL.event.history_detail ? (
							<Box className="flex">
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.event.event_top}
								>
									トップ
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.event.history}
								>
									利用履歴
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								{status && status === '予約中' ? (
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										予約した施設の詳細情報
									</Typography>
								) : null}
								{status && status === '利用済' ? (
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										利用した施設の詳細情報
									</Typography>
								) : null}
								{status && status === 'キャンセル' ? (
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										キャンセルした施設の詳細情報
									</Typography>
								) : null}
							</Box>
						) : null}
						{match.pathname === ROUTER_SOCIAL.auth.register.profile ? (
							<Box className="flex">
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.event.event_top}
								>
									トップ
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								<Typography className="text-[#222222] sm:text-16 text-14 font-light">
									会員登録
								</Typography>
							</Box>
						) : null}
						{match.pathname === ROUTER_SOCIAL.auth.register.confirm ? (
							<Box className="flex flex-wrap">
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.event.event_top}
								>
									トップ
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								<Link
									className="text-[#00A0E9] sm:text-16 text-14 font-light"
									to={ROUTER_SOCIAL.auth.register.profile}
								>
									会員登録
								</Link>
								<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								<Typography className="text-[#222222] sm:text-16 text-14 font-light">
									{breadcrumb}
								</Typography>
							</Box>
						) : null}
						{match.pathname === ROUTER_SOCIAL.auth.register.verification_codes ? (
							<Box className="sm:flex flex-wrap">
								<Box className="flex items-center">
									<Link
										className="text-[#00A0E9] sm:text-16 text-14 font-light"
										to={ROUTER_SOCIAL.event.event_top}
									>
										トップ
									</Link>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
									<Link
										className="text-[#00A0E9] sm:text-16 text-14 font-light"
										to={ROUTER_SOCIAL.auth.register.profile}
									>
										会員登録
									</Link>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
									<Link
										className="text-[#00A0E9] sm:text-16 text-14 font-light"
										to={ROUTER_SOCIAL.auth.register.confirm}
									>
										登録内容の確認
									</Link>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								</Box>
								<Box className=" sm:mt-0 mt-4">
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										{breadcrumb}
									</Typography>
								</Box>
							</Box>
						) : null}
						{match.pathname === ROUTER_SOCIAL.auth.register.success ? (
							<Box className="flex flex-wrap">
								<Box className="flex">
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										トップ
									</Typography>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										会員登録
									</Typography>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										登録内容の確認
									</Typography>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
								</Box>
								<Box className="flex sm:mt-0 mt-4">
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										認証コード入力
									</Typography>
									<NavigateNextIcon fontSize="medium" className="self-center text-[#222222] mx-2" />
									<Typography className="text-[#222222] sm:text-16 text-14 font-light">
										{breadcrumb}
									</Typography>
								</Box>
							</Box>
						) : null}
					</Box>
				)
			})}
		</Breadcrumbs>
	)
}

//CoreBreadcrumb.defaultProps = {}

//CoreBreadcrumb.propTypes = {}

export default React.memo(CoreBreadcrumb)

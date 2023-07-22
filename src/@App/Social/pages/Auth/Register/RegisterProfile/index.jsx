import EventContentPage from '@App/Social/components/Layout/EventContentPage'
import { ROUTER_SOCIAL, TRANSLATE_SOCIAL } from '@App/Social/configs/constants'
import { authService } from '@App/Social/services/authService'
import CoreInput from '@Core/components/Input/CoreInput'
import { getDataSession, SESSION_STORAGE, setDataSession } from '@Core/helper/Session'
import Yup from '@Core/helper/Yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Checkbox, Divider, IconButton, InputAdornment, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
// import PropTypes from 'prop-types'
import { LoadingButton } from '@mui/lab'
import { successMsg, errorMsg } from '@Core/helper/Message'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import iconInquiry from '@App/Social/assets/iconInquiry.png'

const RegisterProfile = props => {
	const { t } = useTranslation(TRANSLATE_SOCIAL.auth)
	const navigate = useNavigate()
	const [viewPassword, setViewPassword] = useState(false)
	const [viewConfirmPassword, setViewConfirmPassword] = useState(false)
	const profile = getDataSession(SESSION_STORAGE, 'profile')

	// const nameRegExp = /^(\S*)([^ｧ-ﾝﾞﾟ])$/gi
	const phoneRegExp = /^\d+(?:-\d+)*$/gi

	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting, errors },
		setError
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			name: profile?.name ?? '',
			password: profile?.password ?? '',
			confirm_password: profile?.confirm_password ?? '',
			phone_no: profile?.phone_no ?? '',
			email: profile?.email ?? '',
			confirm_email: profile?.confirm_email ?? '',
			company_name: profile?.company_name ?? '',
			personal_name: profile?.personal_name ?? '',
			check: false
		},
		resolver: yupResolver(
			Yup.object({
				name: Yup.string()
					.required('これは必要項目です。')
					// .matches(nameRegExp, ' 記号は使用できません。')
					.max(20, 'ニックネーム は 20 文字を超えてはなりません。'),
				password: Yup.string()
					.required('これは必要項目です。')
					.min(8, t('validate.invalid_pass'))
					.max(20, t('validate.invalid_pass')),
				confirm_password: Yup.string()
					.oneOf([Yup.ref('password'), null], 'パスワードが一致しません。')
					.min(8, t('validate.invalid_pass'))
					.max(20, t('validate.invalid_pass')),
				email: Yup.string().required('これは必要項目です。').email('メールアドレスの形式が正しくありません。'),
				confirm_email: Yup.string().oneOf([Yup.ref('email'), null], 'メールアドレスが一致しません。'),
				phone_no: Yup.string('使用できない文字です。')
					.required('これは必要項目です。')
					.matches(phoneRegExp, '使用できない文字です。')
					.min(10, '電話番号の形式が正しくありません。')
					.max(12, '電話番号の形式が正しくありません。'),
				company_name: Yup.string(),
				personal_name: Yup.string().required('これは必要項目です。'),
				check: Yup.bool().required('これは必要項目です。')
			})
		)
	})

	const onSubmit = handleSubmit(async data => {
		try {
			const dataProfile = await authService.createUserProfile(data)
			setDataSession(SESSION_STORAGE, 'profile', dataProfile?.profile)
			successMsg('プロファイルの成功を登録します。')
			navigate(ROUTER_SOCIAL.auth.register.confirm)
		} catch (e) {
			console.log(e)
			setError('email', e)
		}
	})

	return (
		<EventContentPage
			maxWidth={1000}
			auth={true}
			content={
				<form onSubmit={onSubmit} className="sm:pt-[72px] pt-[64px] sm:px-0 px-16 sm:pb-[220px] pb-[56px]">
					<Box className="bg-white sm:px-[100px] px-16 ">
						<Typography className="sm:pt-[56px] pt-[24px] pb-32 text-center text-24 sm:text-32 text-[#222222] font-semibold sm:leading-[140%]">
							会員登録
						</Typography>
						<Typography className="font-semibold sm:leading-[140%] text-[20px] sm:text-[26px] text-[#222222]">
							基本情報
						</Typography>
						<Divider className="sm:mb-28 mb-20" />

						<Box className="flex mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								ニックネーム
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<Typography className="mb-8 text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#222222]">
							アプリ内でのアカウント名として表示されます
						</Typography>

						<CoreInput
							control={control}
							name="name"
							className="w-full"
							placeholder="ニックネーム"
							input={true}
						/>

						<Box className="flex sm:mt-24 mt-16 mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								電話番号
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="phone_no"
							className="w-full "
							placeholder="電話番号"
							input={true}
						/>

						<Box className="flex sm:mt-24 mt-16 mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								メールアドレス
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="email"
							className="w-full"
							placeholder="メールアドレス"
							input={true}
						/>
						{errors?.email?.error_message ? (
							<Typography className="text-16 text-[#d83443] mt-[3px]">
								{errors?.email?.error_message}
							</Typography>
						) : null}

						<Box className="flex sm:mt-24 mt-16 mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								メールアドレス(確認用)
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="confirm_email"
							className="w-full"
							placeholder="メールアドレスを再入力"
							input={true}
						/>

						<Box className="flex sm:mt-24 mt-16 ">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								パスワード
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="password"
							type={viewPassword ? 'text' : 'password'}
							className="w-full sm:mt-24 mt-16"
							placeholder="半角英数8文字以上"
							input={true}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										{viewPassword ? (
											<IconButton onClick={() => setViewPassword(false)}>
												<VisibilityOutlinedIcon color="primary" />
											</IconButton>
										) : (
											<IconButton onClick={() => setViewPassword(true)}>
												<VisibilityOffOutlinedIcon color="primary" />
											</IconButton>
										)}
									</InputAdornment>
								)
							}}
							sx={{
								'@media screen and (min-width: 600px)': {
									'.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '20px',
										lineHeight: '160%',
										paddingY: '12px !important',
										paddingX: '16px !important'
									},
									'.css-1hd0dte-MuiInputBase-root-MuiOutlinedInput-root': {
										paddingRight: '8px'
									}
								},
								'@media screen and (max-width: 600px)': {
									'.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '140%',
										paddingY: '17px !important',
										paddingX: '16px !important'
									},
									'.css-1hd0dte-MuiInputBase-root-MuiOutlinedInput-root': {
										paddingRight: '8px'
									}
								}
							}}
						/>

						<Box className="flex sm:mt-24 mt-16 mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								パスワード(確認用)
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="confirm_password"
							type={viewConfirmPassword ? 'text' : 'password'}
							className="w-full "
							placeholder="パスワードを再入力	"
							input={true}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										{viewConfirmPassword ? (
											<IconButton onClick={() => setViewConfirmPassword(false)}>
												<VisibilityOutlinedIcon color="primary" />
											</IconButton>
										) : (
											<IconButton onClick={() => setViewConfirmPassword(true)}>
												<VisibilityOffOutlinedIcon color="primary" />
											</IconButton>
										)}
									</InputAdornment>
								)
							}}
							sx={{
								'@media screen and (min-width: 600px)': {
									'.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '20px',
										lineHeight: '160%',
										paddingY: '12px !important',
										paddingX: '16px !important'
									},
									'.css-1hd0dte-MuiInputBase-root-MuiOutlinedInput-root': {
										paddingRight: '8px'
									}
								},
								'@media screen and (max-width: 600px)': {
									'.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
										fontWeight: 300,
										fontSize: '16px',
										lineHeight: '140%',
										paddingY: '17px !important',
										paddingX: '16px !important'
									},
									'.css-1hd0dte-MuiInputBase-root-MuiOutlinedInput-root': {
										paddingRight: '8px'
									}
								}
							}}
						/>

						<Typography className="mt-32 font-semibold sm:leading-[140%] text-[20px] sm:text-[26px] text-[#222222]">
							見積書・領収書の宛名
						</Typography>
						<Divider className="sm:mb-28 mb-20" />

						<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#222222]">
							見積書および領収書に表示する内容はログイン後にマイページから変更が可能です
						</Typography>

						<Box className="flex sm:mt-24 mt-16 mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%]">
								会社名または組織名
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="company_name"
							className="w-full"
							placeholder="会社名または組織名を入力"
							input={true}
						/>

						<Box className="flex sm:mt-24 mt-16 mb-8">
							<Typography className="font-semibold sm:text-20 text-16 text-[#222222] sm:leading-[160%] leading-[140%] mr-8">
								個人名
							</Typography>
							<Typography className="text-16 sm:text-20 sm:leading-[160%] leading-[140%] font-light text-[#D83443]">
								*必須
							</Typography>
						</Box>
						<CoreInput
							control={control}
							name="personal_name"
							className="w-full"
							placeholder="個人名"
							input={true}
						/>

						<Typography className="mt-32 text-16 sm:text-20 sm:leading-[160%] leading-[140%] sm:font-light font-normal text-[#0B0B0B]">
							プライバシーポリシー・利用規約を必ずご覧いただき、同意の上ご登録ください。
						</Typography>

						<a
							className="flex sm:mt-8 mt-[9px] text-16 sm:text-20 sm:leading-[160%] leading-[140%] text-[#00A0E9] cursor-pointer"
							href={ROUTER_SOCIAL.privacy}
							target="_blank"
						>
							プライバシーポリシーはこちら
							<img src={iconInquiry} className="ml-12 h-12 self-center" />
						</a>
						<a
							className="flex sm:mt-8 mt-[9px] text-16 sm:text-20 sm:leading-[160%] leading-[140%] text-[#00A0E9] cursor-pointer"
							href={ROUTER_SOCIAL.terms}
							target="_blank"
						>
							利用規約はこちら
							<img src={iconInquiry} className="ml-12 h-12 self-center" />
						</a>

						<Box className="flex sm:mt-16 mt-[9px] items-start ">
							<Controller
								name="check"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Checkbox
										{...field}
										color="primary"
										className="text-[#00A0E9] p-0 mr-[11px] self-center"
									/>
								)}
							/>
							<Typography className="sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light text-[#222222] ">
								プライバシーポリシー・利用規約に同意
							</Typography>
						</Box>

						<Box className="text-center mt-32 sm:pb-[56px] pb-[24px]">
							<LoadingButton
								loading={isSubmitting}
								variant="contained"
								color="primary"
								className="sm:w-[400px] w-full sm:text-20 text-16 sm:py-12 py-[17px] px-0 leading-[140%] shadow-none font-semibold text-[#FFFFFF]"
								type="submit"
								disabled={!watchCheckBox}
							>
								内容の確認へ進む
							</LoadingButton>
						</Box>
					</Box>
				</form>
			}
		/>
	)
}

// RegisterProfile.defaultProps = {}

// RegisterProfile.propTypes = {}

export default React.memo(RegisterProfile)

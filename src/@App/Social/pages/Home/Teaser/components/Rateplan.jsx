import { Box, Typography, useMediaQuery, Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import check from '@App/Social/assets/check.png'
import { useSearchParams } from 'react-router-dom'

const Rateplan = () => {
	const isMobile = useMediaQuery('(max-width:600px)')
	let [searchParams] = useSearchParams()
	const plan = searchParams.get('plan')

	const planRef = useRef()

	useEffect(() => {
		setTimeout(() => {
			if (plan && planRef.current) {
				planRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		}, 1000)

	}, [plan]);

	return (
		<Box className="text-center bg-[#EFFAFF]">
			<Typography className="sm:pt-[72px] pt-[56px] sm:text-[40px] text-[24px] font-semibold text-[#222222] border-b-[2px] border-[#00A0E9] inline-block">
				料金プラン
			</Typography>
			<div ref={planRef} id="plan">
				<Typography className="sm:block hidden mt-56 text-[#00A0E9] text-[32px] font-semibold leading-[140%]">
					新規登録は無料!!
				</Typography>

				<Box className="lg:px-0 sm:px-16 px-16 sm:mb-0 mb-16">
					<Box className="mx-auto lg:w-[800px] w-full bg-[#FFFFFF] sm:mt-[24px] mt-[32px]">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							無料デモプラン
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							0円
						</Typography>
						<Box className="flex sm:justify-center mt-24 sm:pb-0 pb-[26px] sm:ml-0 ml-16">
							<img src={check} className="mr-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								{isMobile ? 'デモンストレーション画面の確認' : 'サービスの擬似体験'}
							</Typography>
						</Box>
						<Box className="mt-24 pb-[40px] sm:block hidden mx-auto ">
							<a href={import.meta.env.VITE_CMS_LOGIN_URL} target='_blank'>
								<Button
									variant="contained"
									color="primary"
									className="w-[446px] text-20 py-16 h-64 px-0 leading-[160%] shadow-none font-semibold text-[#FFFFFF]"
									type="submit"
								>
									無料でデモを見る
								</Button>
							</a>
						</Box>
					</Box>
				</Box>

				<Typography className="sm:block hidden mt-56 text-[#222222] text-[26px] font-semibold leading-[140%]">
					無料デモプランに登録後から利用可能
				</Typography>
				<Typography className="mb-24 hidden border-b-[2px] border-[#00A0E9] sm:inline-block text-[#00A0E9] mt-32 text-20 font-semibold leading-[160%]">
					全ての施設向けプラン
				</Typography>

				<Box className="lg:flex mx-auto justify-between lg:w-[800px] sm:w-auto sm:px-0 px-16">
					<Box className="lg:w-[388px] sm:h-[431px] h-full w-full sm:px-68 px-16 bg-[#FFFFFF] sm:mb-0 mb-16">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							スマートロックプラン
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							34,800円
						</Typography>
						<Box className="flex sm:justify-start mt-24">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								ドアれぼへの掲載
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8 sm:pb-0 pb-[24px]">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								スマートロック設置で鍵
								の開け閉めをデジタル化
							</Typography>
						</Box>
					</Box>

					<Box className="sm:block hidden lg:w-[388px] sm:h-[431px] h-full w-full sm:px-24 lg:mt-0 sm:mt-16 px-16 bg-[#FFFFFF]">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							完全無人化パッケージプラン
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							39,800円
						</Typography>
						<Box className="flex sm:justify-start mt-24">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								ドアれぼへの掲載
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8 sm:pb-0 pb-[24px]">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								スマートロック+スマートリモコンを導入し、IoT機器の管理をデジタル化
							</Typography>
						</Box>
					</Box>

					<Box className="sm:hidden block sm:w-[388px] sm:h-[431px] h-full w-full sm:px-68 px-16 bg-[#FFFFFF] sm:mb-0 mb-16">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							コワーキング
							<br />
							スマートロックプラン
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							34,800円
						</Typography>
						<Box className="flex sm:justify-start mt-24">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								ドアれぼへの掲載
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								スマートロック設置で鍵の開け閉めをデジタル化
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8 sm:pb-0 pb-[24px]">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								コワーキング契約に対応した料金プランを設定可能
							</Typography>
						</Box>
					</Box>

				</Box>

				<Typography className="mb-24 hidden border-b-[2px] border-[#00A0E9] sm:inline-block text-[#00A0E9] mt-32 text-20 font-semibold leading-[160%]">
					コワーキングスペース向けプラン
				</Typography>

				<Box className="lg:flex mx-auto justify-between lg:w-[800px] sm:pb-[72px] pb-56 sm:mt-0 mt-16 sm:px-0 px-16">
					<Box className="sm:block hidden lg:w-[388px] sm:h-[431px] h-full w-full sm:px-68 px-16 bg-[#FFFFFF] sm:mb-0 mb-16">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							コワーキング
							<br />
							スマートロックプラン
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							34,800円
						</Typography>
						<Box className="flex sm:justify-start mt-24">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								ドアれぼへの掲載
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								スマートロック設置で鍵の開け閉めをデジタル化
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8 sm:pb-0 pb-[24px]">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								コワーキング契約に対応した料金プランを設定可能
							</Typography>
						</Box>
					</Box>

					<Box className="sm:hidden block sm:w-[388px] sm:h-[431px] h-full w-full sm:px-24 px-16 bg-[#FFFFFF]">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							完全無人化パッケージプラン
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							39,800円
						</Typography>
						<Box className="flex sm:justify-start mt-24">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								ドアれぼへの掲載
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8 sm:pb-0 pb-[24px]">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								スマートロック+スマートリモコンを導入し、IoT機器の管理をデジタル化
							</Typography>
						</Box>
					</Box>

					<Box className="lg:w-[388px] sm:h-[431px] h-full mt-16 w-full lg:mt-0 sm:mt-16 sm:px-24 px-16 bg-[#FFFFFF]">
						<Typography className="sm:pt-[40px] pt-[24px] text-[#00A0E9] sm:text-20 text-16 font-semibold sm:leading-[160%] leading-[140%]">
							完全無人化コワーキングプラン
							<br className="sm:block hidden" />
							<br className="sm:block hidden" />
						</Typography>
						<Typography className="text-[#000000] text-[32px] font-semibold leading-[140%] sm:mt-10 mt-8  border-b-[2px] border-[#00A0E9] inline-block">
							39,800円
						</Typography>
						<Box className="flex sm:justify-start mt-24">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								ドアれぼへの掲載
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start break-all sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								スマートロック+スマートリモコンを導入し、IoT機器の管理をデジタル化
							</Typography>
						</Box>
						<Box className="flex sm:justify-start mt-8 sm:pb-0 pb-[26px]">
							<img src={check} className="mr-4 h-24 sm:mt-4" />
							<Typography className="text-[#222222] text-start sm:text-20 text-16 sm:leading-[160%] leading-[140%] font-light">
								コワーキング契約に対応した料金プラン設定可能
							</Typography>
						</Box>
					</Box>
				</Box>
			</div>
		</Box>
	)
}

export default Rateplan

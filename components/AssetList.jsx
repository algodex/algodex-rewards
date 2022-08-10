import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'

//Custom components and hooks
import Link from './Nav/Link'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { ChartDataContext } from 'context/chartContext'
import { getAlgoPrice } from '@/lib/getTinymanPrice'

export const AssetList = ({ isConnected }) => {
  const { t } = useTranslation('common')
  const { conversionRate } = usePriceConversionHook({})
  const [algoPrices, setAlgoPrices] = useState({})
  const context = useContext(ChartDataContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Chart Provider')
  }
  const { earnedAssetData } = context

  const convertToAlgo = useCallback(
    async (assetId) => {
      const prices = {}
      const res = await getAlgoPrice(assetId)
      if (!prices[assetId]) {
        prices[assetId] = res
        setAlgoPrices((prevState) => {
          return {
            ...prevState,
            ...prices,
          }
        })
      }
    },
    [earnedAssetData]
  )

  useEffect(() => {
    if (earnedAssetData.length > 0) {
      earnedAssetData.forEach(({ assetId }) => {
        convertToAlgo(assetId)
      })
    }
  }, [earnedAssetData])

  return (
    <Box sx={{ paddingBlock: '1.5rem' }}>
      {!isConnected ? (
        <Typography
          fontSize={'0.95rem'}
          fontStyle={'italic'}
          color={'primary.contrastText'}
          marginBlock={'10vh'}
          textAlign={'center'}
        >
          {t('Connect Wallet to View Assets')}
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {earnedAssetData.map((asset) => (
              <Grid
                key={asset.assetId}
                item
                xs={12}
                sm={10}
                md={6}
                lg={4}
                xl={4}
              >
                <Box
                  sx={{
                    backgroundColor: 'secondary.dark',
                    color: 'secondary.contrastText',
                    borderRadius: '3px',
                    border: '1px solid',
                    borderColor: 'secondary.light3',
                    padding: '1rem',
                    marginBlock: '1.2rem',
                  }}
                >
                  <Typography
                    fontSize={'1rem'}
                    fontWeight={700}
                    color={'secondary.light'}
                    marginBottom={'0.7rem'}
                  >
                    {t('Asset')}
                  </Typography>

                  <Box
                    marginBottom={'0.5rem'}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src={asset.assetLogo}
                      alt={`${asset.assetName} logo`}
                      width="28"
                      height="28"
                    />
                    <Box marginLeft={'0.5rem'}>
                      <Typography fontSize={'1.1rem'} fontWeight={600}>
                        {asset.assetName}
                      </Typography>

                      <Typography
                        fontSize={'0.85rem'}
                        fontWeight={700}
                        sx={{ color: 'secondary.light3' }}
                      >
                        {t('Asset ID')}: {asset.assetId}
                      </Typography>
                    </Box>
                    <Box sx={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                      <Link
                        href={`https://algoexplorer.io/asset/${asset.assetId}`}
                        target={'_blanc'}
                      >
                        <LaunchRoundedIcon
                          sx={{
                            color: 'secondary.contrastText',
                            cursor: 'pointer',
                          }}
                        />
                      </Link>
                    </Box>
                  </Box>
                  <hr />

                  <Box
                    marginBottom={'0.5rem'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={700}
                        color={'secondary.light'}
                        marginBottom={'0.5rem'}
                      >
                        {t('Avg Amount Supplied')}
                      </Typography>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={600}
                        lineHeight={'1.5rem'}
                      >
                        {asset.depthSum.toFixed(2)} {asset.assetName} <br />
                        {(
                          algoPrices[asset.assetId] * asset.depthSum || 0
                        ).toFixed(2)}{' '}
                        ALGO
                      </Typography>
                    </Box>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ borderColor: 'primary.contrastText' }}
                    />
                    <Box>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={700}
                        color={'secondary.light'}
                        textAlign={'right'}
                        marginBottom={'0.5rem'}
                      >
                        {t('Est. Daily Rewards')}
                      </Typography>
                      <Typography
                        fontSize={'1rem'}
                        fontWeight={600}
                        textAlign={'right'}
                      >
                        {asset.dailyRwd.toLocaleString()} ALGX
                      </Typography>

                      <Typography
                        fontSize={'0.85rem'}
                        fontWeight={700}
                        textAlign={'right'}
                        sx={{ color: 'secondary.light' }}
                      >
                        {(asset.dailyRwd * conversionRate).toLocaleString()} USD
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  )
}

AssetList.propTypes = {
  isConnected: PropTypes.bool,
  rewards: PropTypes.array,
}

AssetList.defaultProps = {
  isConnected: false,
  rewards: [],
}

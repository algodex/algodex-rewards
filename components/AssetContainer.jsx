import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

// Material UI components
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'

//Custom components and hooks
import Link from './Nav/Link'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { getAlgoPrice } from '@/lib/getTinymanPrice'

export const AssetContainer = ({ asset }) => {
  const [algoPrices, setAlgoPrices] = useState({})
  const { t } = useTranslation('common')
  const { conversionRate } = usePriceConversionHook({})

  const convertToAlgo = useCallback(async (accrualAssetId) => {
    const prices = {}
    const res = await getAlgoPrice(accrualAssetId)
    if (!prices[accrualAssetId]) {
      prices[accrualAssetId] = res
      setAlgoPrices((prevState) => {
        return {
          ...prevState,
          ...prices,
        }
      })
    }
  }, [])

  useEffect(() => {
    if (asset) {
      convertToAlgo(asset.accrualAssetId)
    }
  }, [asset])

  return (
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
            {t('Asset ID')}: {asset.accrualAssetId}
          </Typography>
        </Box>
        <Box sx={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
          <Link
            href={`https://algoexplorer.io/asset/${asset.accrualAssetId}`}
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
            {(algoPrices[asset.accrualAssetId] * asset.depthSum || 0).toFixed(3)} ALGO
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
            {t('Last Week’s Rewards')}
          </Typography>
          <Typography fontSize={'1rem'} fontWeight={600} textAlign={'right'}>
            {asset.lastWeek.toLocaleString()} ALGX
          </Typography>

          <Typography
            fontSize={'0.85rem'}
            fontWeight={700}
            textAlign={'right'}
            sx={{ color: 'secondary.light' }}
          >
            {(asset.lastWeek * conversionRate).toLocaleString()} USD
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

AssetContainer.propTypes = {
  asset: PropTypes.object,
}

AssetContainer.defaultProps = {
  asset: [],
}

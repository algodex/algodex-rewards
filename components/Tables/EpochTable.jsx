import React, { useContext, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { TableLoader } from '../Loaders/TableLoader'
import { WarningCard } from '../WarningCard'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { useTranslation } from 'next-i18next'
import { getEpochEnd } from '@/lib/getRewards'
import { PeriodContext } from 'context/periodContext'

const columns = [
  { id: 'period', label: 'Period' },
  { id: 'earnedRewards', label: 'Earned Rewards' },
  { id: 'vestedRewards', label: 'Vested Rewards' },
  {
    id: 'unvestedRewards',
    label: 'Unvested Rewards',
  },
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.light,
    borderColor: theme.palette.secondary.main,
    fontSize: 15,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.secondary.main,
  },
}))

export const EpochTable = ({
  isConnected,
  loading,
  rewards,
  vestedRewards,
  activeCurrency,
  activeWallet
}) => {
  const { t } = useTranslation('common')
  const { conversionRate } = usePriceConversionHook({})
  const context = useContext(PeriodContext)
  const { setPeriodAssets, tinymanAssets } = context

  const getLastWeekEpoch = () => {
    const now = new Date()
    return Date.parse(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    )
  }

  const attachCurrency = (price) => {
    return `${(activeCurrency === 'ALGX'
      ? price
      : price * conversionRate
    ).toLocaleString()} ${activeCurrency}`
  }

  const mergedRewards = useMemo(() => {
    const x = {}
    const list = rewards.concat(vestedRewards)
    list.forEach(({ value }) => {
      if (x[value.epoch]) {
        x[value.epoch] = {
          ...x[value.epoch],
          ...value,
          assetId: x[value.epoch].assetId.includes(value.assetId)
            ? x[value.epoch].assetId
            : [...x[value.epoch].assetId, value.assetId],
        }
      } else {
        x[value.epoch] = {
          ...value,
          assetId: [value.assetId],
        }
      }
    })
    return Object.entries(x)
  }, [rewards, vestedRewards])

  const currentPeriod = useMemo(() => {
    // Find a reward whose epoch is not over a week from now
    const newR = Object.values(mergedRewards).filter(
      (epoch) => getEpochEnd(epoch[0]) * 1000 > getLastWeekEpoch()
    )
    return newR || []
  }, [mergedRewards])

  useEffect(() => {
    setPeriodAssets([])
  }, [activeWallet])
  // console.log({ mergedRewards })

  const getAssetsByEpoch = (_epoch) => {
    const rewardsCopy = [...rewards]
    const data = []
    const assets = {}
    if (rewardsCopy.length > 0) {
      rewardsCopy.forEach(({ value }) => {
        if (assets[value.assetId]) {
          assets[value.assetId] = [...assets[value.assetId], value]
        } else {
          assets[value.assetId] = [value]
        }
      })
    }
    for (const assetId in assets) {
      const list = [...assets[assetId]].filter(({ epoch }) => epoch == _epoch)
      data.push({
        assetId,
        dailyRwd: (
          list.find(({ epoch }) => epoch == _epoch).earnedRewards / 7
        ).toFixed(2),
        depthSum: list.reduce((a, b) => a + b.depthSum, 0) / 10080,
        assetName: tinymanAssets[assetId].name,
        assetLogo: tinymanAssets[assetId].logo?.svg,
      })
    }
    setPeriodAssets(data)
  }

  return (
    <>
      {isConnected && (
        <>
          {!loading && rewards.length < 1 ? (
            <WarningCard
              title="Not enough ALGX in wallet for rewards"
              warnings={[
                // eslint-disable-next-line max-len
                'At least 100 ALGX must be held for a wallet to vest retroactive rewards and/or earn new rewards.',
              ]}
              link={{
                title: 'View info on earning rewards here',
                url: '/',
              }}
            />
          ) : (
            <>
              <Typography
                sx={{
                  color: 'primary.light',
                  fontWeight: 500,
                  marginTop: '2rem',
                }}
              >
                {t(
                  'You can select a period from this list to view more information'
                )}
                .
              </Typography>
              {currentPeriod.length > 0 && (
                <>
                  <Typography
                    sx={{
                      color: 'primary.contrastText',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      marginTop: '2rem',
                    }}
                  >
                    {t('Current Period')}
                  </Typography>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      {!loading && currentPeriod.length > 0 && (
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <StyledTableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                component="th"
                                scope="row"
                              >
                                {t(`${column.label}`)}
                              </StyledTableCell>
                            ))}
                            <StyledTableCell></StyledTableCell>
                          </TableRow>
                        </TableHead>
                      )}
                      {loading ? (
                        <TableLoader columnCount={5} />
                      ) : (
                        <TableBody>
                          {currentPeriod.map((row) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row[0]}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                  getAssetsByEpoch(row[0])
                                }}
                              >
                                <>
                                  <StyledTableCell>{row[0]}</StyledTableCell>
                                  <StyledTableCell>
                                    {attachCurrency(row[1].earnedRewards)}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {attachCurrency(row[1].vestedRewards || 0)}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {attachCurrency(
                                      row[1].earnedRewards -
                                        (row[1].vestedRewards || 0)
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <ChevronRightIcon />
                                  </StyledTableCell>
                                </>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </>
              )}
              <Typography
                sx={{
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  marginTop: '2rem',
                }}
              >
                {t('Previous Periods')}
              </Typography>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  {!loading && mergedRewards.length > 0 && (
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            component="th"
                            scope="row"
                          >
                            {t(`${column.label}`)}
                          </StyledTableCell>
                        ))}
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                  )}
                  {loading ? (
                    <TableLoader columnCount={5} />
                  ) : (
                    <TableBody>
                      {mergedRewards.map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row[0]}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              getAssetsByEpoch(row[0])
                            }}
                          >
                            <>
                              <StyledTableCell>{row[0]}</StyledTableCell>
                              <StyledTableCell>
                                {attachCurrency(row[1].earnedRewards)}
                              </StyledTableCell>
                              <StyledTableCell>
                                {attachCurrency(row[1].vestedRewards || 0)}
                              </StyledTableCell>
                              <StyledTableCell>
                                {attachCurrency(
                                  row[1].earnedRewards -
                                    (row[1].vestedRewards || 0)
                                )}
                              </StyledTableCell>
                              <StyledTableCell>
                                <ChevronRightIcon />
                              </StyledTableCell>
                            </>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </>
  )
}

EpochTable.propTypes = {
  isConnected: PropTypes.bool,
  loading: PropTypes.bool,
  rewards: PropTypes.array,
  vestedRewards: PropTypes.array,
  activeWallet: PropTypes.object,
}

EpochTable.defaultProps = {
  isConnected: false,
  loading: true,
  rewards: [],
  vestedRewards: [],
}

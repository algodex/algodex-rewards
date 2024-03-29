/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { styled } from '@mui/material/styles'
import visuallyHidden from '@mui/utils/visuallyHidden'
import Grid from '@mui/material/Grid'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import InfoIcon from '@mui/icons-material/Info'

//Custom components and hooks
import { TableLoader } from '../Loaders/TableLoader'
import { WarningCard } from '../WarningCard'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { useTranslation } from 'next-i18next'
import { AssetContainer } from '../AssetContainer'
import { attachCurrency, shortenAddress } from '../../lib/helper'
import { checkIfRecorded } from '../../lib/getRewards'
import { useEffect } from 'react'
import { minAmount } from '../../hooks/useRewardsAddresses'

const columns = [
  { id: 'epoch', label: 'Period' },
  { id: 'earnedRewardsFormatted', label: 'Earned Rewards', align: 'right' },
  { id: 'vestedRewards', label: 'Vested Rewards', align: 'right' },
  {
    id: 'unvestedRewards',
    label: 'Unvested Rewards',
    align: 'right',
  },
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.light,
    borderColor: theme.palette.secondary.main,
    fontSize: 15,
    fontWeight: 600,
    // eslint-disable-next-line max-len
    ['.MuiButtonBase-root:hover, .MuiButtonBase-root.Mui-active, .MuiButtonBase-root .MuiSvgIcon-root']:
      {
        color: theme.palette.primary.light,
      },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.secondary.main,
  },
}))

const activeRowStyles = {
  ['.MuiTableCell-body']: {
    borderBottom: 'solid 0.1rem',
    borderTop: 'solid 0.1rem',
    borderColor: 'accent.main',
    ['&:first-of-type']: {
      borderLeft: 'solid 0.1rem',
      borderColor: 'accent.main',
      borderTopLeftRadius: '0.3rem',
      borderBottomLeftRadius: '0.3rem',
    },
    ['&:last-child']: {
      borderRight: 'solid 0.1rem',
      borderColor: 'accent.main',
      borderTopRightRadius: '0.3rem',
      borderBottomRightRadius: '0.3rem',
    },
  },
}

export const PeriodTable = ({
  isConnected,
  loading,
  rewards,
  vestedRewards,
  pendingPeriod,
  activeCurrency,
  activeEpoch,
  setActiveEpoch,
  mobileAssets,
  periodAssets,
  setMobileAssets,
  currentlyEarning,
}) => {
  const { t } = useTranslation('common')
  const { conversionRate } = usePriceConversionHook({})
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('epoch')
  const [hiddenPeriod, setHiddenPeriod] = useState(0)

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      }
      return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
  }

  const createSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const mergedRewards = useMemo(() => {
    const x = {}
    const list = rewards.concat(vestedRewards)
    if (list.length > 0) {
      list.forEach(({ value }) => {
        if (x[value.epoch]) {
          x[value.epoch] = {
            ...x[value.epoch],
            ...value,
            vestedRewards:
              x[value.epoch].vestedRewards +
              (value.formattedVestedRewards || 0),
            earnedRewardsFormatted:
              x[value.epoch].earnedRewardsFormatted +
              (value.earnedRewardsFormatted || 0),
            unvestedRewards:
              x[value.epoch].unvestedRewards +
              ((value.earnedRewardsFormatted || 0) -
                (value.formattedVestedRewards || 0) || 0),
            accrualAssetId: x[value.epoch].accrualAssetId.includes(
              value.accrualAssetId
            )
              ? x[value.epoch].accrualAssetId
              : [...x[value.epoch].accrualAssetId, value.accrualAssetId],
          }
        } else {
          x[value.epoch] = {
            ...value,
            vestedRewards: value.formattedVestedRewards || 0,
            unvestedRewards:
              (value.earnedRewardsFormatted || 0) -
                (value.formattedVestedRewards || 0) || 0,
            accrualAssetId: [value.accrualAssetId],
          }
        }
      })
    }
    return stableSort(Object.values(x), getComparator(order, orderBy))
  }, [rewards, vestedRewards, order, orderBy])

  useEffect(() => {
    let ignore = false
    const runCheck = async () => {
      try {
        const res = await checkIfRecorded(pendingPeriod.number - 1)
        if (!res.data.isRecorded) {
          if (!ignore) {
            setHiddenPeriod(res.data.epoch)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (rewards.length > 0) {
      runCheck()
    }
    return () => {
      ignore = true
    }
  }, [pendingPeriod, rewards])

  return (
    <>
      {isConnected && (
        <>
          {!loading && rewards.length < 1 ? (
            <>
              {currentlyEarning.notAccruingReason ? (
                <>
                  {currentlyEarning.isAccruingRewards == false && (
                    <WarningCard
                      title={currentlyEarning.notAccruingReason}
                      link={{
                        title: 'View info on earning rewards here',
                        // eslint-disable-next-line max-len
                        url: 'https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program',
                      }}
                      icon={() => {
                        return (
                          <ErrorOutlineOutlinedIcon
                            sx={{
                              marginRight: '6px',
                              fontSize: '1.2rem',
                              marginTop: '2px',
                            }}
                          />
                        )
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <WarningCard
                    title="Not enough ALGX in wallet for rewards"
                    warnings={[
                      // eslint-disable-next-line max-len
                      `At least ${minAmount} ALGX must be held for a wallet to vest retroactive rewards and/or earn new rewards.`,
                    ]}
                    link={{
                      title: 'View info on earning rewards here',
                      // eslint-disable-next-line max-len
                      url: 'https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program',
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              {currentlyEarning.isAccruingRewards == false ? (
                <WarningCard
                  icon={() => {
                    return (
                      <ErrorOutlineOutlinedIcon
                        sx={{
                          marginRight: '6px',
                          fontSize: '1.2rem',
                          marginTop: '2px',
                        }}
                      />
                    )
                  }}
                  title={currentlyEarning.notAccruingReason}
                  link={{
                    title: 'View info on earning rewards here',
                    // eslint-disable-next-line max-len
                    url: 'https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program',
                  }}
                />
              ) : (
                <WarningCard
                  icon={() => {
                    return (
                      <CheckCircleOutlineRoundedIcon
                        sx={{
                          marginRight: '6px',
                          fontSize: '1.2rem',
                          marginTop: '2px',
                        }}
                      />
                    )
                  }}
                  title={currentlyEarning.notAccruingReason}
                  warnings={[
                    ` Wallet ${
                      currentlyEarning.wallet
                        ? shortenAddress({
                          address: currentlyEarning.wallet,
                        })
                        : ''
                    } ${t('is')} ${
                      currentlyEarning.isAccruingRewards === false ? (
                        <>{t('NOT')} </>
                      ) : (
                        ''
                      )
                    }
                      ${t('currently earning rewards for period')} ${
                  pendingPeriod.number
                }. ${t(
                  'Number of rewards will be updated after the end of the period'
                )}.`,
                  ]}
                />
              )}

              {hiddenPeriod ? (
                <WarningCard
                  title={`${t('Period')} ${hiddenPeriod} ${t(
                    'is complete and will be available to view here shortly'
                  )}.`}
                  note={`${t(
                    'Rewards will be updated two days after period completion'
                  )}.`}
                  icon={() => {
                    return (
                      <InfoIcon
                        sx={{
                          marginRight: '6px',
                          fontSize: '1.2rem',
                          marginTop: '2px',
                        }}
                      />
                    )
                  }}
                />
              ) : (
                <></>
              )}
              {!mobileAssets ? (
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
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      {(loading || mergedRewards.length > 0) && (
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
                                <TableSortLabel
                                  active={orderBy === column.id}
                                  direction={
                                    orderBy === column.id ? order : 'asc'
                                  }
                                  onClick={() => createSortHandler(column.id)}
                                >
                                  {t(`${column.label}`)}
                                  {orderBy === column.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                    </Box>
                                  ) : null}
                                </TableSortLabel>
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
                          {mergedRewards
                            .filter(
                              ({ epoch }) =>
                                epoch < parseInt(pendingPeriod.number)
                            )
                            .map((row) => {
                              return (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.epoch}
                                  sx={[
                                    {
                                      cursor: 'pointer',
                                    },
                                    row.epoch == activeEpoch && activeRowStyles,
                                  ]}
                                  onClick={() => {
                                    setActiveEpoch(row.epoch)
                                  }}
                                >
                                  <>
                                    <StyledTableCell>
                                      {row.epoch}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {attachCurrency({
                                        price: row.earnedRewardsFormatted || 0,
                                        activeCurrency,
                                        conversionRate,
                                      })}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {attachCurrency({
                                        price: row.vestedRewards || 0,
                                        activeCurrency,
                                        conversionRate,
                                      })}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {attachCurrency({
                                        price: Math.abs(
                                          row.unvestedRewards || 0
                                        ),
                                        activeCurrency,
                                        conversionRate,
                                      })}
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
              ) : (
                <>
                  <Typography
                    sx={{
                      color: 'secondary.light',
                      marginBlock: '2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      setMobileAssets(false)
                      setActiveEpoch(0)
                    }}
                  >
                    <ChevronLeftIcon /> {t('Return to Period List')}
                  </Typography>
                  {periodAssets.length > 0 && (
                    <>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={600}
                        color={'secondary.light'}
                        marginBottom={'1rem'}
                      >
                        {t(
                          // eslint-disable-next-line max-len
                          'These tiles below are for ASAs this wallet provided liquidity to over this period'
                        )}
                        .{' '}
                        {t(
                          '“Amount Supplied” is the average supplied over the period'
                        )}
                        .
                      </Typography>
                      <Typography
                        fontSize={'0.95rem'}
                        fontStyle={'italic'}
                        color={'secondary.light'}
                        marginBottom={'1rem'}
                      >
                        {t(
                          // eslint-disable-next-line max-len
                          'Only ASAs that this wallet provided liquidity to over this period are shown here'
                        )}
                        .
                      </Typography>
                      <Grid container spacing={2}>
                        {periodAssets.map((asset) => (
                          <Grid
                            sx={{ paddingTop: '0 !important' }}
                            key={asset.accrualAssetId}
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            xl={6}
                          >
                            <AssetContainer asset={asset} />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

PeriodTable.propTypes = {
  isConnected: PropTypes.bool,
  loading: PropTypes.bool,
  rewards: PropTypes.array,
  vestedRewards: PropTypes.array,
  pendingPeriod: PropTypes.object,
  activeCurrency: PropTypes.string,
  activeEpoch: PropTypes.number,
  setActiveEpoch: PropTypes.func,
  mobileAssets: PropTypes.bool,
  periodAssets: PropTypes.array,
  setMobileAssets: PropTypes.func,
  currentlyEarning: PropTypes.object,
}

PeriodTable.defaultProps = {
  isConnected: false,
  loading: true,
  rewards: [],
  vestedRewards: [],
}

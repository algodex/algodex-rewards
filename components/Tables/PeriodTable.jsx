import React, { useContext, useEffect, useMemo, useState } from 'react'
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

import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { TableLoader } from '../Loaders/TableLoader'
import { WarningCard } from '../WarningCard'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { useTranslation } from 'next-i18next'
import { PeriodContext } from 'context/periodContext'

const columns = [
  { id: 'epoch', label: 'Period' },
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
  activeWallet,
}) => {
  const { t } = useTranslation('common')
  const { conversionRate } = usePriceConversionHook({})
  const [activeEpoch, setActiveEpoch] = useState('')
  const context = useContext(PeriodContext)
  const { setPeriodAssets, tinymanAssets } = context
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('epoch')

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

  const attachCurrency = (price) => {
    return `${(activeCurrency === 'ALGX'
      ? price
      : price * conversionRate
    ).toLocaleString()} ${activeCurrency}`
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
            unvestedRewards: (value.earnedRewards - (value.vestedRewards || 0) || 0),
            assetId: x[value.epoch].assetId.includes(value.assetId)
              ? x[value.epoch].assetId
              : [...x[value.epoch].assetId, value.assetId],
          }
        } else {
          x[value.epoch] = {
            ...value,
            unvestedRewards: (value.earnedRewards - (value.vestedRewards || 0) || 0),
            assetId: [value.assetId],
          }
        }
      })
    }
    return stableSort(Object.values(x), getComparator(order, orderBy))
  }, [rewards, vestedRewards, order, orderBy])

  const currentPeriod = useMemo(() => {
    // return a reward whose epoch is current.
    const newR = Object.values(mergedRewards).filter(
      (epoch) => epoch === pendingPeriod().number
    )
    return newR || []
  }, [mergedRewards, pendingPeriod])

  useEffect(() => {
    setPeriodAssets([])
  }, [activeWallet])
  // console.log({ mergedRewards })

  const getAssetsByEpoch = (_epoch) => {
    setActiveEpoch(_epoch)
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
          list.find(({ epoch }) => epoch == _epoch)?.earnedRewards / 7 || 0
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
                      {(loading || currentPeriod.length > 0) && (
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
                                tabIndex={-1}
                                key={row[0]}
                                sx={[
                                  {
                                    cursor: 'pointer',
                                  },
                                  row[0] == activeEpoch && activeRowStyles,
                                ]}
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
              <TableContainer
                sx={{
                  maxHeight: 440,
                }}
              >
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
                              direction={orderBy === column.id ? order : 'asc'}
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
                      {mergedRewards.map((row) => {
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
                              getAssetsByEpoch(row.epoch)
                            }}
                          >
                            <>
                              <StyledTableCell>{row.epoch}</StyledTableCell>
                              <StyledTableCell>
                                {attachCurrency(row.earnedRewards)}
                              </StyledTableCell>
                              <StyledTableCell>
                                {attachCurrency(row.vestedRewards || 0)}
                              </StyledTableCell>
                              <StyledTableCell>
                                {attachCurrency(row.unvestedRewards)}
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

PeriodTable.propTypes = {
  isConnected: PropTypes.bool,
  loading: PropTypes.bool,
  rewards: PropTypes.array,
  pendingPeriod: PropTypes.func,
  vestedRewards: PropTypes.array,
  activeWallet: PropTypes.object,
}

PeriodTable.defaultProps = {
  isConnected: false,
  loading: true,
  rewards: [],
  vestedRewards: [],
}

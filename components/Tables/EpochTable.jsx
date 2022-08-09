import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { TableLoader } from '../Loaders/TableLoader'
import { WarningCard } from '../WarningCard'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'

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
}) => {
  const { conversionRate } = usePriceConversionHook({})

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

  console.log({ mergedRewards })

  return (
    <>
      {isConnected && (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              {!loading && rewards.length > 0 && (
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
                        {column.label}
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
                              row[1].earnedRewards - (row[1].vestedRewards || 0)
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
          {!loading && rewards.length < 1 && (
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
}

EpochTable.defaultProps = {
  isConnected: false,
  loading: true,
  rewards: [],
  vestedRewards: [],
}

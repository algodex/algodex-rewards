import React from 'react'
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

const columns = [
  { id: 'epoch', label: 'Epoch' },
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

export const EpochTable = ({ isConnected, loading, rewards }) => {
  return (
    <>
      {isConnected && (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
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
              {loading ? (
                <TableLoader columnCount={5} />
              ) : (
                <TableBody>
                  {rewards.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <>
                          <StyledTableCell>{row.value.epoch}</StyledTableCell>
                          <StyledTableCell>
                            {row.value.earned_rewards.toLocaleString()} ALGX
                          </StyledTableCell>
                          <StyledTableCell>
                            {(0).toLocaleString()} ALGX
                          </StyledTableCell>
                          <StyledTableCell>
                            {(row.value.earned_rewards - 0).toLocaleString()}{' '}
                            ALGX
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
  )
}

EpochTable.propTypes = {
  isConnected: PropTypes.bool,
  loading: PropTypes.bool,
  rewards: PropTypes.array,
}

EpochTable.defaultProps = {
  isConnected: false,
  loading: true,
  rewards: [],
}

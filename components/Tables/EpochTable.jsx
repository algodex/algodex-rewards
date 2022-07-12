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

const columns = [
  { id: 'epoch', label: 'Epoch' },
  { id: 'earnedRewards', label: 'Earned Rewards' },
  { id: 'vestedRewards', label: 'Vested Rewards' },
  {
    id: 'unvestedRewards',
    label: 'Unvested Rewards',
    format: (value) => value.toFixed(2),
  },
]

const rows = [
  {
    epoch: 344,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 324,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 334,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 354,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 444,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 144,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 44,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 34,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
  },
  {
    epoch: 90,
    earnedRewards: '267 ALGX',
    vestedRewards: '56.5 ALGX',
    unvestedRewards: '16.5 ALGX',
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

export const EpochTable = ({ isConnected }) => {
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
              <TableBody>
                {rows.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.epoch}
                    >
                      <>
                        {columns.map((column) => {
                          const value = row[column.id]
                          return (
                            <StyledTableCell
                              key={column.id}
                              align={column.align}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </StyledTableCell>
                          )
                        })}
                        <StyledTableCell>
                          <ChevronRightIcon />
                        </StyledTableCell>
                      </>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}

EpochTable.propTypes = {
  isConnected: PropTypes.bool,
}

EpochTable.defaultProps = {
  isConnected: false,
}

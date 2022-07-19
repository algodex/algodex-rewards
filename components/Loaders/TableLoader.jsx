import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

//MUI Components
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'

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

export const TableLoader = ({ rowCount, columnCount }) => {
  return (
    <TableBody>
      {[...Array(rowCount)].map((row, index) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
            <>
              {[...Array(columnCount)].map((column, index) => {
                return (
                  <StyledTableCell key={index}>
                    <Skeleton baseColor={'#ABB0BC'} />
                  </StyledTableCell>
                )
              })}
            </>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

TableLoader.propTypes = {
  rowCount: PropTypes.number,
  columnCount: PropTypes.number,
}

TableLoader.defaultProps = {
  rowCount: 5,
  columnCount: 4,
}

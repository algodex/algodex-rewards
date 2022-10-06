/* 
 * Algodex Rewards 
 * Copyright (C) 2021-2022 Algodex VASP (BVI) Corp.
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

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

//MUI components
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import { ChartDataContext } from 'context/chartContext'
import Typography from '@mui/material/Typography'

const timeRangeEnum = {
  '1Wk': '1 Week',
  '1M': '1 Month',
  '3M': '3 Months',
  '1Y': '1 Year',
  YTD: 'Year Today',
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary.light,
    borderColor: theme.palette.secondary.main,
    fontSize: 15,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.secondary.contrastText,
    borderColor: theme.palette.secondary.main,
  },
}))

export const AssetTable = ({ isConnected }) => {
  const { t } = useTranslation('common')
  const context = useContext(ChartDataContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Chart Provider')
  }
  const { activeRange, assetTableData, selected, setSelected } = context

  const columns = [
    { id: 'asset', label: 'Asset' },
    {
      id: 'EDRewards',
      label: 'Est Daily Rewards',
      format: (value) => value.toLocaleString('en-US'),
      align: 'right',
    },
    {
      id: 'total',
      label: `Total (${timeRangeEnum[activeRange]})`,
      format: (value) => value.toLocaleString('en-US'),
      align: 'right',
    },
  ]

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = assetTableData.map((n) => n.asset)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, asset) => {
    let selectedCopy = [...selected]
    if (selectedCopy.includes('ALL')) {
      const selectedIndex = selectedCopy.indexOf('ALL')
      selectedCopy.splice(selectedIndex, 1)
    }
    const selectedIndex = selectedCopy.indexOf(asset)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCopy, asset)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCopy.slice(1))
    } else if (selectedIndex === selectedCopy.length - 1) {
      newSelected = newSelected.concat(selectedCopy.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCopy.slice(0, selectedIndex),
        selectedCopy.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  // console.log(assetTableData)
  return (
    <>
      {isConnected && (
        <>
          <Typography
            sx={{
              color: 'primary.contrastText',
              fontWeight: 700,
              marginTop: '2rem',
              fontSize: '1.2rem',
            }}
          >
            {t('Select Assets to Include in Chart')}.
          </Typography>
          <TableContainer>
            <Table aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  {columns.map((item) => (
                    <StyledTableCell key={item.id} align={item.align}>
                      {item.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {assetTableData.map((row, index) => {
                  const isItemSelected = isSelected(row.asset)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.asset)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.asset}
                      selected={isItemSelected}
                    >
                      <StyledTableCell padding="checkbox">
                        {row.asset == 'ALL' ? (
                          <Checkbox
                            sx={{ color: 'secondary.contrastText' }}
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < assetTableData.length
                            }
                            checked={
                              assetTableData.length > 0 &&
                              selected.length === assetTableData.length
                            }
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all',
                            }}
                          />
                        ) : (
                          <Checkbox
                            sx={{ color: 'secondary.contrastText' }}
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        )}
                      </StyledTableCell>
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            data-testid={`column-${column.id}-${value}`}
                          >
                            {value}
                          </StyledTableCell>
                        )
                      })}
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

AssetTable.propTypes = {
  isConnected: PropTypes.bool,
}

AssetTable.defaultProps = {
  isConnected: false,
}

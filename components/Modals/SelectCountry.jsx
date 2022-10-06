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

import React from 'react'
import Flag from 'react-country-flag'
import PropTypes from 'prop-types'

import { Countries } from '@/lib/countries'
import { useTranslation } from 'next-i18next'

// Material UI components
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import LanguageIcon from '@mui/icons-material/Language'

export const SelectCountry = ({ sx, value, setValue }) => {
  const { t } = useTranslation('common')
  return (
    <Box sx={sx}>
      <Autocomplete
        disablePortal
        options={Countries}
        getOptionLabel={(option) => option.label}
        onChange={(event, value) => {
          setValue(value || {})
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <Flag
              countryCode={option.code}
              svg
              style={{
                fontSize: '1.4rem',
              }}
            />
            {option.label} ({option.code}) +{option.phone}
          </Box>
        )}
        renderInput={(params) => {
          //           console.log(params)
          return (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
                startAdornment: (
                  <InputAdornment position="start">
                    {value.code ? (
                      <Flag
                        countryCode={value.code}
                        svg
                        style={{
                          fontSize: '1.4rem',
                        }}
                      />
                    ) : (
                      <>
                        <LanguageIcon
                          sx={{
                            color: 'secondary.dark',
                            marginRight: '0.5rem',
                          }}
                        />
                        {t('Choose a country')}
                      </>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                ['.MuiOutlinedInput-root']: {
                  fontWeight: 600,
                  backgroundColor: 'secondary.contrastText',
                  height: '40px',
                  color: 'secondary.dark',
                  ['.MuiOutlinedInput-input']: {
                    padding: 0,
                  },
                },
              }}
              required
              id="outlined-required"
              name="country"
            />
          )
        }}
      />
    </Box>
  )
}

SelectCountry.propTypes = {
  sx: PropTypes.object,
  value: PropTypes.object,
  setValue: PropTypes.func,
}

import {useState} from 'react'
import PropTypes from 'prop-types'


import {useRouter} from 'next/router'
import Flag from 'react-country-flag'
import {i18n} from 'next-i18next.config'
import Link from '@/components/Link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'


// Map locale code to the flag used in 'react-country-flag'
const localeToFlags = {
  en: 'US',
  es: 'MX',
  nl: 'NL',
  ch: 'CN',
  tr: 'TR',
  vn: 'VN',
  id: 'ID',
  iq: 'IQ',
  my: 'MY',
  ir: 'IR',
  it: 'IT',
  jp: 'JP',
  ru: 'RU',
  se: 'SE',
  sk: 'SK',
  hu: 'HU',
  no: 'NO',
  ct: 'ES-CT',
  th: 'TH',
  in: 'IN',
  de: 'DE',
  kr: 'KR',
  fr: 'FR',
  pl: 'PL'
}

export const LanguageSelection = ( {isMobile, onClick, onChange} ) => {
  // const { t } = useTranslation('common')
  const { asPath, locale } = useRouter()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  const renderLanguageMobile = () => {
    const locales = i18n.locales.filter((localeCd) => localeCd !== locale)
    return locales.map((localeCd, idx) => {
      return (
        <Link key={idx} href={asPath} locale={localeCd}>
          <a href="#top" data-testid="dropdown-item-mobile">
            <span
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              style={{ marginBottom: '0.4rem' }}
              data-testid="dropdown-action-mobile"
            >
              {localeCd}{' '}
              <Flag data-testid="flat-item-mobile" countryCode={localeToFlags[localeCd]} svg />
            </span>
          </a>
        </Link>
      )
    })
  }

  const renderForMobile = () => {
    return (
      <>
        <Button
          data-testid="dropdown-button-mobile"
          role="button"
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        >
          <Typography component="span">
            {locale} <Flag countryCode={localeToFlags[locale]} svg />
          </Typography>
        </Button>
        {isLanguageOpen && (
          <div data-testid="dropdown-container-mobile">
            {renderLanguageMobile()}
          </div>
        )}
      </>
    )
  }

  const RenderForWeb = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    return (
      <div>
        <Button
          data-testid="dropdown-container-web"
          color="inherit"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Dashboard
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
        {/*<Link href={asPath} locale={locale}>*/}
        {/*  <a href="#top" data-testid="dropdown-button-web">*/}
        {/*    <div>*/}
        {/*      {locale} <Flag countryCode={localeToFlags[locale]} svg />*/}
        {/*    </div>*/}
        {/*  </a>*/}
        {/*</Link>*/}

        {/*<div data-testid="dropdown-container-web">*/}
        {/*  <div key={locale}>*/}
        {/*    <Link href={asPath} locale={locale}>*/}
        {/*      <a href="#top">*/}
        {/*        <div>*/}
        {/*          {locale} <Flag countryCode={localeToFlags[locale]} svg />*/}
        {/*        </div>*/}
        {/*      </a>*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*  {i18n.locales*/}
        {/*    .filter((localeCd) => localeCd !== locale)*/}
        {/*    .map((localeCd) => (*/}
        {/*      <div key={localeCd} data-testid="dropdown-item-web">*/}
        {/*        <Link href={asPath} locale={localeCd}>*/}
        {/*          <a href="#top">*/}
        {/*            <div>*/}
        {/*              {localeCd} <Flag countryCode={localeToFlags[localeCd]} svg />*/}
        {/*            </div>*/}
        {/*          </a>*/}
        {/*        </Link>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*</div>*/}
      </div>
    )
  }

  return <>{isMobile ? renderForMobile() : RenderForWeb()}</>
}

LanguageSelection.propTypes = {
  isMobile: PropTypes.bool
  // isLanguageOpen: PropTypes.bool,
}

LanguageSelection.defaultProps = {
  // isLanguageOpen: true
}

LanguageSelection.displayName = 'LanguageSelection'

export default LanguageSelection

import {useTranslation} from 'next-i18next'
import MUIToolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import LanguageSelection from '@/components/LanguageSelection'

function Toolbar({title, isMobile, onClick, ...rest}) {
  const { t } = useTranslation('toolbar')
  return (
    <MUIToolbar {...rest}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={onClick}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {title || t('title')}
      </Typography>
      <Button onClick={onClick} color="inherit">
        {t('call-to-action')}
      </Button>
      <LanguageSelection isMobile={isMobile} onClick={onClick}/>
    </MUIToolbar>
  )
}

Toolbar.defaultProps = {
  onClick: console.log
}
export default Toolbar

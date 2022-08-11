import { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getAssets } from '@/lib/getTinymanPrice'

export const PeriodContext = createContext(undefined)

export function PeriodProvider({ children }) {

  const [tinymanAssets, setTinymanAssets] = useState(null)
  const [periodAssets, setPeriodAssets] = useState([])

  useEffect(() => {
    const getAllAssets = async () => {
      const res = await getAssets()
      setTinymanAssets(res)
    }
    getAllAssets()
  }, [])


  return (
    <PeriodContext.Provider
      value={{
        periodAssets,
        setPeriodAssets,
        tinymanAssets
      }}
    >
      {children}
    </PeriodContext.Provider>
  )
}
PeriodProvider.propTypes = {
  children: PropTypes.node,
}

import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const ChartDataContext = createContext(undefined)

export function ChartDataProvider({ children }) {
  const [activeRange, setActiveRange] = useState('3M')
  const [activeStage, setActiveStage] = useState('Total')

  return (
    <ChartDataContext.Provider
      value={{ activeRange, setActiveRange, activeStage, setActiveStage }}
    >
      {children}
    </ChartDataContext.Provider>
  )
}
ChartDataProvider.propTypes = {
  children: PropTypes.node,
}

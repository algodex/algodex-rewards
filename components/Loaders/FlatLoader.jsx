import React from 'react'
import Skeleton from 'react-loading-skeleton'
import PropTypes from 'prop-types'

export const FlatLoader = ({ count, width }) => {
  return <Skeleton baseColor={'#ABB0BC'} count={count} width={width} />
}

FlatLoader.propTypes = {
  count: PropTypes.number,
  width: PropTypes.string,
}

FlatLoader.defaultProps = {
  count: 5,
  width: '100%',
}

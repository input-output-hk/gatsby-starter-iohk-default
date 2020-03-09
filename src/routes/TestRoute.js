import React from 'react'
import PropTypes from 'prop-types'
import Link from '@input-output-hk/front-end-core-components/components/Link'

const TestRoute = ({ id }) => (
  <div>
    <p>{id}</p>
    <Link href={`/test/${parseInt(id) + 1}`}>{parseInt(id) + 1}</Link>
    <Link href='/'>Home</Link>
  </div>
)

TestRoute.propTypes = {
  id: PropTypes.string
}

export default TestRoute

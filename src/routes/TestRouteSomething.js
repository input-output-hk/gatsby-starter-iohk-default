import React from 'react'
import PropTypes from 'prop-types'
import Link from '@input-output-hk/front-end-core-components/components/Link'

const TestRouteSomething = ({ id, somethingElse }) => (
  <div>
    <p>{id} something {somethingElse}</p>
    <Link href={`/test/${parseInt(id) + 1}`}>{parseInt(id) + 1}</Link>
    <Link href='/'>Home</Link>
  </div>
)

TestRouteSomething.propTypes = {
  id: PropTypes.string,
  somethingElse: PropTypes.string
}

export default TestRouteSomething

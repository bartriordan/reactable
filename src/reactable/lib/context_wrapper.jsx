import React from 'react'

const contextWrapper = (context, childContextTypes, child) => {
  const ContextWrapper = React.createClass({
    childContextTypes,
    displayName: 'ContextWrapper',
    getChildContext() { return context },
    render() { return child }
  })

  return <ContextWrapper />
}

export default contextWrapper

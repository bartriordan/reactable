// this is a bit hacky - it'd be nice if React exposed an API for this
const isReactComponent = thing => (
  thing !== null &&
  (typeof thing) === 'object' &&
  (typeof thing.props) !== 'undefined'
)

export {isReactComponent}

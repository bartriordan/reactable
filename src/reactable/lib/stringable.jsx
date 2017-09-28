const stringable = thing => (
  thing !== null &&
  (typeof thing) !== 'undefined' &&
  (typeof thing.toString) === 'function'
)

export {stringable}

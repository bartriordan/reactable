const type = candidate => (typeof candidate)

const isFunction = candidate => (type(candidate) === 'function')

const isNotFunction = candidate => !isFunction(candidate)

const isNull = candidate => (candidate === null)

const isNotNull = candidate => !isNull(candidate)

const isString = candidate => (type(candidate) === 'string')

const isNotString = candidate => !isString(candidate)

const isObject = candidate => (type(candidate) === 'object')

const isNotObject = candidate => !isObject(candidate)

// /////////////////////////////////////////////////////////////////////////////
// Checks of type undefined only:

const isUndefined = candidate => (type(candidate) === 'undefined')

const isNotUndefined = candidate => !isUndefined(candidate)


// /////////////////////////////////////////////////////////////////////////////
// Checks of type undefined and equality with null:

const isDefined = candidate => (isNotUndefined(candidate) && isNotNull(candidate))

const isNotDefined = candidate => !isDefined(candidate)


export default {
  isDefined,
  isFunction,
  isNotFunction,
  isNotDefined,
  isNotUndefined,
  isNull,
  isNotNull,
  isObject,
  isNotObject,
  isNotString,
  isString,
  isUndefined
}

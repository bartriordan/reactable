import {stringable} from './stringable'

const isDefined = candidate => ((typeof candidate) !== 'undefined' && candidate !== null)

const hasReactableMeta = candidate => (isDefined(candidate) && candidate.__reactableMeta === true) // eslint-disable-line no-underscore-dangle

const extractDataFrom = (key, column) => {
  let value
  if (hasReactableMeta(key))
    value = key.data[column]
  else
    value = key[column]

  if (hasReactableMeta(value))
    value = isDefined(value.props.value) ? value.props.value : value.value

  return (stringable(value) ? value : '')
}

export default extractDataFrom

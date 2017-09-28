import {Component, PropTypes} from 'react'

import {filterPropsFrom} from './lib/filter_props_from'
import {isNotUndefined, isObject, isUndefined} from './lib/typeChecks'
import {isReactComponent} from './lib/is_react_component'
import {isUnsafe} from './unsafe'
import {stringable} from './lib/stringable'


export class Td extends Component {
  stringifyIfNotReactComponent(object) {
    if (!isReactComponent(object) && stringable(object) && isNotUndefined(object))
      return object.toString()

    return null
  }

  render() {
    // Attach any properties on the column to this Td object to allow things like custom event handlers
    var mergedProps = filterPropsFrom(this.props)
    if (isObject(this.props.column)) {
      for (var key in this.props.column) {
        if (key !== 'key' && key !== 'name')
          mergedProps[key] = this.props.column[key]
      }
    }
    // handleClick aliases onClick event
    mergedProps.onClick = this.props.handleClick

    var stringifiedChildProps

    if (isUndefined(this.props.data))
      stringifiedChildProps = this.stringifyIfNotReactComponent(this.props.children)

    if (isUnsafe(this.props.children))
      return <td {...mergedProps} dangerouslySetInnerHTML={{__html: this.props.children.toString()}} />

    return <td {...mergedProps}>{stringifiedChildProps || this.props.children}</td>
  }
}

Td.propTypes = {
  column: PropTypes.node,
  data: PropTypes.array,
  handleClick: PropTypes.func
}

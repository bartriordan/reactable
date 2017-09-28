import React from 'react'

import {Td} from './td'

import {filterPropsFrom} from './lib/filter_props_from'
import {isDefined, isFunction, isUndefined} from './lib/typeChecks'
import {toArray} from './lib/to_array'


export class Tr extends React.Component {
  render() {
    var children = toArray(React.Children.children(this.props.children))

    if (this.props.data && this.props.columns && isFunction(this.props.columns.map)) {
      if (isUndefined(children.concat))
        console.log(children)

      children = children.concat(this.props.columns.map(function({props = {}, ...column}, i) {
        if (!this.props.data.hasOwnProperty(column.key))
          return <Td column={column} key={column.key} />

        var value = this.props.data[column.key]


        if (isDefined(value) && value.__reactableMeta === true) {
          props = value.props
          value = value.value
        }

        return <Td column={column} key={column.key} {...props}>{value}</Td>
      }.bind(this)))
    }

    // Manually transfer props
    var props = filterPropsFrom(this.props)

    return React.DOM.tr(props, children)
  }
}

Tr.childNode = Td
Tr.dataType = 'object'


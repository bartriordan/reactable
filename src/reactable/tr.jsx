import React from 'react'

import {Td} from './td'

import filterPropsFrom from './lib/filter_props_from'
import {isDefined, isFunction, isUndefined} from './lib/typeChecks'
import toArray from './lib/to_array'


export class Tr extends React.Component {
  render() {
    let children = toArray(React.Children.children(this.props.children))

    if (this.props.data && this.props.columns && isFunction(this.props.columns.map)) {
      if (isUndefined(children.concat))
        console.log(children)

      children = children.concat(this.props.columns.map(function({props = {}, ...column}, i) {
        let tdProps = props
        if (!this.props.data.hasOwnProperty(column.key))
          return <Td column={column} key={column.key} />

        let value = this.props.data[column.key]

        if (isDefined(value) && value.__reactableMeta === true) {
          tdProps = value.props
          value = value.value
        }

        return <Td column={column} key={column.key} {...tdProps}>{value}</Td>
      }.bind(this)))
    }

    return React.createElement('tr', filterPropsFrom(this.props), children)
  }
}

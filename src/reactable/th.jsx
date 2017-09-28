import {Component} from 'react'

import {filterPropsFrom} from './lib/filter_props_from'
import {isUnsafe} from './unsafe'


export class Th extends Component {
  render() {
    if (isUnsafe(this.props.children))
      return <th {...filterPropsFrom(this.props)} dangerouslySetInnerHTML={{__html: this.props.children.toString()}} />

    return <th {...filterPropsFrom(this.props)}>{this.props.children}</th>
  }
}

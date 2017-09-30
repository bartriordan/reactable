import {Children, Component, PropTypes} from 'react'

import {Th} from './th'

import {Filterer} from './filterer'
import filterPropsFrom from './lib/filter_props_from'
import {isNotUndefined, isObject, isString, isUndefined} from './lib/typeChecks'


export class Thead extends Component {
  static getColumns(component) {
    // Can't use React.Children.map since that doesn't return a proper array
    let columns = []
    Children.forEach(component.props.children, th => {
      if (!th)
        return

      var column = {}

      if (isNotUndefined(th.props)) {
        column.props = filterPropsFrom(th.props)

        // use the content as the label & key
        if (isNotUndefined(th.props.children)) {
          column.label = th.props.children
          column.key = column.label
        }

        // the key in the column attribute supersedes the one defined previously
        if (isString(th.props.column)) {
          column.key = th.props.column

          // in case we don't have a label yet
          if (isUndefined(column.label))
            column.label = column.key
        }
      }

      if (typeof column.key === 'undefined')
        throw new TypeError('<th> must have either a "column" property or a string child')
      else
        columns.push(column)
    })

    return columns
  }

  handleClickTh(column) { this.props.onSort(column.key) }

  handleKeyDownTh(column, event) {
    if (event.keyCode === 13)
      this.props.onSort(column.key)
  }

  render() {
    var Ths = []

    for (var index = 0; index < this.props.columns.length; index++) {
      var column = this.props.columns[index]
      var thClass = `reactable-th-${column.key.replace(/\s+/g, '-').toLowerCase()}`
      var sortClass = ''
      var thRole = null

      if (this.props.sortableColumns[column.key]) {
        sortClass += 'reactable-header-sortable '
        thRole = 'button'
      }

      if (this.props.sort.column === column.key) {
        sortClass += 'reactable-header-sort'
        if (this.props.sort.direction === 1)
          sortClass += '-asc'
        else
          sortClass += '-desc'
      }

      if (sortClass.length > 0)
        thClass += ` ${sortClass}`

      if (isObject(column.props) && isString(column.props.className))
        thClass += ` ${column.props.className}`

      Ths.push(
        <Th {...column.props} className={thClass} key={index} onClick={this.handleClickTh.bind(this, column)} onKeyDown={this.handleKeyDownTh.bind(this, column)} role={thRole} tabIndex='0'>
          {column.label}
        </Th>
      )
    }

    return (
      <thead {...filterPropsFrom(this.props)}>
        {
          this.props.filtering === true &&
          <Filterer
            className={this.props.filterClassName}
            colSpan={this.props.columns.length}
            onFilter={this.props.onFilter}
            placeholder={this.props.filterPlaceholder}
            value={this.props.currentFilter}
          />
        }
        <tr className='reactable-column-header'>{Ths}</tr>
      </thead>
    )
  }
}

Thead.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string
    })
  ),
  currentFilter: PropTypes.string,
  filtering: PropTypes.bool,
  filterClassName: PropTypes.string,
  filterPlaceholder: PropTypes.string,
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  sort: PropTypes.shape({
    column: PropTypes.node,
    direction: PropTypes.node
  }),
  sortableColumns: PropTypes.object
}

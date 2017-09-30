import {Children, Component, PropTypes} from 'react'

import {isUnsafe} from './unsafe'
import {Paginator} from './paginator'
import {Tfoot} from './tfoot'
import {Thead} from './thead'
import {Th} from './th' // TODO: look into why this isn't used --BLR
import {Tr} from './tr'

import {extractDataFrom} from './lib/extract_data_from'
import {filterPropsFrom} from './lib/filter_props_from'
import typeChecks from './lib/typeChecks'


export class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPage: props.currentPage,
      currentSort: {
        column: null,
        direction: props.defaultSortDescending ? -1 : 1
      },
      filter: ''
    }

    // Set the state of the current sort to the default sort
    if (props.sortBy || props.defaultSort !== false)
      this.state.currentSort = this.getCurrentSort(props.sortBy || props.defaultSort)

    this.onSort = this.onSort.bind(this)
  }

  componentWillMount() {
    this.initialize(this.props)
    this.sortByCurrentSort()
    this.filterBy(this.props.filterBy)
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
    this.updateCurrentPage(nextProps.currentPage)
    this.updateCurrentSort(nextProps.sortBy);
    this.sortByCurrentSort();
    this.filterBy(nextProps.filterBy);
  }

  filterBy(filter) { this.setState({filter}) }

  // Translate a user defined column array to hold column objects if strings are specified
  // (e.g. ['column1'] => [{key: 'column1', label: 'column1'}])
  translateColumnsArray(columns) {
    return columns.map(function(column, i) {
      if (typeChecks.isString(column)) {
        return {
          key: column,
          label: column
        }
      }

      if (typeChecks.isNotUndefined(column.sortable))
        this._sortable[column.key] = (column.sortable === true ? 'default' : column.sortable)

      return column
    }.bind(this))
  }

  parseChildData(props) {
    let data = []
    let tfoot

    // Transform any children back to a data array
    if (typeChecks.isNotUndefined(props.children)) {
      Children.forEach(props.children, child => {
        if (typeChecks.isNotDefined(child))
          return

        switch (child.type) {
          case Thead:
            break
          case Tfoot:
            if (typeChecks.isNotUndefined(tfoot)) {
              console.warn(
                'You can only have one <Tfoot>, but more than one was specified. Ignoring all but the last one'
              )
            }
            tfoot = child
            break
          case Tr:
            let childData = child.props.data || {}

            Children.forEach(child.props.children, descendant => {
              // TODO
              /* if (descendant.type.ConvenienceConstructor === Td) { */
              if (typeChecks.isNotObject(descendant) || typeChecks.isNull(descendant))
                return

              if (typeChecks.isNotUndefined(descendant.props.column)) {
                let value

                if (typeChecks.isNotUndefined(descendant.props.data))
                  value = descendant.props.data
                else if (typeChecks.isNotUndefined(descendant.props.children))
                  value = descendant.props.children
                else
                  return console.warn('exports.Td specified without a `data` property or children, ignoring')

                childData[descendant.props.column] = {
                  __reactableMeta: true,
                  props: filterPropsFrom(descendant.props),
                  value
                }
              } else {
                console.warn('exports.Td specified without a `column` property, ignoring')
              }
            })

            data.push({
              data: childData,
              props: filterPropsFrom(child.props),
              __reactableMeta: true
            })
            break

          default:
            console.warn ('The only possible children of <Table> are <Thead>, <Tr>, or one <Tfoot>.')
        }
      })
    }

    return {data, tfoot}
  }

  initialize(props) {
    this.data = props.data
    let {data, tfoot} = this.parseChildData(props)

    this.data = this.data.concat(data)
    this.tfoot = tfoot

    this.initializeSorts(props)
    this.initializeFilters(props)
  }

  initializeFilters(props) {
    this._filterable = {}

    // Transform filterable properties into a more friendly list
    for (let i in props.filterable) {
      let column = props.filterable[i]
      let columnName
      let filterFunction

      if (column instanceof Object) {
        if (typeChecks.isUndefined(column.column)) {
          console.warn('Filterable column specified without column name')
          continue
        }

        columnName = column.column

        if (typeChecks.isFunction(column.filterFunction))
          filterFunction = column.filterFunction
        else
          filterFunction = 'default'
      } else {
        columnName = column
        filterFunction = 'default'
      }

      this._filterable[columnName] = filterFunction
    }
  }

  initializeSorts(props) {
    this._sortable = {}

    // Transform sortable properties into a more friendly list
    for (let i in props.sortable) {
      let column = props.sortable[i]
      let columnName
      let sortFunction

      if (column instanceof Object) {
        if (typeChecks.isUndefined(column.column)) {
          console.warn('Sortable column specified without column name')
          return
        }
        columnName = column.column

        if (typeChecks.isFunction(column.sortFunction))
          sortFunction = column.sortFunction
        else
          sortFunction = 'default'
      } else {
        columnName = column
        sortFunction = 'default'
      }

      this._sortable[columnName] = sortFunction
    }
  }

  getCurrentSort(column) {
    let columnName
    let sortDirection

    if (column instanceof Object) {
      if (typeChecks.isUndefined(column.column)) {
        console.warn('Default column specified without column name')
        return
      }
      columnName = column.column

      if (typeChecks.isUndefined(column.direction)) {
        sortDirection = this.props.defaultSortDescending ? -1 : 1
      } else {
        if (column.direction === 1 || column.direction === 'asc') {
          sortDirection = 1
        } else if (column.direction === -1 || column.direction === 'desc') {
          sortDirection = -1
        } else {
          let defaultDirection = this.props.defaultSortDescending ? 'descending' : 'ascending'

          console.warn(`Invalid default sort specified. Defaulting to ${defaultDirection}`)
          sortDirection = this.props.defaultSortDescending ? -1 : 1
        }
      }
    } else {
      columnName = column
      sortDirection = this.props.defaultSortDescending ? -1 : 1
    }

    return {
      column: columnName,
      direction: sortDirection
    }
  }

  updateCurrentSort(sortBy) {
    if (sortBy !== false && sortBy.column !== this.state.currentSort.column && sortBy.direction !== this.state.currentSort.direction)
      this.setState({currentSort: this.getCurrentSort(sortBy)})
  }

  updateCurrentPage(nextPage) {
    if (typeChecks.isNotUndefined(nextPage) && nextPage !== this.state.currentPage)
      this.setState({currentPage: nextPage})
  }

  applyFilter(filter, children) {
    // Helper function to apply filter text to a list of table rows
    let matchedChildren = []

    for (let i = 0; i < children.length; i++) {
      let data = children[i].props.data

      for (let filterColumn in this._filterable) {
        if (typeChecks.isNotUndefined(data[filterColumn])) {
          // Default filter
          if (typeChecks.isUndefined(this._filterable[filterColumn]) || this._filterable[filterColumn] === 'default') {
            if (extractDataFrom(data, filterColumn).toString().toLowerCase().indexOf(filter.toLowerCase()) > -1) {
              matchedChildren.push(children[i])
              break
            }
          } else if (this._filterable[filterColumn](extractDataFrom(data, filterColumn).toString(), filter.toLowerCase())) { // Apply custom filter
            matchedChildren.push(children[i])
            break
          }
        }
      }
    }

    return matchedChildren
  }

  sortByCurrentSort() {
    // Apply a sort function according to the current sort in the state.
    // This allows us to perform a default sort even on a non sortable column.
    let currentSort = this.state.currentSort

    if (typeChecks.isNull(currentSort.column))
      return

    this.data.sort((itemOne, itemTwo) => {
      let keyA = extractDataFrom(itemOne, currentSort.column)
      keyA = isUnsafe(keyA) ? keyA.toString() : keyA || ''
      let keyB = extractDataFrom(itemTwo, currentSort.column)
      keyB = isUnsafe(keyB) ? keyB.toString() : keyB || ''

      // Default sort
      if (typeChecks.isUndefined(this._sortable[currentSort.column]) || this._sortable[currentSort.column] === 'default') {
        // Reverse direction if we're doing a reverse sort
        if (keyA < keyB)
          return -1 * currentSort.direction

        if (keyA > keyB)
          return 1 * currentSort.direction

        return 0
      }

      // Reverse columns if we're doing a reverse sort
      if (currentSort.direction === 1)
        return this._sortable[currentSort.column](keyA, keyB)

      return this._sortable[currentSort.column](keyB, keyA)
    })
  }

  onSort(column) {
    // Don't perform sort on unsortable columns
    if (typeChecks.isUndefined(this._sortable[column]))
      return

    let currentSort = this.state.currentSort

    if (currentSort.column === column) {
      currentSort.direction *= -1
    } else {
      currentSort.column = column
      currentSort.direction = this.props.defaultSortDescending ? -1 : 1
    }

    // Set the current sort and pass it to the sort function
    this.setState({currentSort})
    this.sortByCurrentSort()

    if (typeChecks.isFunction(this.props.onSort))
      this.props.onSort(currentSort)
  }

  render() {
    let children = []
    let columns
    let userColumnsSpecified = false
    const showHeaders = typeChecks.isUndefined(this.props.hideTableHeader)

    let firstChild = null

    if (this.props.children) {
      if (this.props.children.length > 0 && this.props.children[0] && this.props.children[0].type === Thead)
        firstChild = this.props.children[0]
      else if (this.props.children.type === Thead)
        firstChild = this.props.children
    }

    if (typeChecks.isNotNull(firstChild))
      columns = Thead.getColumns(firstChild)
    else
      columns = this.props.columns || []

    if (columns.length > 0) {
      userColumnsSpecified = true
      columns = this.translateColumnsArray(columns)
    }

    // Build up table rows
    if (this.data && typeChecks.isFunction(this.data.map)) {
      // Build up the columns array
      children = children.concat(this.data.map(function(rawData, i) {
        let data = rawData
        let props = {}

        if (rawData.__reactableMeta === true) {
          data = rawData.data
          props = rawData.props
        }

        // Loop through the keys in each data row and build a td for it
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            // Update the columns array with the data's keys if columns were not
            // already specified
            if (userColumnsSpecified === false) {
              let column = {
                key,
                label: key
              }

              // Only add a new column if it doesn't already exist in the columns array
              if (typeChecks.isUndefined(columns.find(element => (element.key === column.key))))
                columns.push(column)
            }
          }
        }

        return <Tr columns={columns} key={i} data={data} {...props} />
      }.bind(this)))
    }

    if (this.props.sortable === true) {
      for (let i = 0; i < columns.length; i++) {
        this._sortable[columns[i].key] = 'default'
      }
    }

    // Determine if we render the filter box
    let filtering = false
    if (this.props.filterable && Array.isArray(this.props.filterable) && this.props.filterable.length && !this.props.hideFilterInput)
      filtering = true

    // Apply filters
    let filteredChildren = children
    if (this.state.filter !== '')
      filteredChildren = this.applyFilter(this.state.filter, filteredChildren)

    // Determine pagination properties and which columns to display
    let itemsPerPage = 0
    let pagination = false
    let numPages
    let currentPage = this.state.currentPage

    let currentChildren = filteredChildren
    if (this.props.itemsPerPage > 0) {
      itemsPerPage = this.props.itemsPerPage
      numPages = Math.ceil(filteredChildren.length / itemsPerPage)

      if (currentPage > numPages - 1)
        currentPage = numPages - 1

      pagination = true
      currentChildren = filteredChildren.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    }

    // Manually transfer props
    let filteredProps = filterPropsFrom(this.props)

    let noDataText = this.props.noDataText ? <tr className='reactable-no-data'><td colSpan={columns.length}>{this.props.noDataText}</td></tr> : null

    var tableHeader = null
    if (columns && columns.length && showHeaders) {
      tableHeader = (
        <Thead
          columns={columns}
          currentFilter={this.state.filter}
          filterClassName={this.props.filterClassName}
          filtering={filtering}
          filterPlaceholder={this.props.filterPlaceholder}
          onFilter={
            filter => {
              this.setState({filter})
              if (this.props.onFilter)
                this.props.onFilter(filter)
            }
          }
          onSort={this.onSort}
          sort={this.state.currentSort}
          sortableColumns={this._sortable}
        />
      )
    }

    return (
      <table {...filteredProps}>
        {tableHeader}
        <tbody className='reactable-data' key='tbody'>
          {currentChildren.length > 0 ? currentChildren : noDataText}
        </tbody>
        {
          pagination === true &&
          <Paginator
            colSpan={columns.length}
            pageButtonLimit={this.props.pageButtonLimit}
            numPages={numPages}
            currentPage={currentPage}
            onPageChange={
              page => {
                this.setState({currentPage: page})
                if (this.props.onPageChange)
                  this.props.onPageChange(page)
              }
            }
            previousPageLabel={this.props.previousPageLabel}
            nextPageLabel={this.props.nextPageLabel}
          />
        }
        {this.tfoot}
      </table>
    )
  }
}

Table.defaultProps = {
  currentPage: 0,
  data: [],
  defaultSort: false,
  defaultSortDescending: false,
  filterBy: '',
  hideFilterInput: false,
  itemsPerPage: 0,
  pageButtonLimit: 10,
  sortBy: false
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string
      }),
      PropTypes.string
    ])
  ),
  currentPage: PropTypes.number,
  data: PropTypes.array,
  defaultSort: PropTypes.node,
  defaultSortDescending: PropTypes.bool,
  filterBy: PropTypes.string,
  filterClassName: PropTypes.string,
  filterPlaceholder: PropTypes.string,
  hideFilterInput: PropTypes.bool,
  hideTableHeader: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  nextPageLabel: PropTypes.string,
  noDataText: PropTypes.string,
  onFilter: PropTypes.func,
  onPageChange: PropTypes.func,
  onSort: PropTypes.func,
  pageButtonLimit: PropTypes.number,
  previousPageLabel: PropTypes.string,
  sortBy: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.string
  })
}

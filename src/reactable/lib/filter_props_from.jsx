const INTERNAL_PROPS = {
  childNode: true,
  children: true,
  column: true,
  columns: true,
  currentFilter: true,
  currentPage: true,
  data: true,
  defaultSort: true,
  defaultSortDescending: true,
  filterable: true,
  filterBy: true,
  filterClassName: true,
  filtering: true,
  filterPlaceholder: true,
  hideFilterInput: true,
  hideTableHeader: true,
  itemsPerPage: true,
  nextPageLabel: true,
  noDataText: true,
  onFilter: true,
  onPageChange: true,
  onSort: true,
  pageButtonLimit: true,
  previousPageLabel: true,
  sort: true,
  sortable: true,
  sortableColumns: true,
  sortBy: true
}

const INTERNAL_PROPS_KEYS = Object.keys(INTERNAL_PROPS)

const externalKeys = props => Object.keys(props).filter(key => !INTERNAL_PROPS_KEYS.includes(key))

const filterPropsFrom = (baseProps = {}) => externalKeys(baseProps).reduce(
  (output, key) => ({...output, [key]: baseProps[key]}),
  {}
)

export {filterPropsFrom}

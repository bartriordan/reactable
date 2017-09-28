import {Component, PropTypes} from 'react'

const pageHref = pageIndex => `#page-${pageIndex + 1}`

export class Paginator extends Component {
  constructor() {
    super()

    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
  }
  handlePrevious(event) {
    if (event)
      event.preventDefault()

    this.props.onPageChange(this.props.currentPage - 1)
  }

  handleNext(event) {
    if (event)
      event.preventDefault()

    this.props.onPageChange(this.props.currentPage + 1)
  }

  handlePageButton(page, event) {
    if (event)
      event.preventDefault()

    this.props.onPageChange(page)
  }

  renderPrevious() {
    if (this.props.currentPage === 0)
      return

    return (
      <a className='reactable-previous-page' href={pageHref(this.props.currentPage - 1)} onClick={this.handlePrevious}>
        {this.props.previousPageLabel || 'Previous'}
      </a>
    )
  }

  renderNext() {
    if (this.props.currentPage >= this.props.numPages - 1)
      return
    return (
      <a className='reactable-next-page' href={pageHref(this.props.currentPage + 1)} onClick={this.handleNext}>
        {this.props.nextPageLabel}
      </a>
    )
  }

  renderPageButton(className, pageNum) {
    return (
      <a className={className} key={pageNum} href={pageHref(pageNum)} onClick={this.handlePageButton.bind(this, pageNum)}>
        {pageNum + 1}
      </a>
    )
  }

  render() {
    if (typeof this.props.colSpan === 'undefined')
      throw new TypeError('Must pass a colSpan argument to Paginator')

    if (typeof this.props.numPages === 'undefined')
      throw new TypeError('Must pass a non-zero numPages argument to Paginator')

    if (typeof this.props.currentPage === 'undefined')
      throw new TypeError('Must pass a currentPage argument to Paginator')

    let pageButtons = []
    let pageButtonLimit = this.props.pageButtonLimit
    let currentPage = this.props.currentPage
    let numPages = this.props.numPages
    let lowerHalf = Math.round(pageButtonLimit / 2)
    let upperHalf = (pageButtonLimit - lowerHalf)

    for (let i = 0; i < this.props.numPages; i++) {
      let showPageButton = false
      let pageNum = i
      let className = 'reactable-page-button'
      if (currentPage === i)
        className += ' reactable-current-page'
      pageButtons.push( this.renderPageButton(className, pageNum))
    }

    if (currentPage - pageButtonLimit + lowerHalf > 0) {
      if (currentPage > numPages - lowerHalf)
        pageButtons.splice(0, numPages - pageButtonLimit)
      else
        pageButtons.splice(0, currentPage - pageButtonLimit + lowerHalf)
    }

    if ((numPages - currentPage) > upperHalf)
      pageButtons.splice(pageButtonLimit, pageButtons.length - pageButtonLimit)

    return (
      <tbody className='reactable-pagination'>
        <tr>
          <td colSpan={this.props.colSpan}>
            {this.renderPrevious()}
            {pageButtons}
            {this.renderNext()}
          </td>
        </tr>
      </tbody>
    )
  }
}

Paginator.defaultProps = {
  nextPageLabel: 'Next',
  previousPageLabel: 'Previous'
}

Paginator.propTypes = {
  colSpan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nextPageLabel: PropTypes.string,
  onPageChange: PropTypes.func,
  pageButtonLimit: PropTypes.number,
  previousPageLabel: PropTypes.string
}

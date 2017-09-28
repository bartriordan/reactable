import classnames from 'classnames'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export class FiltererInput extends Component {
  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
  }

  onChange() { this.props.onFilter(ReactDOM.findDOMNode(this).value) }

  render() {
    return (
      <input
        className={classnames('reactable-filter-input', this.props.className)}
        onChange={this.onChange}
        onKeyUp={this.onChange}
        placeholder={this.props.placeholder}
        type='text'
        value={this.props.value}
      />
    )
  }
}

FiltererInput.propTypes = {
  onFilter: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.node
}


export class Filterer extends Component {
  render() {
    if (typeof this.props.colSpan === 'undefined')
      throw new TypeError('Must pass a colSpan argument to Filterer')

    return (
      <tr className='reactable-filterer'>
        <td colSpan={this.props.colSpan}>
          <FiltererInput
            onFilter={this.props.onFilter}
            className={this.props.className}
            placeholder={this.props.placeholder}
            value={this.props.value}
          />
        </td>
      </tr>
    )
  }
}

Filterer.propTypes = {
  colSpan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onFilter: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.node
}

'use strict'
import React from 'react'

class TargetSelect extends React.Component {

  static propTypes = {
    target: React.PropTypes.number,
    totalLines: React.PropTypes.number,
    handleIntChange: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.target !== this.props.target || nextProps.totalLines !== this.props.totalLines
  }

  render() {
    return (
      <select className="custom-select form-control-sm" value={this.props.target} onChange={this.props.handleIntChange.bind(this, 'target', 0, this.props.totalLines - 1, true)}>
        { [...Array(this.props.totalLines).keys()].map((i) => {
          return <option key={i} value={i}>{('00' + i).substr(-3)}</option>
        }) }
      </select>
    )
  }

}
export default TargetSelect
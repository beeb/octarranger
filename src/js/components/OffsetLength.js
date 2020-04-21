'use strict'
import Radium from 'radium'
import React from 'react'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  },

  numInput: {
    width: 63,
    textAlign: 'right'
  }

}

class OffsetLength extends React.Component {

  static propTypes = {
    offset: React.PropTypes.string,
    length: React.PropTypes.string,
    handleOffsetChange: React.PropTypes.func,
    handleLengthChange: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.offset !== this.props.offset || nextProps.length !== this.props.length
  }

  render() {
    return (
      <td style={[styles.centerCell, styles.vertCell]}>
        <input type="number" className="form-control form-control-sm" min="0" max="512" step="1" style={[styles.numInput]} value={this.props.offset} onChange={this.props.handleOffsetChange}/>
        &middot;
        <input type="number" className="form-control form-control-sm" min="0" max="512" step="1" style={[styles.numInput]} value={this.props.length} onChange={this.props.handleLengthChange}/>
      </td>
    )
  }

}
export default Radium(OffsetLength)
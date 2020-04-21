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

class JumpRepeat extends React.Component {

  static propTypes = {
    repeat: React.PropTypes.number,
    handleIntChange: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.repeat !== this.props.repeat
  }

  render() {
    return (
      <td style={[styles.centerCell, styles.vertCell]}>
        <input type="number" className="form-control form-control-sm" min="0" max="64" step="1" style={[styles.numInput]} value={this.props.repeat > 0 ? String(this.props.repeat) : ''} onChange={this.props.handleIntChange.bind(this, 'repeat', 0, 64, false)} placeholder="&infin;"/>
      </td>
    )
  }

}
export default Radium(JumpRepeat)
'use strict'
import Radium from 'radium'
import React from 'react'
import classNames from 'classnames'

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

class PatternRepeat extends React.Component {

  static propTypes = {
    repeat: React.PropTypes.number,
    handleIntChange: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.repeat !== this.props.repeat
  }

  render() {
    return (
      <td key="col2" className={classNames({ 'table-success': this.props.repeat > 1 })} style={[styles.centerCell, styles.vertCell]}>
        <input type="number" className="form-control form-control-sm" min="1" max="64" step="1" style={[styles.numInput]} value={String(this.props.repeat)} onChange={this.props.handleIntChange.bind(this, 'repeat', 1, 64, false)}/>
      </td>
    )
  }

}
export default Radium(PatternRepeat)
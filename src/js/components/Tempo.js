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

  bpmInput: {
    width: 75,
    textAlign: 'right'
  }

}

class Tempo extends React.Component {

  static propTypes = {
    tempo: React.PropTypes.string,
    handleTempoChange: React.PropTypes.func,
    onTempoBlur: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.tempo !== this.props.tempo
  }

  render() {
    return (
      <td style={[styles.centerCell, styles.vertCell]}>
        <input type="number" className="form-control form-control-sm" min="0" max="300" step="0.1" value={this.props.tempo} onChange={this.props.handleTempoChange} onBlur={this.props.onTempoBlur} style={[styles.bpmInput]}/>
      </td>
    )
  }

}
export default Radium(Tempo)
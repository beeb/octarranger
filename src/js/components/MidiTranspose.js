'use strict'
import Radium from 'radium'
import React from 'react'
import _ from 'lodash'

import Transpose from '../Transpose'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  },

  transposeInput: {
    width: 45,
    textAlign: 'center'
  }

}

class MidiTranspose extends React.Component {

  static propTypes = {
    midiTranspose: React.PropTypes.instanceOf(Transpose),
    handleTransposeChange: React.PropTypes.func,
    onTransposeBlur: React.PropTypes.func,
    show: React.PropTypes.bool
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.midiTranspose !== this.props.midiTranspose || nextProps.show !== this.props.show
  }

  render() {
    let midi = []
    if (this.props.show) {
      this.props.midiTranspose.forEach((m, k) => {
        midi.push({ key: k, value: m })
      })
      midi = _.sortBy(midi, [(m) => { return m.key }])
    }
    let transpose = midi.map((t) => {
      return (
        <span key={t.key}>
          <input type="text" className="form-control form-control-sm" value={t.value} placeholder="---" onChange={this.props.handleTransposeChange.bind(this, t.key)} onBlur={this.props.onTransposeBlur.bind(this, t.key)} data-toggle="tooltip" title={'T' + (t.key)} data-trigger="focus" style={[styles.transposeInput]}/>
          { parseInt(t.key, 10) === 4 && '\u00B7' }
        </span>
      )
    })
    return (
      <td style={[styles.centerCell, styles.vertCell]}>{this.props.show && transpose}</td>
    )
  }

}
export default Radium(MidiTranspose)
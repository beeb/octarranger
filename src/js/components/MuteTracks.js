'use strict'
import Radium from 'radium'
import React from 'react'
import _ from 'lodash'

import PlayTracks from '../PlayTracks'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  },

  audio: {
    borderRight: '1px solid #aaa'
  },
  midi: {}

}

class MuteTracks extends React.Component {

  static propTypes = {
    playTracks: React.PropTypes.instanceOf(PlayTracks),
    handleMuteCheckbox: React.PropTypes.func,
    type: React.PropTypes.string
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.playTracks !== this.props.playTracks
  }

  render() {
    let tracks = []
    this.props.playTracks.forEach((m, k) => {
      tracks.push({ key: k, value: m })
    })
    tracks = _.sortBy(tracks, [(m) => { return m.key }])
    let muteTracks = tracks.map((m) => {
      return (
        <span key={'ma' + m.key}>
          <label className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" checked={m.value} onChange={this.props.handleMuteCheckbox.bind(this, m.key, this.props.type === 'audio')}/>
            <span className="custom-control-indicator"/>
          </label>
          { parseInt(m.key, 10) === 4 && '\u00B7\xa0' }
        </span>
      )
    })
    return (
      <td key="col8" style={[styles.centerCell, styles.vertCell, styles[this.props.type]]}>{muteTracks}</td>
    )
  }

}
export default Radium(MuteTracks)
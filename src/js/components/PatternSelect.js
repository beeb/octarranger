'use strict'
import Radium from 'radium'
import React from 'react'
import ReactDOM from 'react-dom'

import Icon from './Icon'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  },

  patternSelect: {
    width: 65
  }

}

class PatternSelect extends React.Component {

  static propTypes = {
    patternId: React.PropTypes.number,
    shiftPattern: React.PropTypes.func,
    handleIntChange: React.PropTypes.func,
    handleTypeChange: React.PropTypes.func
  }

  componentDidMount() {
    window.$(ReactDOM.findDOMNode(this.refs.link)).tooltip()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.patternId !== this.props.patternId
  }

  render() {
    let patternSelect = (
      <span>
        <button className="btn btn-secondary btn-sm" onClick={this.props.shiftPattern.bind(this, -1)}><Icon icon="angle-left"/></button>
        <select className="custom-select form-control-sm" value={this.props.patternId} onChange={this.props.handleIntChange.bind(this, 'patternId', 0, 255, true)} style={[styles.patternSelect]}>
          { [...Array(16).keys()].map((i) => {
            return (
              <optgroup key={'group-' + i} label={String.fromCharCode(i + 65)}>
                {[...Array(16).keys()].map((j) => {
                  return <option key={16 * i + j} value={16 * i + j}>{String.fromCharCode(i + 65)}{('0' + (((16 * i + j) % 16) + 1)).substr(-2)}</option>
                })}
              </optgroup>
            )
          }) }
        </select>
        <button className="btn btn-secondary btn-sm" onClick={this.props.shiftPattern.bind(this, 1)}><Icon icon="angle-right"/></button>
      </span>
    )
    return (<td style={[styles.vertCell, styles.vertCell]}><a href="#" title="Click to cycle type" data-toggle="tooltip" data-trigger="hover" onClick={this.props.handleTypeChange} ref="link">PLAY:</a>&nbsp;{patternSelect}</td>)
  }

}
export default Radium(PatternSelect)
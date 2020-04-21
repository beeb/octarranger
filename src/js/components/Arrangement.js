'use strict'
import Radium from 'radium'
import ReactDOM from 'react-dom'
import React from 'react'
import { List } from 'immutable'
window.jQuery = window.$ = require('jquery')
require('floatthead')
import _ from 'lodash'

import ArrangementLine from './ArrangementLine'
import _ArrangerLine from '../_ArrangerLine'

const styles = {

  mainContainer: {
    paddingTop: '2rem'
  },

  table: {
    fontFamily: 'Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
  },

  centerCell: {
    textAlign: 'center'
  },

  black: {
    backgroundColor: 'black'
  },

  headingCheckbox: {
    marginBottom: '1.1rem'
  }

}

class Arrangement extends React.Component {

  constructor() {
    super()

    this.state = {
      showCols: {
        midiTranspose: true,
        sceneA: true,
        sceneB: true
      }
    }
  }

  static propTypes = {
    filename: React.PropTypes.string,
    arrName: React.PropTypes.string,
    totalLines: React.PropTypes.number,
    items: React.PropTypes.instanceOf(List),
    localStorage: React.PropTypes.bool
  }

  componentWillMount() {
    let showCols = _.cloneDeep(this.state.showCols)
    if (this.props.localStorage && localStorage.getItem('octarranger.showCols') !== null) {
      let tempShowCols = JSON.parse(localStorage.getItem('octarranger.showCols'))
      _.forOwn(tempShowCols, (v, k) => {
        showCols[k] = v
      })
    }
    this.setState({
      showCols: showCols
    })
  }

  componentDidMount() {
    let $table = window.$(ReactDOM.findDOMNode(this.refs.table))
    $table.floatThead({
      responsiveContainer: function (table) {
        return table.closest('.table-responsive')
      }
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.filename !== this.props.filename || nextProps.arrName !== this.props.arrName || nextProps.totalLines !== this.props.totalLines || nextProps.items !== this.props.items || !_.isEqual(this.state, nextState)
  }

  handleCheckbox = (col, e) => {
    let showCols = _.cloneDeep(this.state.showCols)
    showCols[col] = e.target.checked
    this.setState({ showCols: showCols }, () => {
      if (this.props.localStorage) {
        localStorage.setItem('octarranger.showCols', JSON.stringify(this.state.showCols))
        window.dispatchEvent(new Event('resize'))
      }
    })
  }

  render() {
    let rows = this.props.items.map((line, i) => {
      return (
        <ArrangementLine key={line.uuid} item={line} index={i} totalLines={this.props.totalLines} prevPattern={this.props.items.getIn([i - 1, 'patternId']) || 0} showCols={this.state.showCols}/>
      )
    })
    rows = rows.push(<ArrangementLine key={this.props.totalLines} totalLines={this.props.totalLines}/>)

    let totalTime = 'Total time calculation needs BPM on row 000'
    if (this.props.items.get(0) && this.props.items.get(0).tempo !== '') {
      let totalSeconds = 0
      let currentBpm = 0
      let loopCounter = -1
      for(let i = 0; i < this.props.items.size; i++) {
        const item = this.props.items.get(i)
        if (item.type === _ArrangerLine.type.PATTERN) {
          if (item.tempo !== '') {
            currentBpm = parseFloat(item.tempo)
          }
          let steps = item.length * item.repeat / 4
          totalSeconds += (steps / currentBpm) * 60
        } else if (item.type === _ArrangerLine.type.JUMP) {
          if (item.target < i) {
            if (item.repeat === 0) {
              totalTime = 'Total time: infinite loop at ' + (('00' + i).substr(-3))
              currentBpm = -1
              break
            }
            if (loopCounter === -1) {
              loopCounter = item.repeat - 1
              i = item.target - 1
            } else if (loopCounter === 0) {
              loopCounter = -1
            } else if (loopCounter > 0) {
              loopCounter--
              i = item.target - 1
            }
          } else if (item.target > i) {
            i = item.target - 1
          }
          //if halt we ignore
        }
      }
      if (currentBpm > 0) {
        let minutes = parseInt(totalSeconds / 60, 10)
        let seconds = parseInt(totalSeconds % 60, 10)

        let formatted = (minutes < 10 ? '0' + minutes : minutes) + 'm:' + (seconds < 10 ? '0' + seconds : seconds) + 's'
        totalTime = formatted + '*'
      }
    }

    return (
      <div className="container-fluid" style={[styles.mainContainer]}>
        { this.props.filename && (<h2>{this.props.arrName || 'Untitled'} <small>({this.props.totalLines} lines - {totalTime})</small></h2>)}
        <div className="table-responsive">
          <form className="form-inline">
            <table className="table table-bordered table-striped table-sm" style={[styles.table]} ref="table">
              <colgroup>
                <col width="60"/>
                <col width="150"/>
                <col width="185"/>
                <col width="54"/>
                <col width="155"/>
                <col width="75"/>
                <col width="75"/>
                <col width="95"/>
                <col width="225"/>
                <col width="225"/>
                <col/>
              </colgroup>
              <thead className="thead-inverse">
                <tr>
                  <th style={[styles.centerCell]}>ROW</th>
                  <th style={[styles.centerCell]}>ACTIONS</th>
                  <th style={[styles.centerCell]}>PATTERN</th>
                  <th style={[styles.centerCell]}>REP</th>
                  <th style={[styles.centerCell]}>OFF&middot;LEN</th>
                  <th style={[styles.centerCell]}>
                    <label className="custom-control custom-checkbox" style={[styles.headingCheckbox]}>
                      <input type="checkbox" className="custom-control-input" checked={this.state.showCols.sceneA} onChange={this.handleCheckbox.bind(this, 'sceneA')} />
                      <span className="custom-control-indicator"/>
                    </label>
                    { this.state.showCols.sceneA ? 'SC A' : 'A' }
                  </th>
                  <th style={[styles.centerCell]}>
                    <label className="custom-control custom-checkbox" style={[styles.headingCheckbox]}>
                      <input type="checkbox" className="custom-control-input" checked={this.state.showCols.sceneB} onChange={this.handleCheckbox.bind(this, 'sceneB')} />
                      <span className="custom-control-indicator"/>
                    </label>
                    { this.state.showCols.sceneB ? 'SC B' : 'B' }
                  </th>
                  <th style={[styles.centerCell]}>BPM</th>
                  <th style={[styles.centerCell]}>AUDIO</th>
                  <th style={[styles.centerCell]}>MIDI</th>
                  <th style={[styles.centerCell]}>
                    <label className="custom-control custom-checkbox" style={[styles.headingCheckbox]}>
                      <input type="checkbox" className="custom-control-input" checked={this.state.showCols.midiTranspose} onChange={this.handleCheckbox.bind(this, 'midiTranspose')} />
                      <span className="custom-control-indicator"/>
                    </label>
                    { this.state.showCols.midiTranspose ? 'MIDI TRANSPOSE' : 'MT' }
                  </th>
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </table>
          </form>
        </div>
      </div>
    )
  }

}
export default Radium(Arrangement)
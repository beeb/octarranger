'use strict'
import Radium from 'radium'
import React from 'react'
import ReactDOM from 'react-dom'
import { Record } from 'immutable'
import _ from 'lodash'
import classNames from 'classnames'

import actions from '../actions/OctaActions'
import PlayTracks from '../PlayTracks'
import Transpose from '../Transpose'
import _ArrangerLine from '../_ArrangerLine'

import EndLine from './EndLine'
import RemarkLine from './RemarkLine'
import JumpLine from './JumpLine'
import JumpRepeat from './JumpRepeat'
import MidiTranspose from './MidiTranspose'
import MuteTracks from './MuteTracks'
import PatternSelect from './PatternSelect'
import PatternRepeat from './PatternRepeat'
import OffsetLength from './OffsetLength'
import SceneAB from './SceneAB'
import Tempo from './Tempo'
import Actions from './Actions'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  },

  cellWidth: {
    width: 60
  }

}

class ArrangementLine extends React.Component {

  constructor (props) {
    super(props)

    this.state = { item: props.item }
  }

  static propTypes = {
    index: React.PropTypes.number,
    item: React.PropTypes.instanceOf(Record),
    totalLines: React.PropTypes.number,
    prevPattern: React.PropTypes.number,
    showCols: React.PropTypes.object
  }

  static defaultProps = {
    item: null
  }

  highlight = () => {
    if (this.props.item && this.props.item.highlight) {
      let $row = window.$(ReactDOM.findDOMNode(this.refs.row))
      $row.css('backgroundColor', '#ff8484')
      setTimeout(() => {
        $row.css('backgroundColor', '')
        actions.resetHighlight(this.props.index)
      }, 500)
    }
  }

  componentDidMount() {
    let $row = window.$(ReactDOM.findDOMNode(this.refs.row))
    $row.find('[data-toggle="tooltip"]').tooltip()
    this.highlight()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.item !== this.state.item) {
      this.setState({ item: nextProps.item })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.index !== this.props.index || nextProps.prevPattern !== this.props.prevPattern || nextState.item !== this.state.item || nextProps.totalLines !== this.props.totalLines || !_.isEqual(nextProps.showCols, this.props.showCols)
  }

  componentDidUpdate () {
    this.highlight()
  }

  handleMuteCheckbox = (track, audio, e) => {
    const item = this.state.item.setIn([audio ? 'playAudio' : 'playMidi', String(track)], e.target.checked)
    this.setState({ item: item }, () => {
      actions.updateItem(this.props.index, item)
    })
  }

  handleTextChange = (field, e) => {
    let string = ''
    _.forEach(e.target.value, (c) => {
      let code = c.charCodeAt(0)
      if (code > 31 && code !== 127 && code < 256) { //todo, proper table
        string += c
      }
    })
    const item = this.state.item.set(field, string)
    this.setState({ item: item }, () => {
      this.saveForm()
    })
  }

  handleIntChange = (field, min, max, instant, e) => {
    let value = parseInt(e.target.value, 10)
    value = isNaN(value) ? min : value > max ? max : value < min ? min : value
    const item = this.state.item.set(field, value)
    this.setState({ item: item }, () => {
      if (instant) { actions.updateItem(this.props.index, item) }
      else { this.saveForm() }
    })
  }

  handleOffsetChange = (e) => {
    let value = parseInt(e.target.value, 10)
    value = isNaN(value) ? 0 : value > 512 ? 512 : value < 0 ? 0 : value
    let length = this.state.item.length
    length = length > (512 - value) ? (512 - value) : length
    const item = this.state.item.merge({ offset: value, length: length })
    this.setState({ item: item }, () => {
      this.saveForm()
    })
  }

  handleLengthChange = (e) => {
    let value = parseInt(e.target.value, 10)
    value = isNaN(value) ? 0 : value > (512 - this.state.item.offset) ? (512 - this.state.item.offset) : value < 0 ? 0 : value
    const item = this.state.item.set('length', value)
    this.setState({ item: item }, () => {
      this.saveForm()
    })
  }

  handleTempoChange = (e) => {
    let value = parseFloat(e.target.value)
    value = isNaN(value) ? '' : value > 300 ? '300.0' : value < 0 ? '' : value
    let left = parseInt(value, 10)
    let rawTempo = Math.ceil(left * 24 + (value - left) * 25)
    const item = this.state.item.merge({ tempo: value, rawTempo: rawTempo })
    this.setState({ item: item }, () => {
      this.saveForm()
    })
  }

  onTempoBlur = () => {
    let value = parseFloat(this.state.item.tempo)
    value = value === 0.0 || isNaN(value) ? '' : value < 30 && value > 0 ? '30.0' : value.toFixed(1)
    if (this.state.item.tempo === value) { return }
    let rawTempo = 0
    if (value !== '') {
      let left = parseInt(value, 10)
      rawTempo = Math.ceil(left * 24 + (value - left) * 25)
    }
    const item = this.state.item.merge({ tempo: value, rawTempo: rawTempo })
    this.setState({ item: item }, () => {
      actions.updateItem(this.props.index, item)
    })
  }

  handleTransposeChange = (track, e) => {
    let value = parseInt(e.target.value, 10)
    value = value > 48 ? '48' : value < -48 ? '-48' : e.target.value
    const item = this.state.item.setIn(['midiTranspose', String(track)], value)
    this.setState({ item: item }, () => {
      this.saveForm()
    })
  }

  onTransposeBlur = (track) => {
    let value = parseInt(this.state.item.midiTranspose[track], 10)
    value = value === 0 || isNaN(value) ? '' : value < -48 ? '-48' : value > 48 ? '+48' : (value > 0 ? '+' : '-') + ('0' + Math.abs(value)).substr(-2)
    if (this.state.item.midiTranspose[track] === value) { return }
    const item = this.state.item.setIn(['midiTranspose', String(track)], value)
    this.setState({ item: item }, () => {
      actions.updateItem(this.props.index, item)
    })
  }

  shiftPattern = (amount, e) => {
    e.preventDefault()
    let attempt = this.state.item.patternId + amount
    let value = attempt > 255 ? 0 : attempt < 0 ? 255 : attempt
    const item = this.state.item.set('patternId', value)
    this.setState({ item: item }, () => {
      actions.updateItem(this.props.index, item)
    })
  }

  handleTypeChange = (e) => {
    e.preventDefault()
    window.$(e.target).tooltip('hide')
    let item = this.state.item
    switch (this.state.item.type) {
    case _ArrangerLine.type.REMARK:
      item = new _ArrangerLine({ type: _ArrangerLine.type.JUMP, target: this.props.index, playAudio: new PlayTracks(), playMidi: new PlayTracks(), midiTranspose: new Transpose() })
      break
    case _ArrangerLine.type.JUMP:
      item = new _ArrangerLine({ type: _ArrangerLine.type.PATTERN, patternId: this.props.prevPattern, playAudio: new PlayTracks(), playMidi: new PlayTracks(), midiTranspose: new Transpose() })
      break
    case _ArrangerLine.type.PATTERN:
      item = new _ArrangerLine({ type: _ArrangerLine.type.REMARK, playAudio: new PlayTracks(), playMidi: new PlayTracks(), midiTranspose: new Transpose() })
      break
    default:
    }
    this.setState({ item: item }, () => {
      actions.updateItem(this.props.index, item)
    })
  }

  saveForm() {
    /*clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.timer = null
      actions.updateItem(this.props.index, this.state.item)
    }, 200)*/
    actions.updateItem(this.props.index, this.state.item)
  }

  handleDuplicate = (e) => {
    e.preventDefault()
    e.target = window.$(e.target).is('button') ? e.target : window.$(e.target).closest('button').get(0)
    e.target.blur()
    actions.duplicateItem(this.props.index)
  }

  handleMoveDown = (e) => {
    e.preventDefault()
    e.target = window.$(e.target).is('button') ? e.target : window.$(e.target).closest('button').get(0)
    e.target.blur()
    actions.moveItemDown(this.props.index)
  }

  handleMoveUp = (e) => {
    e.preventDefault()
    e.target = window.$(e.target).is('button') ? e.target : window.$(e.target).closest('button').get(0)
    e.target.blur()
    actions.moveItemUp(this.props.index)
  }

  handleRemove = (e) => {
    e.preventDefault()
    e.target = window.$(e.target).is('button') ? e.target : window.$(e.target).closest('button').get(0)
    e.target.blur()
    if (window.confirm('Are you sure you want to remove line ' + ('00' + this.props.index).substr(-3) + '?')) {
      //window.$(this.refs.row).find('th, td').css({ position: 'relative' }).animate({ top: -36 }, 'fast')
      window.$(this.refs.row).animate({ opacity: 0 }, 'fast', () => {
        actions.removeItem(this.props.index).then(() => {
          //window.$(this.refs.row).find('th, td').css({ position: 'static', top: 0 })
          //window.$(this.refs.row).css({ opacity: 1 })
        })
      })
    }
  }

  render() {
    if (this.state.item === null) {
      return <EndLine totalLines={this.props.totalLines}/>
    }
    let isRemark = this.state.item.type === _ArrangerLine.type.REMARK
    let isJump = this.state.item.type === _ArrangerLine.type.JUMP
    let isPattern = this.state.item.type === _ArrangerLine.type.PATTERN

    return (
      <tr ref="row" className={classNames({
        'table-info': this.state.item.type === _ArrangerLine.type.REMARK,
        'table-warning': this.state.item.type === _ArrangerLine.type.JUMP,
        'bg-anim': true
      })}>
        <th scope="row" style={[styles.centerCell, styles.vertCell, styles.cellWidth]}>&nbsp;{('00' + this.props.index).substr(-3)}&nbsp;</th>
        <Actions
          canAdd={this.props.totalLines < 256}
          handleDuplicate={this.handleDuplicate}
          handleMoveDown={this.handleMoveDown}
          handleMoveUp={this.handleMoveUp}
          handleRemove={this.handleRemove}
        />
        { isRemark && <RemarkLine
          key="colRemark"
          index={this.props.index}
          text={this.state.item.text}
          handleTextChange={this.handleTextChange}
          handleTypeChange={this.handleTypeChange}
        /> }
        
        { isJump && <JumpLine
          key="colJump"
          index={this.props.index}
          totalLines={this.props.totalLines}
          target={this.state.item.target}
          handleIntChange={this.handleIntChange}
          handleTypeChange={this.handleTypeChange}
        /> }
        { isJump && this.state.item.target < this.props.index && <JumpRepeat key="colJumpRepeat" repeat={this.state.item.repeat} handleIntChange={this.handleIntChange}/>}
        { isJump && this.state.item.target < this.props.index && <td key="colJump3" colSpan="7">&nbsp;</td>}

        { isPattern && <PatternSelect
          key="colPattern"
          patternId={this.state.item.patternId}
          shiftPattern={this.shiftPattern}
          handleIntChange={this.handleIntChange}
          handleTypeChange={this.handleTypeChange}
        /> }
        { isPattern && <PatternRepeat
          key="colPatternRepeat"
          repeat={this.state.item.repeat}
          handleIntChange={this.handleIntChange}
        /> }
        { isPattern && <OffsetLength
          key="colOffsetLength"
          offset={this.state.item.formatted('offset')}
          length={this.state.item.formatted('length')}
          handleOffsetChange={this.handleOffsetChange}
          handleLengthChange={this.handleLengthChange}
        /> }
        { isPattern && <SceneAB
          key="colSceneA"
          type="A"
          sceneAB={this.state.item.sceneA}
          handleIntChange={this.handleIntChange}
          show={this.props.showCols.sceneA}
        /> }
        { isPattern && <SceneAB
          key="colSceneB"
          type="B"
          sceneAB={this.state.item.sceneB}
          handleIntChange={this.handleIntChange}
          show={this.props.showCols.sceneB}
        /> }
        { isPattern && <Tempo
          key="colTempo"
          tempo={String(this.state.item.tempo)}
          handleTempoChange={this.handleTempoChange}
          onTempoBlur={this.onTempoBlur}
        /> }
        { isPattern && <MuteTracks
          key="colMuteAudio"
          playTracks={this.state.item.playAudio}
          handleMuteCheckbox={this.handleMuteCheckbox}
          type="audio"
        /> }
        { isPattern && <MuteTracks
          key="colMuteMidi"
          playTracks={this.state.item.playMidi}
          handleMuteCheckbox={this.handleMuteCheckbox}
          type="midi"
        /> }
        { isPattern && <MidiTranspose
          key="colMidiTranspose"
          midiTranspose={this.state.item.midiTranspose}
          handleTransposeChange={this.handleTransposeChange}
          onTransposeBlur={this.onTransposeBlur}
          show={this.props.showCols.midiTranspose}
        /> }
      </tr>
    )
  }

}
export default Radium(ArrangementLine)
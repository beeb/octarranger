'use strict'
import Radium from 'radium'
import React from 'react'
import ReactDOM from 'react-dom'

import TargetSelect from './TargetSelect'

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

class JumpLine extends React.Component {

  static propTypes = {
    index: React.PropTypes.number,
    target: React.PropTypes.number,
    totalLines: React.PropTypes.number,
    handleIntChange: React.PropTypes.func,
    handleTypeChange: React.PropTypes.func
  }

  componentDidMount() {
    window.$(ReactDOM.findDOMNode(this.refs.link)).tooltip()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.index !== this.props.index || nextProps.target !== this.props.target || nextProps.totalLines !== this.props.totalLines
  }

  render() {
    let select = <TargetSelect target={this.props.target} totalLines={this.props.totalLines} handleIntChange={this.props.handleIntChange}/>
    if (this.props.target === this.props.index) {
      return (<td colSpan="9" style={[styles.vertCell]}><a href="#" title="Click to cycle type" data-toggle="tooltip" data-trigger="hover" onClick={this.props.handleTypeChange} ref="link">HALT:</a>&nbsp;{select}</td>)
    } else if (this.props.target > this.props.index) {
      return (<td colSpan="9" style={[styles.vertCell]}><a href="#" title="Click to cycle type" data-toggle="tooltip" data-trigger="hover" onClick={this.props.handleTypeChange} ref="link">JUMP:</a>&nbsp;{select}</td>)
    }
    return (
      <td key="col1" style={[styles.vertCell]}><a href="#" data-toggle="tooltip" data-trigger="hover" title="Click to cycle type" onClick={this.props.handleTypeChange} ref="link">LOOP:</a>&nbsp;{select}</td>
    )
  }

}
export default Radium(JumpLine)
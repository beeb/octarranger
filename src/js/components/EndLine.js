'use strict'
import Radium from 'radium'
import React from 'react'

import actions from '../actions/OctaActions'
import Icon from './Icon'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  }

}

class EndLine extends React.Component {

  static propTypes = {
    totalLines: React.PropTypes.number
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.totalLines !== this.props.totalLines
  }

  handleAppendEmpty = (e) => {
    e.preventDefault()
    actions.appendEmptyItem()
  }

  render() {
    return (
      <tr ref="row" className="table-active">
        <th style={[styles.centerCell, styles.vertCell]} scope="row">{('00' + this.props.totalLines).substr(-3)}</th>
        <td>{ this.props.totalLines < 256 && <button type="button" className="btn btn-outline-success btn-sm" onClick={this.handleAppendEmpty} title="Add line above"><Icon icon="plus-square"/></button> }&nbsp;</td>
        <td colSpan="9">END OF ARRANGEMENT</td>
      </tr>
    )
  }

}
export default Radium(EndLine)
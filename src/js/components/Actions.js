'use strict'
import Radium from 'radium'
import React from 'react'

import Icon from './Icon'

const styles = {

  vertCell: {
    verticalAlign: 'middle'
  },

  actions: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
  }

}

class Actions extends React.Component {

  static propTypes = {
    canAdd: React.PropTypes.bool,
    handleDuplicate: React.PropTypes.func,
    handleMoveDown: React.PropTypes.func,
    handleMoveUp: React.PropTypes.func,
    handleRemove: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.canAdd !== this.props.canAdd
  }

  render() {
    return (
      <td style={[styles.vertCell, styles.actions]}>
        <button type="button" className="btn btn-outline-success btn-sm" onClick={this.props.handleDuplicate} title="Duplicate line below" disabled={!this.props.canAdd}><Icon icon="plus"/></button>&nbsp;
        <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.handleMoveDown} title="Move line down one position"><Icon icon="arrow-down"/></button>&nbsp;
        <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.handleMoveUp} title="Move line up one position"><Icon icon="arrow-up"/></button>&nbsp;
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={this.props.handleRemove} title="Remove line"><Icon icon="times"/></button>
      </td>
    )
  }

}
export default Radium(Actions)
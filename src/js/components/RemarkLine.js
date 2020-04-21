'use strict'
import Radium from 'radium'
import React from 'react'
import ReactDOM from 'react-dom'

const styles = {

  vertCell: {
    verticalAlign: 'middle'
  },

  label: {
    marginBottom: 0
  }

}

class RemarkLine extends React.Component {

  static propTypes = {
    index: React.PropTypes.number,
    text: React.PropTypes.string,
    handleTextChange: React.PropTypes.func,
    handleTypeChange: React.PropTypes.func
  }

  componentDidMount() {
    window.$(ReactDOM.findDOMNode(this.refs.link)).tooltip()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.text !== this.props.text
  }

  render() {
    return (
      <td
        colSpan="9"
        style={[styles.vertCell]}
      >
        <div className="form-group">
          <label style={[styles.label]}><a href="#" title="Click to cycle type" data-toggle="tooltip" data-trigger="hover" onClick={this.props.handleTypeChange} ref="link">REMARK:</a>&nbsp;</label>
          <input type="text" className="form-control form-control-sm" value={this.props.text} maxLength="15" onChange={this.props.handleTextChange.bind(this, 'text')}/>
        </div>
      </td>
    )
  }

}
export default Radium(RemarkLine)
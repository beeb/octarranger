'use strict'
import React from 'react'

class Icon extends React.Component {

  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    color: React.PropTypes.string
  }

  render() {
    let iStyle = {}
    if (this.props.color) {
      iStyle.color = this.props.color
    }
    return (
      <i className={'fa fa-' + this.props.icon} aria-hidden={true} style={iStyle} {...this.props}/>
    )
  }

}
export default Icon
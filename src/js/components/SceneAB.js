'use strict'
import Radium from 'radium'
import React from 'react'

const styles = {

  centerCell: {
    textAlign: 'center'
  },

  vertCell: {
    verticalAlign: 'middle'
  }

}

class SceneAB extends React.Component {

  static propTypes = {
    type: React.PropTypes.string,
    sceneAB: React.PropTypes.number,
    handleIntChange: React.PropTypes.func,
    show: React.PropTypes.bool
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.sceneAB !== this.props.sceneAB || nextProps.show !== this.props.show
  }

  render() {
    return (
      <td style={[styles.centerCell, styles.vertCell]}>
        { this.props.show && <select className="custom-select form-control-sm" value={this.props.sceneAB} onChange={this.props.handleIntChange.bind(this, 'scene' + this.props.type, 1, 256, true)}>
          <option value="256"/>
          { [...Array(16).keys()].map((i) => {
            return <option key={i} value={i + 1}>{('0' + (i + 1)).substr(-2)}</option>
          }) }
        </select> }
      </td>
    )
  }

}
export default Radium(SceneAB)
'use strict'
import Radium from 'radium'
import React from 'react'

import OctaStore from '../stores/OctaStore'

const styles = {
  
  jumbotron: {
    padding: '2rem',
    margin: 0,
    color: 'white',
    background: '#373a3c'
  },

  logoContainer: {
    overflow: 'visible'
  },

  logo: {
    maxWidth: 420,
    width: 'calc(100% - 35px)'
  },

  logoSafe: {
    width: '90%'
  }

}

class Header extends React.Component {

  render() {
    return (
      <div className="jumbotron jumbotron-fluid" style={[styles.jumbotron]}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6" style={[styles.logoContainer]}>
              <a href="#"><img src="img/octarranger.svg" alt="OctArranger" style={[styles.logoSafe, styles.logo]} /></a><sup>v{OctaStore.state.version}</sup>
            </div>
            <div className="col-sm-12 col-md-6 text-muted">
              Tested with Octatrack OS 1.25H and Chrome only. Compatibility with other versions/browsers not guaranteed. Make backups anyway!
            </div>
          </div>
        </div>
      </div>
    )
  }

}
export default Radium(Header)
'use strict'
/* globals document, window */
import ReactDOM from 'react-dom'
import React from 'react'
window.Tether = require('tether')
require('bootstrap')

import App from './components/App'

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

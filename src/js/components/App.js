'use strict'
/* globals Modernizr, $ */
import { StyleRoot } from 'radium'
import React from 'react'

import Header from './Header'
import OpenForm from './OpenForm'
import Spinner from './Spinner'
import Arrangement from './Arrangement'
import Icon from './Icon'

import OctaStore from '../stores/OctaStore'
import actions from '../actions/OctaActions'

class App extends React.Component {

  constructor (props) {
    super(props)
  }

  static getStores() {
    return [OctaStore]
  }

  componentDidMount() {
    OctaStore.listen(this.onChange)
    if (!Modernizr.filereader) {
      $('#file-api-warning').modal('show')
    }
    actions.setLocalStorageSupport()
  }

  componentWillUnmount() {
    OctaStore.unlisten(this.onChange)
  }

  onChange = () => {
    this.forceUpdate()
  }

  handleNew = (e) => {
    e.preventDefault()
    actions.createNewArrangement()
  }

  render() {
    return (
      <StyleRoot>
        <Header/>
        <OpenForm
          error={OctaStore.state.error}
          errorMessage={OctaStore.state.errorMessage}
          filename={OctaStore.state.filename}
          loading={OctaStore.state.loading}
          lastSave={OctaStore.state.lastSave}
          restored={OctaStore.state.restored}
        />
        {
          OctaStore.state.loading
          ?
          <Spinner/>
          :
          OctaStore.state.filename
          ?
          <Arrangement
            filename={OctaStore.state.filename}
            arrName={OctaStore.state.arrName}
            totalLines={OctaStore.state.totalLines}
            items={OctaStore.state.items}
            localStorage={OctaStore.state.localStorage}
          />
          :
          <div className="container text-xs-center m-t-3 m-b-3">
            <button type="button" className="btn btn-success" onClick={this.handleNew}><Icon icon="plus-circle" /> Create empty</button>
          </div>
        }
      </StyleRoot>
    )
  }

}
export default App


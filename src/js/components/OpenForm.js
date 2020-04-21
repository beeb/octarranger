'use strict'
import Radium from 'radium'
import React from 'react'
import color from 'color'
import classNames from 'classnames'

import actions from '../actions/OctaActions'
import Icon from './Icon'

const redActive = {
  backgroundColor: color('#dd2626').darken(0.1).hexString(),
  borderColor: color('#dd2626').darken(0.12).hexString()
}

const styles = {

  formContainer: {
    backgroundColor: '#eee',
    paddingTop: '2rem'
  },

  formRow: {
    marginBottom: '2rem'
  },

  messages: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    marginBottom: '1.2rem',
    marginLeft: '2rem'
  },

  red: {
    backgroundColor: '#dd2626',
    borderColor: '#dd2626',
    ':hover': redActive,
    ':active': redActive,
    ':focus': redActive
  }

}

class OpenForm extends React.Component {

  static propTypes = {
    lastSave: React.PropTypes.string,
    error: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    filename: React.PropTypes.string,
    loading: React.PropTypes.bool,
    restored: React.PropTypes.bool
  }

  handleFileChange = (e) => {
    if (this.props.filename === '' || window.confirm('All modifications not saved to a file will be lost. Continue?')) {
      let file = e.target.files[0]
      actions.readFile(file)
    } else {
      e.target.value = ''
    }
  }

  handleReloadFile = () => {
    if (window.confirm('All modifications not saved to a file will be lost. Continue?')) {
      let file = this.refs.fileInput.files[0]
      actions.readFile(file)
    }
  }

  handleClear = () => {
    if (window.confirm('All modifications not saved to a file will be lost. Continue?')) {
      actions.clearFile()
    }
  }

  handleSaveFile = () => {
    actions.saveFile()
  }

  render() {
    return (
      <div className="container-fluid" style={[styles.formContainer]}>
        <div className="row">
          <div className="col-xs-12" style={[styles.formRow]}>
            <p>Please open <strong>arr#.work</strong> from your Octatrack memory card to start. The file is gonna be loaded into the memory and will periodically be saved in your browser's storage. When you want to copy the modifications onto your Octatrack, click "Save to file" and replace the file you had previously uploaded. Make sure to have a backup copy somewhere. In case you accidentally leave this page without saving, the site will attempt to restore the last auto-save.</p>
            <p><small><strong>*</strong> Total time calculation is only correct if the "normal" (i.e. not "per track") scale setup mode is enabled and all pattern tempo multipliers are set to 1 in scale setup. Without parsing the bank files, there is no way to know the scale setup for each pattern, hence the assumption that tempo multiplier is 1 everywhere.</small></p>
            <div className="row">
              <div className="col-sm-6">
                <label className={classNames({
                  'custom-file': true,
                  'disabled': this.props.loading
                })}>
                  <input type="file" className="custom-file-input" onChange={this.handleFileChange} accept=".strd,.work" ref="fileInput" />
                  <span className="custom-file-control"/>
                </label>
                <span style={[styles.messages]}>
                  { this.props.error && <small className="form-text text-danger">{this.props.errorMessage}</small> }
                  { this.props.filename && !this.props.error && <small className="form-text text-muted"><Icon icon="upload"/>&nbsp;{this.props.restored ? 'Auto-save' : this.props.filename} loaded</small> }
                </span>
              </div>
              <div className="col-sm-6">
                <button type="button" className="btn btn-secondary" onClick={this.handleReloadFile} disabled={!this.props.filename || this.props.loading || this.refs.fileInput.files.length === 0 }><Icon icon="sync-alt"/> Reload from file</button>&nbsp;&nbsp;&nbsp;
                <button type="button" className="btn btn-success" style={[styles.red]} onClick={this.handleSaveFile} disabled={!this.props.filename || this.props.loading}><Icon icon="hdd"/> Save to file</button>&nbsp;&nbsp;&nbsp;
                <button type="button" className="btn btn-outline-danger" onClick={this.handleClear} disabled={!this.props.filename}><Icon icon="eraser"/> Clear</button>
                { this.props.lastSave && <small className="text-muted">&nbsp;&nbsp; <Icon icon="save"/>&nbsp;Auto-saved at {this.props.lastSave}</small> }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
export default Radium(OpenForm)
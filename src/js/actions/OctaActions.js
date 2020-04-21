'use strict'
import alt from '../alt'
import $ from 'jquery'

class OctaActions {

  setLocalStorageSupport () {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('feature_test', 'yes')
        if (localStorage.getItem('feature_test') === 'yes') {
          localStorage.removeItem('feature_test')
          return true
        }
      } catch(e) {/*disabled*/}
    }
    $('#local-storage-warning').modal('show')
    return false
  }
  
  readFile (file) {
    
    return (dispatch) => {
      dispatch(file.name)
      let reader = new FileReader()

      reader.addEventListener('load', () => {
        setTimeout(() => {
          this.readFileSuccess(reader.result)
        }, 100)
      })
      reader.addEventListener('error', (err) => {
        this.readFileFailed(err.name)
      })

      reader.readAsArrayBuffer(file)
    }

  }

  readFileSuccess (arrayBuffer) {
    return arrayBuffer
  }

  readFileFailed (error) {
    return error
  }

  saveFile() {
    return true
  }

  clearFile() {
    return true
  }

  createNewArrangement() {
    return true
  }

  updateItem (index, item) {
    return { index: index, item: item }
  }

  duplicateItem (index) {
    return index
  }

  appendEmptyItem () {
    return true
  }

  moveItemDown (index) {
    return index
  }

  moveItemUp (index) {
    return index
  }

  removeItem (index) {
    return (dispatch) => {
      let promise = $.Deferred()
      dispatch({ index: index, promise: promise })
      return promise
    }
  }

  resetHighlight (index) {
    return index
  }

}

export default alt.createActions(OctaActions)
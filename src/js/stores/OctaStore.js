'use strict'
import alt from '../alt'
import OctaActions from '../actions/OctaActions'
import { Record, List } from 'immutable'
import immutable from 'alt-utils/lib/ImmutableUtil'
import transit from 'transit-immutable-js'
import { saveAs } from 'file-saver'
//import _ from 'lodash'

import ArrangerLine from '../ArrangerLine'
import PlayTracks from '../PlayTracks'
import Transpose from '../Transpose'
import _ArrangerLine from '../_ArrangerLine'

const S4 = function() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}

const State = Record({
  version: '***version***',
  restored: false,
  localStorage: false,
  lastSave: '',
  loading: false,
  error: false,
  errorMessage: '',
  filename: '',
  arrName: '',
  totalLines: 0,
  byteArray: new Uint8Array(),
  header: new Uint8Array(),
  footer: new Uint8Array(),
  items: List()
}, 'state')

class OctaStore {
  constructor() {
    this.state = new State()

    this.bindListeners({
      onSetLocalStorageSupport: OctaActions.setLocalStorageSupport,
      onReadFile: OctaActions.readFile,
      onReadFileSuccess: OctaActions.readFileSuccess,
      onReadFileFailed: OctaActions.readFileFailed,
      onSaveFile: OctaActions.saveFile,
      onClearFile: OctaActions.clearFile,
      onCreateNewArrangement: OctaActions.createNewArrangement,
      onUpdateItem: OctaActions.updateItem,
      onDuplicateItem: OctaActions.duplicateItem,
      onAppendEmptyItem: OctaActions.appendEmptyItem,
      onMoveItemDown: OctaActions.moveItemDown,
      onMoveItemUp: OctaActions.moveItemUp,
      onRemoveItem: OctaActions.removeItem,
      onResetHighlight: OctaActions.resetHighlight
    })

    setInterval(() => {
      if (this.state.localStorage && this.state.filename) {
        let stateTransit = transit.withRecords([State, _ArrangerLine, PlayTracks, Transpose])
        localStorage.setItem('octarranger.snapshot', stateTransit.toJSON(this.state.merge({ restored: true, 'lastSave': '' })))
        localStorage.setItem('octarranger.snapshotversion', this.state.version)
        this.setState(this.state.merge({ lastSave: new Date().toTimeString().split(' ')[0] }))
      }
    }, 15000)
  }

  onSetLocalStorageSupport (available) {
    this.setState(new State({ localStorage: available }))
    if (available) {
      let snapshot = localStorage.getItem('octarranger.snapshot')
      let snapshotversion = localStorage.getItem('octarranger.snapshotversion')
      if (snapshot !== null && snapshotversion !== null) {
        this.setState(new State({ loading: true, localStorage: available }))
        setTimeout(() => {
          let savedVersion = snapshotversion.split('.')
          savedVersion.pop()
          savedVersion = savedVersion.join('.')
          let currentVersion = this.state.version.split('.')
          currentVersion.pop()
          currentVersion = currentVersion.join('.')
          if (savedVersion !== currentVersion) {
            localStorage.removeItem('octarranger.snapshot')
            localStorage.removeItem('octarranger.snapshotversion')
            this.setState(new State({ localStorage: available }))
          } else {
            let stateTransit = transit.withRecords([State, _ArrangerLine, PlayTracks, Transpose])
            let savedState = stateTransit.fromJSON(snapshot)
            this.setState(savedState.set('version', this.state.version))
          }
        }, 100)
      } else {
        localStorage.removeItem('octarranger.snapshot')
        localStorage.removeItem('octarranger.snapshotversion')
      }
    }
  }

  onReadFile (filename) {
    this.setState(this.state.merge({ filename: filename, loading: true, restored: false }))
  }

  onReadFileSuccess (arrayBuffer) {
    let byteArray = new Uint8Array(arrayBuffer)
    let name = ''
    let totalLines = 0
    // name
    let i = 24
    while (byteArray[i] !== 0) {
      name += String.fromCharCode(byteArray[i])
      i += 1
    }
    totalLines = byteArray[40] * 256 + byteArray[41]

    let header = byteArray.slice(0, 40)
    let footer = byteArray.slice(-10)

    let items = []
    for (i = 42; i < 42 + totalLines * 22; i += 22 ) {
      items.push(new ArrangerLine(byteArray.slice(i, i + 22)))
    }
    this.setState(this.state.merge({ loading: false, byteArray: byteArray, header: header, footer: footer, arrName: name, totalLines: totalLines, items: items }))
  }

  onReadFileFailed (error) {
    this.setState(this.state.merge({ loading: false, error: true, errorMessage: error, filename: '' }))
  }

  onSaveFile() {
    let intArray = [].concat(Array.prototype.slice.call(this.state.header), [parseInt(this.state.totalLines / 256, 10), this.state.totalLines % 256])
    this.state.items.forEach((l) => {
      let array = l.toArray()
      intArray = intArray.concat(array)
    })
    for (let i = 0; i < (256 - this.state.totalLines) * 22; i++) {
      intArray.push(0)
    }
    intArray.push(0)
    intArray.push(1)
    intArray = intArray.concat(Array.prototype.slice.call(this.state.header.slice(24, 40)))
    intArray = intArray.concat([parseInt(this.state.totalLines / 256, 10), this.state.totalLines % 256])
    this.state.items.forEach((l) => {
      let array = l.toArray()
      intArray = intArray.concat(array)
    })
    for (let i = 0; i < (256 - this.state.totalLines) * 22; i++) {
      intArray.push(0)
    }
    intArray = intArray.concat(Array.prototype.slice.call(this.state.footer.slice(0, 8)))

    let rdx = -4 //i suppose we could start a 0 and set rax to 17, then also adapting the while condition
    let r15 = 0 //will contain the checksum
    let rax = 21
    let rsi, rcx, rdi
    do {
      rcx = intArray[rdx + rax - 1] & 0xff //intArray contains all the file data minus the checksum
      rsi = rcx + r15
      if (rsi <= 0xffff) {
        rcx = rsi
      } else {
        rcx = rsi & 0xffff
      }
      rdi = intArray[rdx + rax] & 0xff
      rsi = rdi + rcx
      if (rsi <= 0xffff) {
        r15 = rsi
      } else {
        r15 = rsi & 0xffff
      }
      rax += 2
    } while (rax !== 11339)
    let r12 = parseInt(r15 / 256, 10)
    let rbx = r15 % 256
    intArray.push(r12)
    intArray.push(rbx)

    let byteArray = Uint8Array.from(intArray)
    let blob = new Blob([byteArray], {type: 'application/octet-binary'})
    saveAs(blob, this.state.filename)
    
  }

  onClearFile() {
    this.setState(new State({ localStorage: this.state.localStorage }))
    localStorage.removeItem('octarranger.snapshot')
  }

  onCreateNewArrangement() {
    this.onClearFile()
    let nameArray = []
    for (let i = 0; i < 'OctArranger'.length; i++) {
      nameArray.push('OctArranger'.charCodeAt(i))
    }
    this.setState(this.state.merge({
      filename: 'arr01.work',
      arrName: 'OctArranger',
      header: Uint8Array.from([
        70, 79, 82, 77, 0, 0, 0, 0,
        68, 80, 83, 49, 65, 82, 82, 65,
        0, 0, 0, 0, 0, 6, 0, 0].concat(
          nameArray,
          [0, 0, 0, 0, 0]
        )),
      footer: Uint8Array.from([
        1, 0, 0, 0, 0, 0, 0, 0, 255, 255
      ])
    }))
  }

  onUpdateItem (payload) {
    this.setState(this.state.setIn(['items', String(payload.index)], payload.item))
  }

  onDuplicateItem (index) {
    if (this.state.totalLines >= 256) { return }
    let items = this.state.items.insert(index+1, this.state.items.get(index).merge({ uuid: (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase(), highlight: true }))
    this.setState(this.state.merge({ items: items, totalLines: this.state.totalLines + 1 }))
  }

  onAppendEmptyItem () {
    if (this.state.totalLines >= 256) { return }
    let items = this.state.items.push(new _ArrangerLine({ highlight: true, type: _ArrangerLine.type.PATTERN, playAudio: new PlayTracks(), playMidi: new PlayTracks(), midiTranspose: new Transpose() }))
    this.setState(this.state.merge({ items: items, totalLines: this.state.totalLines + 1 }))
    window.dispatchEvent(new Event('resize'))
  }

  onMoveItemDown (index) {
    if (this.state.items.has(index + 1)) {
      let moving = this.state.items.get(index).set('highlight', true)
      let items = this.state.items.set(index, this.state.items.get(index + 1))
      this.setState(this.state.set('items', items.set(index + 1, moving)))
    }
  }

  onMoveItemUp (index) {
    if (this.state.items.has(index - 1)) {
      let moving = this.state.items.get(index).set('highlight', true)
      let items = this.state.items.set(index, this.state.items.get(index - 1))
      this.setState(this.state.set('items', items.set(index - 1, moving)))
    }
  }

  onRemoveItem (payload) {
    this.setState(this.state.merge({ items: this.state.items.delete(payload.index), totalLines: this.state.totalLines - 1 }))
    payload.promise.resolve()
  }

  onResetHighlight (index) {
    this.setState(this.state.setIn(['items', index, 'highlight'], false))
  }

}

export default alt.createStore(immutable(OctaStore), 'OctaStore')
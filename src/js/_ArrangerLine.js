'use strict'
import { Record } from 'immutable'
import PlayTracks from './PlayTracks'
import Transpose from './Transpose'

const S4 = function() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}

export default class _ArrangerLine extends Record({
  uuid: '',
  type: -1,
  text: '',
  patternId: 0,
  target: 0,
  repeat: 1,
  playAudio: PlayTracks,
  playMidi: PlayTracks,
  tempo: '',
  rawTempo: 0,
  sceneA: 0,
  sceneB: 0,
  offset: 0,
  length: 64,
  midiTranspose: Transpose,
  highlight: false
}, '_arrangerline') {

  constructor(obj) {
    obj.uuid = (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
    super(obj) 
  }

  static type = {
    NONE: -1,
    PATTERN: 0,
    JUMP: 1,
    REMARK: 2
  }

  formatted(param) {
    return ('00' + this[param]).substr(-3) 
  }

  get bank() {
    return String.fromCharCode((this.patternId / 16) + 65)
  }

  get pattern() {
    return ('0' + ((this.patternId % 16) + 1)).substr(-2)
  }

  toArray() {
    let result = []

    switch (this.type) {
    case _ArrangerLine.type.PATTERN: {
      result.push(0) //type
      result.push(this.patternId)
      result.push(this.repeat - 1)
      result.push(0) //unused
      let binary = ''
      for (let i = 8; i >= 1; i--) {
        binary += this.playAudio[i] ? '0' : '1'
      }
      result.push(parseInt(binary, 2)) //audio
      binary = ''
      for (let i = 8; i >= 1; i--) {
        binary += this.playMidi[i] ? '0' : '1'
      }
      result.push(parseInt(binary, 2)) //midi
      result.push(parseInt(this.rawTempo / 256, 10))
      result.push(this.rawTempo % 256)
      result.push(this.sceneA - 1)
      result.push(this.sceneB - 1)
      result.push(parseInt(this.offset / 256, 10))
      result.push(this.offset % 256)
      let offsetPlusLength = this.offset + this.length
      result.push(parseInt(offsetPlusLength / 256, 10))
      result.push(offsetPlusLength % 256)
      for (let i = 1; i <= 8; i++) {
        let transpose = parseInt(this.midiTranspose[i], 10)
        if (isNaN(transpose)) { transpose = 0 }
        result.push(transpose < 0 ? 256 + transpose : transpose)
      }
      break
    }
    case _ArrangerLine.type.JUMP: {
      result.push(1) //type
      result.push(0) //unused
      result.push(this.repeat)
      result.push(this.target)
      result = result.concat([0, 0, 0, 0, 255, 255, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0])
      break
    }
    case _ArrangerLine.type.REMARK: {
      result.push(2) //type
      let len = this.text.length
      for (let i = 0; i < len; i++) {
        result.push(this.text.charCodeAt(i))
      }
      let fill = Array.apply(null, Array(15 - len + 6)).map(Number.prototype.valueOf, 0)
      result = result.concat(fill)
      break
    }
    default:
    }

    //return Uint8Array.from(result)
    return result
  }

}
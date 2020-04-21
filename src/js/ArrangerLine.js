'use strict'
import _ from 'lodash'

import PlayTracks from './PlayTracks'
import Transpose from './Transpose'
import _ArrangerLine from './_ArrangerLine'

export default function ArrangerLine (bytes) {
  let obj = {
    type: bytes[0],
    text: '',
    patternId: -1,
    target: -1,
    repeat: 0,
    playAudio: new PlayTracks(),
    playMidi: new PlayTracks(),
    tempo: '',
    rawTempo: 0,
    sceneA: 0,
    sceneB: 0,
    offset: 0,
    length: 64,
    midiTranspose: new Transpose()
  }

  switch (obj.type) {
  case _ArrangerLine.type.PATTERN:
    _.forEach(bytes, (byte, i) => {
      switch (i) {
      case 1: // pattern
        obj.patternId = byte
        break
      case 2: // repeat
        obj.repeat = byte+1 //caution, deduce one for PATTERN types when exporting
        break
      case 4: { // audio mute
        if (byte === 0) {
          break
        }
        // from right to left, 0 is "play", 1 is mute
        // rightmost (first) bit is T1
        // byte = parseInt(binaryString, 2)
        let length = 8
        let binary = ''
        while (length--) {
          binary = ((byte >> length) & 1) + binary
        }
        let temp = obj.playAudio.toObject()
        for (let j = 1; j <= 8; j++) {
          temp[j] = binary[j-1] === '0'
        }
        obj.playAudio = obj.playAudio.merge(temp)
        break
      }
      case 5: { // midi mute
        if (byte === 0) {
          break
        }
        let length = 8
        let binary = ''
        while (length--) {
          binary = ((byte >> length) & 1) + binary
        }
        let temp = obj.playMidi.toObject()
        for (let j = 1; j <= 8; j++) {
          temp[j] = binary[j-1] === '0'
        }
        obj.playMidi = obj.playMidi.merge(temp)
        break
      }
      case 6: { // tempo
        let rawTempo = byte*256 + bytes[i+1]
        obj.rawTempo = rawTempo
        if (rawTempo === 0) {
          break
        }
        let left = parseInt(rawTempo / 24, 10)
        let right = parseInt((rawTempo - (left * 24)) / 2.5, 10)
        obj.tempo = (parseFloat(left) + (right / 10)).toFixed(1)        
        // left = parseInt(tempo, 10)
        // rawTempo = Math.ceil(left * 24 + (tempo - left) * 25)
        break
      }
      case 8: // scene A
        obj.sceneA = byte === 256 ? 0 : byte+1
        break
      case 9: // scene B
        obj.sceneB = byte === 256 ? 0 : byte+1
        break
      case 10: { // pattern offset
        let offset = byte*256 + bytes[i+1]
        obj.offset = offset
        break
      }
      case 12: { // pattern length
        let offsetPlusLength = byte*256 + bytes[i+1]
        obj.length = offsetPlusLength - obj.offset
        break
      }
      case 14: // midi transpose
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21: {
        let t = byte > 48 ? byte - 256 : byte
        obj.midiTranspose = obj.midiTranspose.set(i-13, t !== 0 ? (t > 0 ? '+' : '-') + ('0' + Math.abs(t)).substr(-2) : '')
        break
      }
      default:
        return true
      }
      return true
    })
    break
  case _ArrangerLine.type.JUMP:
    _.forEach(bytes, (byte, i) => {
      switch (i) {
      case 2: // repeat
        obj.repeat = byte //export as-is
        break
      case 3: // target
        obj.target = byte
        break
      default:
        return true
      }
      return true
    })
    break
  case _ArrangerLine.type.REMARK: {
    let j = 1
    while (bytes[j] > 0) {
      obj.text += String.fromCharCode(bytes[j])
      j += 1
    }
    break
  }
  default:
    obj.type = _ArrangerLine.type.NONE
  }

  return new _ArrangerLine(obj)
}

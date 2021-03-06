import assert from 'assert'
import { validate as uuidValidate } from 'uuid'

interface Mapping {
  [key: string]: string
}

const mapping: Mapping = {
  a: 'ðą',
  b: 'ðĪ',
  c: 'ðĶ',
  d: 'ðŧ',
  e: 'ð',
  f: 'ð',
  0: 'â',
  1: 'ð',
  2: 'ð',
  3: 'âĄ',
  4: 'ð°',
  5: 'ðĪ',
  6: 'ðŧ',
  7: 'ðĻ',
  8: 'ðĨ',
  9: 'ð',
  '-': 'ð',
}

const mappingInverse: Mapping = Object.keys(mapping).reduce((acc, key) => {
  acc[mapping[key]] = key
  return acc
}, {})

// ðððŊððððŧð°ðŠīððð°ðŠēðŠīð°ððððŠīðĩð°ðĪðąðŠīðĪððððŧððð°ðŧððð

export function encode(uuid: string): string {
  assert(uuidValidate(uuid), 'Invite code invalid')
  const emoji = uuid
    .split('')
    .map((char) => {
      if (!mapping[char]) {
        throw new Error('Invite code format incorrect')
      }
      return mapping[char]
    })
    .join('')
  return emoji
}

export function decode(uuidEmoji: string): string {
  const uuid = Array.from(uuidEmoji)
    .map((char) => {
      if (!mappingInverse[char]) {
        throw new Error('Invite code format incorrect')
      }
      return mappingInverse[char]
    })
    .join('')
  assert(uuidValidate(uuid), 'Invite code invalid')
  return uuid
}

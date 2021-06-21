import assert from 'assert'
import { validate as uuidValidate } from 'uuid'

interface Mapping {
  [key: string]: string
}

const mapping: Mapping = {
  a: '😱',
  b: '🤌',
  c: '👑',
  d: '🌻',
  e: '🌈',
  f: '🌞',
  A: '🦑',
  B: '⚡',
  C: '️🎨',
  D: '💘',
  E: '⌛',
  F: '🔥',
  0: '⛏',
  1: '🍍',
  2: '🍑',
  3: '🪲',
  4: '💰',
  5: '🤖',
  6: '😻',
  7: '🐯',
  8: '🌵',
  9: '💎',
  '-': '🪴',
}

const mappingInverse: Mapping = Object.keys(mapping).reduce((acc, key) => {
  acc[mapping[key]] = key
  return acc
}, {})

// 🍑🍍🐯👑🍑🍍🌻💰🪴🌈🌞💰🪲🪴💰🌈🌈🍑🪴🌵💰🤖😱🪴🤖👑🍍👑😻💎🍍💰🌻🌞🌈🌞

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

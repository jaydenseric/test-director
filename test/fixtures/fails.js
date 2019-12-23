'use strict'

const assert = require('assert')
const { TestDirector } = require('../../')

const tests = new TestDirector()
tests.add('a', () => {
  throw new Error('Message.')
})
tests.add('b', () => {
  assert.strictEqual(0, 1)
})
tests.add('c', () => {
  assert.strictEqual(0, 1, 'Message.')
})
tests.add('d', () => {
  throw { message: 'Message.' }
})
tests.add('e', () => {
  throw {}
})
tests.add('f', () => {
  throw 'Message.'
})
tests.add('g', () => {
  throw null
})
tests.run()

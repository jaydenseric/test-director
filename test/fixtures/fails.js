'use strict'

const { TestDirector } = require('../../')

const tests = new TestDirector()
tests.add('a', () => {
  throw new Error('Message.')
})
tests.add('b', () => {})
tests.run()

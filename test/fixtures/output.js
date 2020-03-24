'use strict'

const TestDirector = require('../../lib/TestDirector.js')

const tests = new TestDirector()
tests.add('a', () => {
  console.info('Message.')
})
tests.run()

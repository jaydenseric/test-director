'use strict'

const { TestDirector } = require('../../')

const tests = new TestDirector()
tests.add('a', () => {
  console.info('Message.')
})
tests.run()

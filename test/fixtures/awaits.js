'use strict'

const { TestDirector } = require('../../')
const sleep = require('../sleep')

const tests = new TestDirector()
tests.add('a', async () => {
  await sleep(50)
  console.info('Message A.')
})
tests.add('b', () => {
  console.info('Message B.')
})
tests.run()

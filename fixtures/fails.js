'use strict'

const { ok } = require('assert')
const { TestDirector } = require('..')

const testDirector1 = new TestDirector()

testDirector1.add('Test with sub tests.', async () => {
  const testDirector2 = new TestDirector()

  testDirector2.add('Passing test.', () => {})
  testDirector2.add('Failing test with standard error.', () => {
    throw new Error('Message.')
  })
  testDirector2.add('Failing test with assertion error.', () => {
    ok(false)
  })

  await testDirector2.run(true)
})

testDirector1.add('Passing test.', () => {})
testDirector1.add('Failing test with standard error.', () => {
  throw new Error('Message.')
})

testDirector1.run()

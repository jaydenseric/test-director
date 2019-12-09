'use strict'

const { TestDirector } = require('..')

const testDirector1 = new TestDirector()

testDirector1.add('Test with sub tests.', async () => {
  const testDirector2 = new TestDirector()

  testDirector2.add('Passing test A.', () => {})
  testDirector2.add('Passing test B.', () => {})

  await testDirector2.run(true)
})

testDirector1.add('Passing test D.', () => {})

testDirector1.run()

'use strict'

const { TestDirector } = require('../../')

const tests = new TestDirector()
tests.add('a', () => {})
tests.run()

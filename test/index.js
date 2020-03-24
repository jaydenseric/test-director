'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const path = require('path')
const { TestDirector } = require('..')

const FIXTURES_PATH = path.join(__dirname, 'fixtures')
const NODE_VERSION_MAJOR = parseInt(process.versions.node.split('.')[0])

/**
 * Manually removes error trace lines from console output that would normally be
 * ignored via the `stack-utils` option `ignoredPackages` when the published
 * package is used from `node_modules`.
 *
 * The simulation is worth doing so it’s not forgotten that consumers will see
 * something different. Also, it removes the burden of having to update line
 * numbers in assertions every time the source changes.
 *
 * I tried using [`install-from`](https://npm.im/install-from#api) to install
 * the package in `test/fixtures/node_modules` every test run, but then code
 * coverage doesn’t work as it’s a copy of the code that runs.
 * @kind function
 * @name simulatePublishedTraces
 * @param {string} output Console output.
 * @returns {string} Simulated output.
 * @ignore
 */
function simulatePublishedTraces(output) {
  return output.replace(/^.*\(index\.js:.*$(?:\r\n?|\n)/gm, '')
}

const tests = [
  () => {
    console.info('Test: Add two tests with the same name.')

    const tests = new TestDirector()
    tests.add('a', () => {})
    assert.throws(
      () => {
        tests.add('a', () => {})
      },
      { message: 'A test called `a` has already been added.' }
    )
  },

  () => {
    console.info('Test: Test with an invalid test function type.')

    const tests = new TestDirector()
    assert.throws(
      () => {
        tests.add('a', '')
      },
      { message: 'Test must be a function.' }
    )
  },

  () => {
    console.info('Test: Test passes.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'passes'),
    ])

    if (error) throw error

    assert.strictEqual(
      stdout.toString(),
      '\nTest: \u001b[1ma\u001b[22m\n\n\u001b[32m\u001b[1m1/1 tests passed.\u001b[39m\u001b[22m\n\n'
    )
    assert.strictEqual(stderr.toString(), '')
    assert.strictEqual(status, 0)
  },

  () => {
    console.info('Test: Test with console output.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'output'),
    ])

    if (error) throw error

    assert.strictEqual(
      stdout.toString(),
      '\nTest: \u001b[1ma\u001b[22m\n  Message.\n\n\u001b[32m\u001b[1m1/1 tests passed.\u001b[39m\u001b[22m\n\n'
    )
    assert.strictEqual(stderr.toString(), '')
    assert.strictEqual(status, 0)
  },

  () => {
    console.info('Test: Awaits tests in sequence.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'awaits'),
    ])

    if (error) throw error

    assert.strictEqual(
      stdout.toString(),
      '\nTest: \u001b[1ma\u001b[22m\n  Message A.\n\nTest: \u001b[1mb\u001b[22m\n  Message B.\n\n\u001b[32m\u001b[1m2/2 tests passed.\u001b[39m\u001b[22m\n\n'
    )
    assert.strictEqual(stderr.toString(), '')
    assert.strictEqual(status, 0)
  },

  () => {
    console.info('Test: Test fails.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'fails'),
    ])

    if (error) throw error

    assert.strictEqual(
      stdout.toString(),
      '\nTest: \u001b[1ma\u001b[22m\n\nTest: \u001b[1mb\u001b[22m\n\nTest: \u001b[1mc\u001b[22m\n\nTest: \u001b[1md\u001b[22m\n\nTest: \u001b[1me\u001b[22m\n\nTest: \u001b[1mf\u001b[22m\n\nTest: \u001b[1mg\u001b[22m\n\nTest: \u001b[1mh\u001b[22m\n\nTest: \u001b[1mi\u001b[22m\n\n\u001b[31m\u001b[1m0/9 tests passed.\u001b[39m\u001b[22m\n\n'
    )
    assert.strictEqual(
      simulatePublishedTraces(stderr.toString()),
      NODE_VERSION_MAJOR < 12
        ? "  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31m\u001b[2mtests.add (test/fixtures/fails.js:8:9)\n  Object.<anonymous> (test/fixtures/fails.js:41:7)\u001b[39m\u001b[22m\n  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31mInput A expected to strictly equal input B:\n  + expected - actual\n  \n  - 0\n  + 1\u001b[39m\n  \n  \u001b[31m\u001b[2mtests.add (test/fixtures/fails.js:24:10)\n  Object.<anonymous> (test/fixtures/fails.js:41:7)\u001b[39m\u001b[22m\n  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31m\u001b[2mtests.add (test/fixtures/fails.js:27:10)\n  Object.<anonymous> (test/fixtures/fails.js:41:7)\u001b[39m\u001b[22m\n  \n  \u001b[31m{ message: 'Message.' }\u001b[39m\n  \n  \u001b[31m{}\u001b[39m\n  \n  \u001b[31m'Message.'\u001b[39m\n  \n  \u001b[31mnull\u001b[39m\n"
        : "  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31m\u001b[2mtest/fixtures/fails.js:8:9\n  Object.<anonymous> (test/fixtures/fails.js:41:7)\u001b[39m\u001b[22m\n  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31mExpected values to be strictly equal:\n  \n  0 !== 1\u001b[39m\n  \n  \u001b[31m\u001b[2mtest/fixtures/fails.js:24:10\n  Object.<anonymous> (test/fixtures/fails.js:41:7)\u001b[39m\u001b[22m\n  \n  \u001b[31mMessage.\u001b[39m\n  \n  \u001b[31m\u001b[2mtest/fixtures/fails.js:27:10\n  Object.<anonymous> (test/fixtures/fails.js:41:7)\u001b[39m\u001b[22m\n  \n  \u001b[31m{ message: 'Message.' }\u001b[39m\n  \n  \u001b[31m{}\u001b[39m\n  \n  \u001b[31m'Message.'\u001b[39m\n  \n  \u001b[31mnull\u001b[39m\n"
    )
    assert.strictEqual(status, 1)
  },

  () => {
    console.info('Test: Nested tests.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'nested'),
    ])

    if (error) throw error

    assert.strictEqual(
      stdout.toString(),
      '\nTest: \u001b[1ma\u001b[22m\n  \n  Test: \u001b[1mb\u001b[22m\n\n\u001b[31m\u001b[1m0/1 tests passed.\u001b[39m\u001b[22m\n\n'
    )
    assert.strictEqual(
      simulatePublishedTraces(stderr.toString()),
      NODE_VERSION_MAJOR < 12
        ? '    \n    \u001b[31mMessage.\u001b[39m\n    \n    \u001b[31m\u001b[2mtests.add (test/fixtures/nested.js:9:11)\n    tests.add (test/fixtures/nested.js:11:15)\n    Object.<anonymous> (test/fixtures/nested.js:13:7)\u001b[39m\u001b[22m\n  \n  \u001b[31m\u001b[31m\u001b[1m0/1 tests passed.\u001b[39m\u001b[31m\u001b[22m\u001b[39m\n  \n  tests.add (test/fixtures/nested.js:11:15)\n  Object.<anonymous> (test/fixtures/nested.js:13:7)\u001b[39m\u001b[22m\n'
        : '    \n    \u001b[31mMessage.\u001b[39m\n    \n    \u001b[31m\u001b[2mtest/fixtures/nested.js:9:11\n    test/fixtures/nested.js:11:15\n    Object.<anonymous> (test/fixtures/nested.js:13:7)\u001b[39m\u001b[22m\n  \n  \u001b[31m\u001b[31m\u001b[1m0/1 tests passed.\u001b[39m\u001b[31m\u001b[22m\u001b[39m\n  \n  test/fixtures/nested.js:11:15\n  Object.<anonymous> (test/fixtures/nested.js:13:7)\u001b[39m\u001b[22m\n'
    )
    assert.strictEqual(status, 1)
  },
]

for (const test of tests)
  try {
    test()
  } catch ({ stack }) {
    console.error(stack)
    process.exitCode = 1
  }

'use strict'

const { throws, strictEqual } = require('assert')
const { spawnSync } = require('child_process')
const path = require('path')
const snapshot = require('snapshot-assertion')
const TestDirector = require('../lib/TestDirector.js')
const simulatePublishedTraces = require('./simulatePublishedTraces.js')

const FIXTURES_PATH = path.join(__dirname, 'fixtures')
const SNAPSHOTS_PATH = path.join(__dirname, 'snapshots')
const NODE_VERSION_MAJOR = parseInt(process.versions.node.split('.')[0])

const tests = [
  () => {
    console.info('Test: Add two tests with the same name.')

    const tests = new TestDirector()
    tests.add('a', () => {})
    throws(
      () => {
        tests.add('a', () => {})
      },
      { message: 'A test called `a` has already been added.' }
    )
  },

  () => {
    console.info('Test: Test with an invalid test function type.')

    const tests = new TestDirector()
    throws(
      () => {
        tests.add('a', '')
      },
      { message: 'Test must be a function.' }
    )
  },

  async () => {
    console.info('Test: Test passes.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'passes'),
    ])

    if (error) throw error

    await snapshot(
      stdout.toString(),
      path.join(SNAPSHOTS_PATH, 'test-passes-stdout.txt')
    )
    strictEqual(stderr.toString(), '')
    strictEqual(status, 0)
  },

  async () => {
    console.info('Test: Test with console output.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'output'),
    ])

    if (error) throw error

    await snapshot(
      stdout.toString(),
      path.join(SNAPSHOTS_PATH, 'test-outputs-stdout.txt')
    )
    strictEqual(stderr.toString(), '')
    strictEqual(status, 0)
  },

  async () => {
    console.info('Test: Awaits tests in sequence.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'awaits'),
    ])

    if (error) throw error

    await snapshot(
      stdout.toString(),
      path.join(SNAPSHOTS_PATH, 'test-sequence-stdout.txt')
    )
    strictEqual(stderr.toString(), '')
    strictEqual(status, 0)
  },

  async () => {
    console.info('Test: Test fails.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'fails'),
    ])

    if (error) throw error

    await snapshot(
      stdout.toString(),
      path.join(SNAPSHOTS_PATH, 'test-fails-stdout.txt')
    )
    await snapshot(
      simulatePublishedTraces(stderr.toString()),
      path.resolve(
        __dirname,
        'snapshots',
        `test-fails-stderr-node-v${NODE_VERSION_MAJOR}.txt`
      )
    )
    strictEqual(status, 1)
  },

  async () => {
    console.info('Test: Nested tests.')

    const { stdout, stderr, status, error } = spawnSync('node', [
      path.join(FIXTURES_PATH, 'nested'),
    ])

    if (error) throw error

    await snapshot(
      stdout.toString(),
      path.join(SNAPSHOTS_PATH, 'test-nested-stdout.txt')
    )
    await snapshot(
      simulatePublishedTraces(stderr.toString()),
      path.resolve(
        __dirname,
        'snapshots',
        `test-nested-stderr-node-v${NODE_VERSION_MAJOR}.txt`
      )
    )
    strictEqual(status, 1)
  },
]

/**
 * Runs the tests.
 * @kind function
 * @name test
 * @returns {Promise<void>} Resolves once tests are done.
 * @ignore
 */
async function test() {
  for (const test of tests)
    try {
      await test()
    } catch ({ stack }) {
      console.error(stack)
      process.exitCode = 1
    }
}

test()

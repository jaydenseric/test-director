'use strict';

const { throws, strictEqual } = require('assert');
const { spawnSync } = require('child_process');
const { join } = require('path');
const snapshot = require('snapshot-assertion');
const TestDirector = require('../public/TestDirector.js');
const simulatePublishedTraces = require('./simulatePublishedTraces.js');

const FIXTURES_PATH = join(__dirname, 'fixtures');
const SNAPSHOTS_PATH = join(__dirname, 'snapshots');

const tests = [
  () => {
    console.info('Test: Add two tests with the same name.');

    const tests = new TestDirector();

    tests.add('a', () => {});

    throws(
      () => {
        tests.add('a', () => {});
      },
      { message: 'A test called `a` has already been added.' }
    );
  },

  () => {
    console.info('Test: Test with an invalid test function type.');

    const tests = new TestDirector();

    throws(
      () => {
        tests.add('a', '');
      },
      { message: 'Test must be a function.' }
    );
  },

  async () => {
    console.info('Test: Test passes.');

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [join(FIXTURES_PATH, 'passes')],
      {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout.toString(),
      join(SNAPSHOTS_PATH, 'test-passes-stdout.ans')
    );

    strictEqual(stderr.toString(), '');
    strictEqual(status, 0);
  },

  async () => {
    console.info('Test: Test with console output.');

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [join(FIXTURES_PATH, 'output')],
      {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout.toString(),
      join(SNAPSHOTS_PATH, 'test-outputs-stdout.ans')
    );

    strictEqual(stderr.toString(), '');
    strictEqual(status, 0);
  },

  async () => {
    console.info('Test: Awaits tests in sequence.');

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [join(FIXTURES_PATH, 'awaits')],
      {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout.toString(),
      join(SNAPSHOTS_PATH, 'test-sequence-stdout.ans')
    );

    strictEqual(stderr.toString(), '');
    strictEqual(status, 0);
  },

  async () => {
    console.info('Test: Test fails.');

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [join(FIXTURES_PATH, 'fails')],
      {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout.toString(),
      join(SNAPSHOTS_PATH, 'test-fails-stdout.ans')
    );

    await snapshot(
      simulatePublishedTraces(stderr.toString()),
      join(SNAPSHOTS_PATH, 'test-fails-stderr.ans')
    );

    strictEqual(status, 1);
  },

  async () => {
    console.info('Test: Nested tests.');

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [join(FIXTURES_PATH, 'nested')],
      {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout.toString(),
      join(SNAPSHOTS_PATH, 'test-nested-stdout.ans')
    );

    await snapshot(
      simulatePublishedTraces(stderr.toString()),
      join(SNAPSHOTS_PATH, 'test-nested-stderr.ans')
    );

    strictEqual(status, 1);
  },
];

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
      await test();
    } catch ({ stack }) {
      console.error(stack);
      process.exitCode = 1;
    }
}

test();

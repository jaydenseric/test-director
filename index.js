'use strict'

const chalk = require('chalk')
const StackUtils = require('stack-utils')

/**
 * An ultra lightweight unit test director for Node.js.
 * @kind class
 * @name TestDirector
 * @example <caption>Import and construct a new test director.</caption>
 * ```js
 * const { TestDirector } = require('test-director')
 *
 * const testDirector = new TestDirector()
 * ```
 */
exports.TestDirector = class TestDirector {
  constructor() {
    /**
     * A map of test functions that have been added, keyed by their test names.
     * @kind member
     * @name TestDirector#tests
     * @type {Map<string, Function>}
     */
    this.tests = new Map()
  }

  /**
   * Adds a test.
   * @kind function
   * @name TestDirector#add
   * @param {string} name Unique test name.
   * @param {Function} test Test to run; may return a `Promise`.
   * @example <caption>A sync test.</caption>
   * ```js
   * const { equal } = require('assert')
   * const { TestDirector } = require('test-director')
   *
   * const testDirector = new TestDirector()
   *
   * testDirector.add('JavaScript addition.', () => {
   *   equal(1 + 1, 2)
   * })
   * ```
   * @example <caption>An async test.</caption>
   * ```js
   * const { ok } = require('assert')
   * const fetch = require('node-fetch')
   * const { TestDirector } = require('test-director')
   *
   * const testDirector = new TestDirector()
   *
   * testDirector.add('GitHub is up.', async () => {
   *   const { ok } = await fetch('https://github.com')
   *   ok(ok)
   * })
   * ```
   */
  add(name, test) {
    if (this.tests.has(name))
      throw new Error(`A test called \`${name}\` has already been added.`)

    if (typeof test !== 'function') throw new Error('Test must be a function.')

    this.tests.set(name, test)
  }

  /**
   * Runs the tests one after another, in the order they were added.
   * @kind function
   * @name TestDirector#run
   * @param {boolean} [throwOnFailure=false] After tests run, throw an error if some failed.
   * @returns {Promise<void>} Resolves once tests have run.
   * @example <caption>Run tests.</caption>
   * ```js
   * testDirector.run()
   * ```
   * @example <caption>Run nested tests.</caption>
   * ```js
   * const { TestDirector } = require('test-director')
   *
   * const testDirector1 = new TestDirector()
   *
   * testDirector1.add('Test A.', async () => {
   *   const testDirector2 = new TestDirector()
   *
   *   testDirector2.add('Test B.', () => {
   *     // …
   *   })
   *
   *   testDirector2.add('Test C.', () => {
   *     // …
   *   })
   *
   *   await testDirector2.run(true)
   * })
   *
   * testDirector1.add('Test D.', () => {
   *   // …
   * })
   *
   * testDirector1.run()
   * ```
   */
  async run(throwOnFailure = false) {
    let passCount = 0

    const stackUtils = new StackUtils({
      internals: StackUtils.nodeInternals()
    })

    for (const [name, test] of this.tests) {
      console.group(`\nTest: ${chalk.bold(name)}`)

      try {
        await test()
        passCount++
      } catch (error) {
        console.error(
          `\n${chalk.red(error.message)}\n\n${chalk.red.dim(
            // Strip Node.js internals from the error stack.
            stackUtils.clean(
              // Remove the inconsistent and confusing entry Node.js v12 puts
              // at the bottom of the stack.
              error.stack.replace(/^ +at internal\/.+:\d+:\d+.+$/gm, '')
            )
          )}`
        )
      } finally {
        console.groupEnd()
      }
    }

    const summary = `${passCount}/${this.tests.size} tests passed.`

    if (passCount < this.tests.size) {
      process.exitCode = 1

      const message = chalk.bold.red(summary)

      if (throwOnFailure) throw new Error(message)

      console.info(`\n${message}\n`)
    } else console.info(`\n${chalk.bold.green(summary)}\n`)
  }
}

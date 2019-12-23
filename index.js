'use strict'

const { inspect } = require('util')
const kleur = require('kleur')
const StackUtils = require('stack-utils')

/**
 * An ultra lightweight unit test director for Node.js.
 * @kind class
 * @name TestDirector
 * @example <caption>Import and construct a new test director.</caption>
 * ```js
 * const { TestDirector } = require('test-director')
 *
 * const tests = new TestDirector()
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
   * const tests = new TestDirector()
   *
   * tests.add('JavaScript addition.', () => {
   *   equal(1 + 1, 2)
   * })
   * ```
   * @example <caption>An async test.</caption>
   * ```js
   * const { ok } = require('assert')
   * const fetch = require('node-fetch')
   * const { TestDirector } = require('test-director')
   *
   * const tests = new TestDirector()
   *
   * tests.add('GitHub is up.', async () => {
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
   * @example <caption>Run nested tests.</caption>
   * ```js
   * const { TestDirector } = require('test-director')
   *
   * const tests = new TestDirector()
   *
   * tests.add('Test A.', async () => {
   *   const tests = new TestDirector()
   *
   *   tests.add('Test B.', () => {
   *     // …
   *   })
   *
   *   tests.add('Test C.', () => {
   *     // …
   *   })
   *
   *   await tests.run(true)
   * })
   *
   * tests.add('Test D.', () => {
   *   // …
   * })
   *
   * tests.run()
   * ```
   */
  async run(throwOnFailure = false) {
    let passCount = 0

    const stackUtils = new StackUtils({
      ignoredPackages: ['test-director']
    })

    for (const [name, test] of this.tests) {
      console.group(`\nTest: ${kleur.bold(name)}`)

      try {
        await test()
        passCount++
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `\n${kleur.red(
              error.code === 'ERR_ASSERTION' &&
                // A manually specified message should be displayed verbatim.
                error.generatedMessage
                ? // Remove the trailing newline that all generated assertion
                  // error messages have.
                  error.message.trim()
                : error.message
            )}`
          )
          console.error(
            `\n${kleur.red().dim(
              // Remove the leading message, remove lines about Node.js and
              // test-director internals, and simplify paths relative to the CWD.
              stackUtils
                // This always leaves a trailing newline.
                .clean(
                  error.code === 'ERR_ASSERTION'
                    ? // Remove the leading message as stack-utils doesn’t do
                      // this for assertion errors. This can leave leading
                      // newlines.
                      error.stack.replace(/^(?! {4}at ).*$/gm, '')
                    : error.stack
                )
                // Remove leading or trailing newlines.
                .trim()
            )}`
          )
        } else console.error(`\n${kleur.red(inspect(error))}`)
      } finally {
        console.groupEnd()
      }
    }

    const summary = `${passCount}/${this.tests.size} tests passed.`

    if (passCount < this.tests.size) {
      process.exitCode = 1

      const message = kleur.red().bold(summary)

      if (throwOnFailure) throw new Error(message)

      console.info(`\n${message}\n`)
    } else console.info(`\n${kleur.green().bold(summary)}\n`)
  }
}

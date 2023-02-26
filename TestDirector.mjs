// @ts-check

import { inspect } from "node:util";

import { bold, green, red } from "kleur/colors";

/** An ultra lightweight unit test director for Node.js. */
export default class TestDirector {
  constructor() {
    /**
     * A map of test functions that have been added, keyed by their test names.
     * @type {Map<string, Function>}
     */
    this.tests = new Map();
  }

  /**
   * Adds a test.
   * @param {string} name Unique test name.
   * @param {Function} test Test to run; may return a `Promise`.
   * @example
   * A sync test:
   *
   * ```js
   * import { equal } from "node:assert";
   * import TestDirector from "test-director";
   *
   * const tests = new TestDirector();
   *
   * tests.add("JavaScript addition.", () => {
   *   equal(1 + 1, 2);
   * });
   *
   * tests.run();
   * ```
   * @example
   * An async test:
   *
   * ```js
   * import { ok } from "node:assert";
   * import fetch from "node-fetch";
   * import TestDirector from "test-director";
   *
   * const tests = new TestDirector();
   *
   * tests.add("GitHub is up.", async () => {
   *   const response = await fetch("https://github.com");
   *   ok(response.ok);
   * });
   *
   * tests.run();
   * ```
   */
  add(name, test) {
    if (typeof name !== "string")
      throw new TypeError("Argument 1 `name` must be a string.");

    if (this.tests.has(name))
      throw new Error(`A test called \`${name}\` has already been added.`);

    if (typeof test !== "function")
      throw new TypeError("Argument 2 `test` must be a function.");

    this.tests.set(name, test);
  }

  /**
   * Runs the tests one after another, in the order they were added.
   * @param {boolean} [throwOnFailure] After tests run, throw an error if some
   *   failed. Defaults to `false`.
   * @returns {Promise<void>} Resolves once tests have run.
   * @example
   * Nested tests:
   *
   * ```js
   * import TestDirector from "test-director";
   *
   * const tests = new TestDirector();
   *
   * tests.add("Test A.", async () => {
   *   const tests = new TestDirector();
   *
   *   tests.add("Test B.", () => {
   *     // …
   *   });
   *
   *   tests.add("Test C.", () => {
   *     // …
   *   });
   *
   *   await tests.run(true);
   * });
   *
   * tests.add("Test D.", () => {
   *   // …
   * });
   *
   * tests.run();
   * ```
   */
  async run(throwOnFailure = false) {
    let passCount = 0;

    for (const [name, test] of this.tests) {
      console.group(`\nTest: ${bold(name)}`);

      try {
        await test();
        passCount++;
      } catch (error) {
        console.error(
          `\n${red(
            error instanceof Error && error.stack ? error.stack : inspect(error)
          )}`
        );
      } finally {
        console.groupEnd();
      }
    }

    const summary = `${passCount}/${this.tests.size} tests passed.`;

    if (passCount < this.tests.size) {
      const message = bold(red(summary));

      if (throwOnFailure) throw new Error(message);

      console.error(`\n${message}\n`);

      process.exitCode = 1;
    } else console.info(`\n${bold(green(summary))}\n`);
  }
}

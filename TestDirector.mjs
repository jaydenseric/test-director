// @ts-check

import { AssertionError } from "assert";
import { inspect } from "util";
// See: https://github.com/mysticatea/eslint-plugin-node/issues/258
// eslint-disable-next-line node/file-extension-in-import
import { bold, dim, green, red } from "kleur/colors";
import StackUtils from "stack-utils";

/**
 * An ultra lightweight unit test director for Node.js.
 * @kind class
 * @name TestDirector
 * @example <caption>Ways to import.</caption>
 * ```js
 * import TestDirector from "test-director";
 * ```
 *
 * ```js
 * import TestDirector from "test-director/TestDirector.mjs";
 * ```
 * @example <caption>How to construct a new instance.</caption>
 * ```js
 * const tests = new TestDirector();
 * ```
 */
export default class TestDirector {
  constructor() {
    /**
     * A map of test functions that have been added, keyed by their test names.
     * @kind member
     * @name TestDirector#tests
     * @type {Map<string, Function>}
     */
    this.tests = new Map();
  }

  /**
   * Adds a test.
   * @kind function
   * @name TestDirector#add
   * @param {string} name Unique test name.
   * @param {Function} test Test to run; may return a `Promise`.
   * @example <caption>A sync test.</caption>
   * ```js
   * import { equal } from "assert";
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
   * @example <caption>An async test.</caption>
   * ```js
   * import { ok } from "assert";
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
   * @kind function
   * @name TestDirector#run
   * @param {boolean} [throwOnFailure=false] After tests run, throw an error if
   *   some failed. Defaults to `false`.
   * @returns {Promise<void>} Resolves once tests have run.
   * @example <caption>Run nested tests.</caption>
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

    const stackUtils = new StackUtils({
      ignoredPackages: ["test-director"],
    });

    for (const [name, test] of this.tests) {
      console.group(`\nTest: ${bold(name)}`);

      try {
        await test();
        passCount++;
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `\n${red(
              error instanceof AssertionError &&
                // A manually specified message should be displayed verbatim.
                error.generatedMessage
                ? // Remove the trailing newline that all generated assertion
                  // error messages have.
                  error.message.trim()
                : error.message
            )}`
          );

          if (error.stack) {
            // Remove the leading message, remove lines about Node.js and
            // test-director internals, and simplify paths relative to the CWD.
            const cleanStack = stackUtils
              // This always leaves a trailing newline.
              .clean(
                error instanceof AssertionError
                  ? // Remove the leading message as stack-utils doesn’t do
                    // this for assertion errors. This can leave leading
                    // newlines.
                    error.stack.replace(/^(?! {4}at ).*$/gmu, "")
                  : error.stack
              )
              // Remove leading or trailing newlines.
              .trim()
              // Remove an internal Node.js frame generated by recent Node.js
              // versions that stack-utils fails to clean, see:
              // https://github.com/tapjs/stack-utils/issues/63
              .replace(/(?:\r\n?|\n)async Promise\.all \(index 0\)$/u, "");

            // Sometimes nothing remains of the stack after cleaning, e.g. for
            // filesystem errors that have an identical error message and stack.
            if (cleanStack) console.error(`\n${dim(red(cleanStack))}`);
          }
        } else console.error(`\n${red(inspect(error))}`);
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

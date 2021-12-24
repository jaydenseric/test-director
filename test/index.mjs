import { strictEqual, throws } from "assert";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import snapshot from "snapshot-assertion";
import TestDirector from "../TestDirector.mjs";
import simulatePublishedTraces from "./simulatePublishedTraces.mjs";

const tests = [
  () => {
    console.info("Test: Test with an invalid test name type.");

    const tests = new TestDirector();

    throws(() => {
      tests.add(true, () => {});
    }, new TypeError("Argument 1 `name` must be a string."));
  },

  () => {
    console.info("Test: Add two tests with the same name.");

    const tests = new TestDirector();

    tests.add("a", () => {});

    throws(() => {
      tests.add("a", () => {});
    }, new Error("A test called `a` has already been added."));
  },

  () => {
    console.info("Test: Test with an invalid test function type.");

    const tests = new TestDirector();

    throws(() => {
      tests.add("a", "");
    }, new TypeError("Argument 2 `test` must be a function."));
  },

  async () => {
    console.info("Test: Test passes.");

    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./fixtures/passes.mjs", import.meta.url))],
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
      new URL("./snapshots/test-passes-stdout.ans", import.meta.url)
    );

    strictEqual(stderr.toString(), "");
    strictEqual(status, 0);
  },

  async () => {
    console.info("Test: Test with console output.");

    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./fixtures/output.mjs", import.meta.url))],
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
      new URL("./snapshots/test-outputs-stdout.ans", import.meta.url)
    );

    strictEqual(stderr.toString(), "");
    strictEqual(status, 0);
  },

  async () => {
    console.info("Test: Awaits tests in sequence.");

    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./fixtures/awaits.mjs", import.meta.url))],
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
      new URL("./snapshots/test-sequence-stdout.ans", import.meta.url)
    );

    strictEqual(stderr.toString(), "");
    strictEqual(status, 0);
  },

  async () => {
    console.info("Test: Test fails.");

    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./fixtures/fails.mjs", import.meta.url))],
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
      new URL("./snapshots/test-fails-stdout.ans", import.meta.url)
    );

    await snapshot(
      simulatePublishedTraces(stderr.toString()),
      new URL("./snapshots/test-fails-stderr.ans", import.meta.url)
    );

    strictEqual(status, 1);
  },

  async () => {
    console.info("Test: Nested tests.");

    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./fixtures/nested.mjs", import.meta.url))],
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
      new URL("./snapshots/test-nested-stdout.ans", import.meta.url)
    );

    await snapshot(
      simulatePublishedTraces(stderr.toString()),
      new URL("./snapshots/test-nested-stderr.ans", import.meta.url)
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

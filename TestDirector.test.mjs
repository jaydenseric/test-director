// @ts-check

import { strictEqual, throws } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import replaceStackTraces from "replace-stack-traces";
import assertSnapshot from "snapshot-assertion";

import TestDirector from "./TestDirector.mjs";

/**
 * Adds `TestDirector` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default function test_TestDirector(tests) {
  tests.add("`TestDirector` with an invalid test name type.", () => {
    const tests = new TestDirector();

    throws(() => {
      tests.add(
        // @ts-ignore Testing invalid.
        true,
        () => {}
      );
    }, new TypeError("Argument 1 `name` must be a string."));
  });

  tests.add("`TestDirector` adding two tests with the same name.", () => {
    const tests = new TestDirector();

    tests.add("a", () => {});

    throws(() => {
      tests.add("a", () => {});
    }, new Error("A test called `a` has already been added."));
  });

  tests.add("`TestDirector` with an invalid test function type.", () => {
    const tests = new TestDirector();

    throws(() => {
      tests.add(
        "a",
        // @ts-ignore Testing invalid.
        ""
      );
    }, new TypeError("Argument 2 `test` must be a function."));
  });

  tests.add("`TestDirector` test passes.", async () => {
    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./test/fixtures/passes.mjs", import.meta.url))],
      {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      }
    );

    if (error) throw error;

    await assertSnapshot(
      stdout.toString(),
      new URL("./test/snapshots/test-passes-stdout.ans", import.meta.url)
    );

    strictEqual(stderr.toString(), "");
    strictEqual(status, 0);
  });

  tests.add("`TestDirector` test with console output.", async () => {
    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./test/fixtures/output.mjs", import.meta.url))],
      {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      }
    );

    if (error) throw error;

    await assertSnapshot(
      stdout.toString(),
      new URL("./test/snapshots/test-outputs-stdout.ans", import.meta.url)
    );

    strictEqual(stderr.toString(), "");
    strictEqual(status, 0);
  });

  tests.add("`TestDirector` awaits tests in sequence.", async () => {
    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./test/fixtures/awaits.mjs", import.meta.url))],
      {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      }
    );

    if (error) throw error;

    await assertSnapshot(
      stdout.toString(),
      new URL("./test/snapshots/test-sequence-stdout.ans", import.meta.url)
    );

    strictEqual(stderr.toString(), "");
    strictEqual(status, 0);
  });

  tests.add("`TestDirector` test fails.", async () => {
    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./test/fixtures/fails.mjs", import.meta.url))],
      {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      }
    );

    if (error) throw error;

    await assertSnapshot(
      stdout.toString(),
      new URL("./test/snapshots/test-fails-stdout.ans", import.meta.url)
    );

    await assertSnapshot(
      replaceStackTraces(stderr.toString()),
      new URL("./test/snapshots/test-fails-stderr.ans", import.meta.url)
    );

    strictEqual(status, 1);
  });

  tests.add("`TestDirector` nested tests.", async () => {
    const { stdout, stderr, status, error } = spawnSync(
      "node",
      [fileURLToPath(new URL("./test/fixtures/nested.mjs", import.meta.url))],
      {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      }
    );

    if (error) throw error;

    await assertSnapshot(
      stdout.toString(),
      new URL("./test/snapshots/test-nested-stdout.ans", import.meta.url)
    );

    await assertSnapshot(
      replaceStackTraces(stderr.toString()),
      new URL("./test/snapshots/test-nested-stderr.ans", import.meta.url)
    );

    strictEqual(status, 1);
  });
}

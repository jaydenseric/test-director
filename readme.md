# test-director

[![npm version](https://badgen.net/npm/v/test-director)](https://npm.im/test-director) [![CI status](https://github.com/jaydenseric/test-director/workflows/CI/badge.svg)](https://github.com/jaydenseric/test-director/actions)

An ultra lightweight unit test director for Node.js.

Works well with any assertion library that throws errors, such as the [Node.js `assert` API](https://nodejs.org/api/assert.html) and [`snapshot-assertion`](https://npm.im/snapshot-assertion).

Use [`coverage-node`](https://npm.im/coverage-node) to run your test script and report code coverage.

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install test-director --save-dev
```

## Examples

A sync test:

```js
import { equal } from "assert";
import TestDirector from "test-director";

const tests = new TestDirector();

tests.add("JavaScript addition.", () => {
  equal(1 + 1, 2);
});

tests.run();
```

An async test:

```js
import { ok } from "assert";
import fetch from "node-fetch";
import TestDirector from "test-director";

const tests = new TestDirector();

tests.add("GitHub is up.", async () => {
  const response = await fetch("https://github.com");
  ok(response.ok);
});

tests.run();
```

Nested tests:

```js
import TestDirector from "test-director";

const tests = new TestDirector();

tests.add("Test A.", async () => {
  const tests = new TestDirector();

  tests.add("Test B.", () => {
    // …
  });

  tests.add("Test C.", () => {
    // …
  });

  await tests.run(true);
});

tests.add("Test D.", () => {
  // …
});

tests.run();
```

## Requirements

- [Node.js](https://nodejs.org): `^12.22.0 || ^14.17.0 || >= 16.0.0`

## Exports

These ECMAScript modules are published to [npm](https://npmjs.com) and exported via the [`package.json`](./package.json) `exports` field:

- [`TestDirector.mjs`](./TestDirector.mjs)

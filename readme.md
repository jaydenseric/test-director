# test-director

An ultra lightweight unit test director for Node.js.

Works well with any assertion library that throws errors, such as the [Node.js `assert` API](https://nodejs.org/api/assert.html) and [`snapshot-assertion`](https://npm.im/snapshot-assertion).

Use [`coverage-node`](https://npm.im/coverage-node) to run your test script and report code coverage.

## Installation

To install [`test-director`](https://npm.im/test-director) with [npm](https://npmjs.com/get-npm), run:

```sh
npm install test-director --save-dev
```

Then, import and use the class [`TestDirector`](./TestDirector.mjs).

## Examples

A sync test:

```js
import { equal } from "node:assert";
import TestDirector from "test-director";

const tests = new TestDirector();

tests.add("JavaScript addition.", () => {
  equal(1 + 1, 2);
});

tests.run();
```

An async test:

```js
import { ok } from "node:assert";
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

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `^14.17.0 || ^16.0.0 || >= 18.0.0`.

Projects must configure [TypeScript](https://typescriptlang.org) to use types from the ECMAScript modules that have a `// @ts-check` comment:

- [`compilerOptions.allowJs`](https://typescriptlang.org/tsconfig#allowJs) should be `true`.
- [`compilerOptions.maxNodeModuleJsDepth`](https://typescriptlang.org/tsconfig#maxNodeModuleJsDepth) should be reasonably large, e.g. `10`.
- [`compilerOptions.module`](https://typescriptlang.org/tsconfig#module) should be `"node16"` or `"nodenext"`.

## Exports

The [npm](https://npmjs.com) package [`test-director`](https://npm.im/test-director) features [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design). These ECMAScript modules are exported via the [`package.json`](./package.json) field [`exports`](https://nodejs.org/api/packages.html#exports):

- [`TestDirector.mjs`](./TestDirector.mjs)

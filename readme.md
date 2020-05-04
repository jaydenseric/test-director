# test-director

[![npm version](https://badgen.net/npm/v/test-director)](https://npm.im/test-director) [![CI status](https://github.com/jaydenseric/test-director/workflows/CI/badge.svg)](https://github.com/jaydenseric/test-director/actions)

An ultra lightweight unit test director for Node.js.

Works well with any assertion library that throws errors, such as the [Node.js `assert` API](https://nodejs.org/api/assert.html) and [`snapshot-assertion`](https://github.com/jaydenseric/snapshot-assertion).

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install test-director --save-dev
```

## Support

- Node.js `10 - 12 || >= 13.7`

## API

### Table of contents

- [class TestDirector](#class-testdirector)
  - [TestDirector instance method add](#testdirector-instance-method-add)
  - [TestDirector instance method run](#testdirector-instance-method-run)
  - [TestDirector instance property tests](#testdirector-instance-property-tests)

### class TestDirector

An ultra lightweight unit test director for Node.js.

#### Examples

_Import and construct a new test director._

> ```js
> const { TestDirector } = require('test-director');
>
> const tests = new TestDirector();
> ```

#### TestDirector instance method add

Adds a test.

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `name`    | string   | Unique test name.                    |
| `test`    | Function | Test to run; may return a `Promise`. |

##### Examples

_A sync test._

> ```js
> const { equal } = require('assert');
> const { TestDirector } = require('test-director');
>
> const tests = new TestDirector();
>
> tests.add('JavaScript addition.', () => {
>   equal(1 + 1, 2);
> });
>
> tests.run();
> ```

_An async test._

> ```js
> const { ok } = require('assert');
> const fetch = require('node-fetch');
> const { TestDirector } = require('test-director');
>
> const tests = new TestDirector();
>
> tests.add('GitHub is up.', async () => {
>   const { ok } = await fetch('https://github.com');
>   ok(ok);
> });
>
> tests.run();
> ```

#### TestDirector instance method run

Runs the tests one after another, in the order they were added.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `throwOnFailure` | boolean? = `false` | After tests run, throw an error if some failed. |

**Returns:** Promise&lt;void> — Resolves once tests have run.

##### Examples

_Run nested tests._

> ```js
> const { TestDirector } = require('test-director');
>
> const tests = new TestDirector();
>
> tests.add('Test A.', async () => {
>   const tests = new TestDirector();
>
>   tests.add('Test B.', () => {
>     // …
>   });
>
>   tests.add('Test C.', () => {
>     // …
>   });
>
>   await tests.run(true);
> });
>
> tests.add('Test D.', () => {
>   // …
> });
>
> tests.run();
> ```

#### TestDirector instance property tests

A map of test functions that have been added, keyed by their test names.

**Type:** Map&lt;string, Function>

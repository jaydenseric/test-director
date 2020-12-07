# test-director changelog

## Next

### Major

- Updated supported Node.js versions to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Updated dependencies, some of which require newer Node.js versions than were previously supported.
- The updated [`kleur`](https://npm.im/kleur) dependency causes subtle differences in which environments get colored console output.
- Removed the package `module` field.

### Patch

- Simplified the GitHub Actions CI config with the [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
- Updated the EditorConfig.
- Use destructuring for `require` of the Node.js `path` API in tests.
- Use the `FORCE_COLOR` environment variable in tests to ensure output is colorized.

## 4.0.1

### Patch

- Updated dependencies.
- Updated Node.js support to `10 - 12 || >= 13.7` to reflect the package `exports` related breaking changes.
- Updated the package `exports` field to allow requiring `package.json` and specific deep imports.
- Also run GitHub Actions with Node.js v14.
- Use [`snapshot-assertion`](https://npm.im/snapshot-assertion) for snapshot tests.
- Mention [`snapshot-assertion`](https://npm.im/snapshot-assertion) in the readme.
- Improved the package `prepare:prettier` and `test:prettier` scripts.
- Configured Prettier option `semi` to the default, `true`.

## 4.0.0

### Major

- Added a [package `exports` field](https://nodejs.org/api/esm.html#esm_package_exports) to support native ESM in Node.js.
- Added package `sideEffects` and `module` fields for bundlers such as webpack.
- Published files have been reorganized, so undocumented deep imports may no longer work.

### Patch

- Updated dependencies.
- Lint fixes for [`prettier`](https://npm.im/prettier) v2.
- Added `esm` and `mjs` to the package `tags` field.
- Ensure GitHub Actions run on pull request.
- Moved the `simulatePublishedTraces` test helper into its own file.
- Destructure `assert` imports in tests.
- Use file extensions in require paths.
- Tidied the position of a JSDoc comment.

## 3.0.1

### Patch

- Updated dev dependencies.
- Added a new [`hard-rejection`](https://npm.im/hard-rejection) dev dependency to ensure unhandled rejections in tests exit the process with an error.
- Don’t attempt to display an error stack if it’s missing, empty, or the same as the error message.
- Improved code examples.

## 3.0.0

### Major

- Updated Node.js support from v8.10+ to v10+.
- Updated the [`stack-utils`](https://npm.im/stack-utils) dependency to v2.
- Use [`coverage-node`](https://npm.im/coverage-node) for test code coverage.

### Minor

- Support tests throwing unusual error types, such as primitives.
- [`test-director`](https://npm.im/test-director) is now excluded from error traces.

### Patch

- Updated dev dependencies.
- Changed the order of console color codes to color, then modifier.
- Removed the extra newline that trails error stacks.
- Implemented better tests using JS, replacing the shell scripts.
- Updated code examples.
- Added a readme “Support” section.

## 2.0.0

### Major

- Updated Node.js support from v8.5+ to v8.10+.
- Replaced the [`chalk`](https://npm.im/chalk) dependency with [`kleur`](https://npm.im/kleur), which has a much smaller install size and outputs cleaner code. Its environment color support detection may behave differently.

### Minor

- Setup [GitHub Sponsors funding](https://github.com/sponsors/jaydenseric):
  - Added `.github/funding.yml` to display a sponsor button in GitHub.
  - Added a `package.json` `funding` field to enable npm CLI funding features.

### Patch

- Updated dev dependencies.
- Removed the now redundant [`eslint-plugin-import-order-alphabetical`](https://npm.im/eslint-plugin-import-order-alphabetical) dev dependency.
- Stop using [`husky`](https://npm.im/husky) and [`lint-staged`](https://npm.im/lint-staged).
- Use strict mode for scripts.
- Test Node.js v13 in CI GitHub Actions.
- Corrected an example caption.

## 1.0.0

Initial release.

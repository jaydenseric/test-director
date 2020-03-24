# test-director changelog

## Next

### Patch

- Updated dependencies.
- Lint fixes for [`prettier`](https://npm.im/prettier) v2.
- Ensure GitHub Actions run on pull request.

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

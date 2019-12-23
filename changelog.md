# test-director changelog

## Next

### Major

- Updated Node.js support from v8.10+ to v10+.
- Updated the [`stack-utils`](https://npm.im/stack-utils) dependency to v2.
- Use [`coverage-node`](https://npm.im/coverage-node) for test code coverage.

### Minor

- [`test-director`](https://npm.im/test-director) is now excluded from error traces.

### Patch

- Updated dev dependencies.
- Implemented better tests using JS, replacing the shell scripts.
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

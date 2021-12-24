/**
 * Manually removes error trace lines from console output that would normally be
 * ignored via the `stack-utils` option `ignoredPackages` when the published
 * package is used from `node_modules`.
 *
 * The simulation is worth doing so it’s not forgotten that consumers will see
 * something different. Also, it removes the burden of having to update line
 * numbers in assertions every time the source changes.
 *
 * I tried using [`install-from`](https://npm.im/install-from#api) to install
 * the package in `test/fixtures/node_modules` every test run, but then code
 * coverage doesn’t work as it’s a copy of the code that runs.
 * @kind function
 * @name simulatePublishedTraces
 * @param {string} output Console output.
 * @returns {string} Simulated output.
 * @ignore
 */
export default function simulatePublishedTraces(output) {
  return output.replace(/^.*\(file:\/\/index\.mjs:.*$(?:\r\n?|\n)/gmu, "");
}

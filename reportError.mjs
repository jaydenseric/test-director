// @ts-check

import { inspect } from "node:util";

import { red } from "kleur/colors";

/**
 * Reports an error to the console.
 * @param {unknown} error Error to report.
 */
export default function reportError(error) {
  console.error(
    `\n${red(
      error instanceof Error && error.stack ? error.stack : inspect(error)
    )}`
  );

  if (error instanceof AggregateError && error.errors.length) {
    console.group(`\n${red("Aggregate errors:")}`);

    for (const aggregateError of /** @type {Array<unknown>} **/ (error.errors))
      reportError(aggregateError);

    console.groupEnd();
  }

  if (error instanceof Error && error.cause) {
    console.group(`\n${red("Cause:")}`);

    reportError(error.cause);

    console.groupEnd();
  }
}

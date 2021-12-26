// @ts-check

import TestDirector from "../../TestDirector.mjs";
import sleep from "../sleep.mjs";

const tests = new TestDirector();

tests.add("a", async () => {
  await sleep(50);
  console.info("Message A.");
});

tests.add("b", () => {
  console.info("Message B.");
});

tests.run();

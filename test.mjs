// @ts-check

import TestDirector from "test-director";

import test_TestDirector from "./TestDirector.test.mjs";

const tests = new TestDirector();

test_TestDirector(tests);

tests.run();

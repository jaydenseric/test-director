'use strict';

const TestDirector = require('../../public/TestDirector.js');

const tests = new TestDirector();
tests.add('a', () => {});
tests.run();

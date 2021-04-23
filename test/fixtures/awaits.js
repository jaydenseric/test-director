'use strict';

const TestDirector = require('../../public/TestDirector.js');
const sleep = require('../sleep.js');

const tests = new TestDirector();

tests.add('a', async () => {
  await sleep(50);
  console.info('Message A.');
});

tests.add('b', () => {
  console.info('Message B.');
});

tests.run();

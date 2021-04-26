import TestDirector from '../../index.mjs';

const tests = new TestDirector();

tests.add('a', () => {
  console.info('Message.');
});

tests.run();

import TestDirector from '../../public/TestDirector.mjs';

const tests = new TestDirector();

tests.add('a', () => {
  console.info('Message.');
});

tests.run();

import TestDirector from '../../index.mjs';

const tests = new TestDirector();

tests.add('a', async () => {
  const tests = new TestDirector();

  tests.add('b', () => {
    throw new Error('Message.');
  });

  await tests.run(true);
});

tests.run();

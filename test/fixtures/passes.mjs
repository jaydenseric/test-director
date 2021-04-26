import TestDirector from '../../index.mjs';

const tests = new TestDirector();

tests.add('a', () => {});

tests.run();

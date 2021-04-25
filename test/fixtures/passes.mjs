import TestDirector from '../../public/TestDirector.mjs';

const tests = new TestDirector();

tests.add('a', () => {});

tests.run();

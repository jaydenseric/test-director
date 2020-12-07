'use strict';

const { strictEqual } = require('assert');
const TestDirector = require('../../public/TestDirector.js');

const tests = new TestDirector();
tests.add('a', () => {
  throw new Error('Message.');
});
tests.add('b', () => {
  // Some errors have a stack the same as the message.
  const message = 'Message.';
  const error = new Error(message);
  error.stack = message;
  throw error;
});
tests.add('c', () => {
  // Some errors don’t have a stack.
  const error = new Error('Message.');
  delete error.stack;
  throw error;
});
tests.add('d', () => {
  strictEqual(0, 1);
});
tests.add('e', () => {
  strictEqual(0, 1, 'Message.');
});
tests.add('f', () => {
  throw { message: 'Message.' };
});
tests.add('g', () => {
  throw {};
});
tests.add('h', () => {
  throw 'Message.';
});
tests.add('i', () => {
  throw null;
});
tests.run();

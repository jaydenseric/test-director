// @ts-check

import { strictEqual } from "node:assert";

import TestDirector from "../../TestDirector.mjs";

const tests = new TestDirector();

tests.add("a", () => {
  throw new Error("Message.");
});

tests.add("b", () => {
  // Some errors have a stack the same as the message.
  const message = "Message.";
  const error = new Error(message);
  error.stack = message;
  throw error;
});

tests.add("c", () => {
  // Some errors don’t have a stack.
  const error = new Error("Message.");
  delete error.stack;
  throw error;
});

tests.add("d", () => {
  strictEqual(0, 1);
});

tests.add("e", () => {
  strictEqual(0, 1, "Message.");
});

tests.add("f", () => {
  throw { message: "Message." };
});

tests.add("g", () => {
  throw {};
});

tests.add("h", () => {
  throw "Message.";
});

tests.add("i", () => {
  throw null;
});

tests.add("j", () => {
  throw new Error("Message C.", {
    cause: new Error("Message B.", {
      cause: new Error("Message A."),
    }),
  });
});

tests.add("k", () => {
  throw new Error("Message B.", {
    cause: new AggregateError([], "Message A."),
  });
});

tests.add("l", () => {
  throw new AggregateError([], "Message A.");
});

tests.add("m", () => {
  throw new AggregateError(
    [
      new Error("Message A."),
      new Error("Message C.", {
        cause: new Error("Message B."),
      }),
      new AggregateError(
        [
          new Error("Message D."),
          new Error("Message F.", {
            cause: new Error("Message E."),
          }),
        ],
        "Message G."
      ),
    ],
    "Message H."
  );
});

tests.run();

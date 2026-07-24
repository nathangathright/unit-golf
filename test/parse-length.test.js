"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const parseLength = require("../src/parse-length");

test("defaults unitless values to pixels", () => {
  assert.deepEqual(parseLength("325"), {
    value: 325,
    unit: "px"
  });
});

test("normalizes signed and uppercase lengths", () => {
  assert.deepEqual(parseLength(" -10PX "), {
    value: -10,
    unit: "px"
  });
});

test("accepts numeric API input", () => {
  assert.deepEqual(parseLength(0.5), {
    value: 0.5,
    unit: "px"
  });
});

test("rejects unsupported CSS expressions", () => {
  assert.throws(() => parseLength("calc(1px + 2vw)"), /invalid CSS length/);
  assert.throws(() => parseLength("10rem"), /invalid CSS length/);
  assert.throws(() => parseLength(), /input must be a CSS length/);
});

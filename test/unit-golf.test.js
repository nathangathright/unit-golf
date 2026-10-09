"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const unitGolf = require("../src");

test("returns a structured result for zero", () => {
  assert.deepEqual(unitGolf({ input: "0px" }), {
    schemaVersion: 1,
    ok: true,
    input: "0px",
    targetPx: 0,
    tolerancePx: 0.2,
    viewport: { width: 400, height: 300 },
    profile: "cssbattle",
    best: {
      value: 0,
      unit: null,
      css: "0",
      errorPx: 0,
      withinTolerance: true
    },
    alternatives: []
  });
});

test("preserves the sign of negative lengths", () => {
  const result = unitGolf({
    input: "-10px",
    tolerance: 0,
    width: 400,
    height: 300
  });

  assert.deepEqual(result.best, {
    value: -10,
    unit: "px",
    css: "-10px",
    errorPx: 0,
    withinTolerance: true
  });
});

test("converts input units with deterministic multipliers", () => {
  const result = unitGolf({
    input: "57.3vw",
    tolerance: 0,
    width: 400,
    height: 300
  });

  assert.equal(result.targetPx, 229.2);
  assert.deepEqual(result.best, {
    value: 57.3,
    unit: "vw",
    css: "57.3vw",
    errorPx: 0,
    withinTolerance: true
  });
});

test("returns every supported unit", () => {
  const result = unitGolf({
    input: "108px",
    tolerance: 0,
    width: 400,
    height: 300
  });
  const candidates = [result.best, ...result.alternatives];

  assert.equal(candidates.length, 14);
  assert.deepEqual(
    candidates.map(candidate => candidate.unit).sort(),
    [
      "cap",
      "ch",
      "cm",
      "em",
      "ex",
      "in",
      "lh",
      "mm",
      "pc",
      "pt",
      "px",
      "q",
      "vh",
      "vw"
    ]
  );
  assert.equal(result.best.css, "6lh");
});

test("rejects invalid options with stable error codes", () => {
  assert.throws(
    () => unitGolf({ input: "10px", tolerance: -1 }),
    error => error.code === "INVALID_OPTION"
  );
});

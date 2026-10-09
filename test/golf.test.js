"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const golf = require("../src/golf");
const { serializeScaledInteger } = require("../src/golf");

test("serializes CSS numbers without redundant characters", () => {
  assert.equal(serializeScaledInteger(5, 1), ".5");
  assert.equal(serializeScaledInteger(-5, 1), "-.5");
  assert.equal(serializeScaledInteger(500, 2), "5");
  assert.equal(serializeScaledInteger(0, 8), "0");
});

test("finds the shortest value inside the tolerance interval", () => {
  assert.deepEqual(
    golf({
      px: 9.9,
      tolerance: 0.2,
      units: [{ name: "px", multiplier: 1 }]
    }),
    [
      {
        value: 10,
        unit: "px",
        css: "10px",
        errorPx: 0.1,
        withinTolerance: true
      }
    ]
  );
});

test("serializes negative fractions correctly", () => {
  assert.deepEqual(
    golf({
      px: -0.5,
      tolerance: 0,
      units: [{ name: "px", multiplier: 1 }]
    }),
    [
      {
        value: -0.5,
        unit: "px",
        css: "-.5px",
        errorPx: 0,
        withinTolerance: true
      }
    ]
  );
});

test("uses unitless zero", () => {
  assert.deepEqual(golf({ px: 0, tolerance: 0, units: [] }), [
    {
      value: 0,
      unit: null,
      css: "0",
      errorPx: 0,
      withinTolerance: true
    }
  ]);
});

test("sorts valid results before shorter values outside tolerance", () => {
  const results = golf({
    px: 10,
    tolerance: 0,
    units: [
      { name: "q", multiplier: 3 },
      { name: "absoluteunit", multiplier: 1 }
    ]
  });

  assert.equal(results[0].css, "10absoluteunit");
  assert.equal(results[1].css, "3.33333333q");
  assert.equal(results[0].withinTolerance, true);
  assert.equal(results[1].withinTolerance, false);
});

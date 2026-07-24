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
    [{ unitValue: 10, string: "10px", pixelOffset: 0.1 }]
  );
});

test("serializes negative fractions correctly", () => {
  assert.deepEqual(
    golf({
      px: -0.5,
      tolerance: 0,
      units: [{ name: "px", multiplier: 1 }]
    }),
    [{ unitValue: -0.5, string: "-.5px", pixelOffset: 0 }]
  );
});

test("uses unitless zero", () => {
  assert.deepEqual(golf({ px: 0, tolerance: 0, units: [] }), [
    { unitValue: 0, string: "0", pixelOffset: 0 }
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

  assert.equal(results[0].string, "10absoluteunit");
  assert.equal(results[1].string, "3.33333333q");
});

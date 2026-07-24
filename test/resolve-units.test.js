"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const resolveUnits = require("../src/resolve-units");
const {
  absoluteUnits,
  cssbattleProfile
} = require("../src/resolve-units");

test("uses exact CSS ratios for absolute units", () => {
  assert.equal(absoluteUnits.px, 1);
  assert.equal(absoluteUnits.in, 96);
  assert.equal(absoluteUnits.cm, 96 / 2.54);
  assert.equal(absoluteUnits.mm, 96 / 25.4);
  assert.equal(absoluteUnits.pt, 96 / 72);
  assert.equal(absoluteUnits.pc, 16);
  assert.equal(absoluteUnits.q, 96 / 101.6);
});

test("resolves viewport and calibrated font units", () => {
  const units = resolveUnits({ width: 400, height: 300 });
  const multipliers = Object.fromEntries(
    units.map(({ name, multiplier }) => [name, multiplier])
  );

  assert.equal(units.length, 14);
  assert.equal(multipliers.vw, 4);
  assert.equal(multipliers.vh, 3);
  assert.equal(multipliers.lh, cssbattleProfile.fontUnits.lh);
  assert.equal(multipliers.cap, cssbattleProfile.fontUnits.cap);
});

test("accepts an explicit font profile", () => {
  const profile = {
    fontUnits: {
      em: 10,
      ex: 5,
      ch: 6,
      lh: 12,
      cap: 7
    }
  };
  const units = resolveUnits({ width: 100, height: 200, profile });
  const multipliers = Object.fromEntries(
    units.map(({ name, multiplier }) => [name, multiplier])
  );

  assert.equal(multipliers.em, 10);
  assert.equal(multipliers.cap, 7);
});

const assert = require("node:assert/strict");
const test = require("node:test");

const unitGolf = require("../src");

test("handles zero without launching a browser", async () => {
  assert.deepEqual(await unitGolf({ input: "0px" }), [
    { unitValue: 0, string: "0", pixelOffset: 0 }
  ]);
});

test("preserves the sign of negative lengths", async () => {
  const results = await unitGolf({
    input: "-10px",
    tolerance: 0,
    width: 400,
    height: 300
  });

  assert.deepEqual(results[0], {
    unitValue: -10,
    string: "-10px",
    pixelOffset: 0
  });
});

test("converts input units with deterministic multipliers", async () => {
  const results = await unitGolf({
    input: "57.3vw",
    tolerance: 0,
    width: 400,
    height: 300
  });

  assert.deepEqual(results[0], {
    unitValue: 57.3,
    string: "57.3vw",
    pixelOffset: 0
  });
});

test(
  "converts with the supported unit set",
  async () => {
    const results = await unitGolf({
      input: "108px",
      tolerance: 0,
      width: 400,
      height: 300
    });

    assert.equal(results.length, 14);
    assert.deepEqual(
      results
        .map(result => result.string.match(/[a-z]+$/)[0])
        .sort(),
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
    assert.deepEqual(
      results[0],
      {
        unitValue: 6,
        string: "6lh",
        pixelOffset: 0
      }
    );
  }
);

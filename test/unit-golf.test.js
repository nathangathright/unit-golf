const assert = require("node:assert/strict");
const test = require("node:test");

const unitGolf = require("../src");

test(
  "converts with the supported unit set",
  { timeout: 30_000 },
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

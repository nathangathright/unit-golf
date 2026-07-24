const assert = require("node:assert/strict");
const test = require("node:test");

const unitGolf = require("../src");

test(
  "converts with the existing unit set",
  { timeout: 30_000 },
  async () => {
    const results = await unitGolf({
      input: "96px",
      tolerance: 0,
      width: 400,
      height: 300
    });

    assert.equal(results.length, 12);
    assert.deepEqual(
      results
        .map(result => result.string.match(/[a-z]+$/)[0])
        .sort(),
      ["ch", "cm", "em", "ex", "in", "mm", "pc", "pt", "px", "q", "vh", "vw"]
    );
    assert.deepEqual(
      results.find(result => result.string === "1in"),
      {
        unitValue: 1,
        string: "1in",
        pixelOffset: 0
      }
    );
  }
);

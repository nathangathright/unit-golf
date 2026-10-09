const golf = require("./golf");
const parseLength = require("./parse-length");
const resolveUnits = require("./resolve-units");

const SCHEMA_VERSION = 1;

const invalidOption = message => {
  const error = new TypeError(message);
  error.code = "INVALID_OPTION";
  throw error;
};

const numericOption = (name, value, { minimum, fallback }) => {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(number) || number < minimum) {
    invalidOption(`${name} must be at least ${minimum}.`);
  }
  return number;
};

const unitGolf = ({
  input,
  tolerance = 0.2,
  width = 400,
  height = 300
} = {}) => {
  const length = parseLength(input);
  const normalizedTolerance = numericOption("tolerance", tolerance, {
    minimum: 0,
    fallback: 0.2
  });
  const normalizedWidth = numericOption("width", width, {
    minimum: Number.EPSILON,
    fallback: 400
  });
  const normalizedHeight = numericOption("height", height, {
    minimum: Number.EPSILON,
    fallback: 300
  });

  const units = resolveUnits({
    width: normalizedWidth,
    height: normalizedHeight
  });
  const inputUnit = units.find(unit => unit.name === length.unit);
  const targetPx = length.value * inputUnit.multiplier;
  const candidates = golf({
    px: targetPx,
    units,
    tolerance: normalizedTolerance
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    ok: true,
    input: typeof input === "string" ? input.trim() : String(input),
    targetPx,
    tolerancePx: normalizedTolerance,
    viewport: {
      width: normalizedWidth,
      height: normalizedHeight
    },
    profile: "cssbattle",
    best: candidates[0],
    alternatives: candidates.slice(1)
  };
};

module.exports = unitGolf;
module.exports.SCHEMA_VERSION = SCHEMA_VERSION;

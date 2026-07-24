const golf = require("./golf");
const parseLength = require("./parse-length");
const resolveUnits = require("./resolve-units");

const numericOption = (name, value, { minimum, fallback }) => {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(number) || number < minimum) {
    throw new TypeError(`${name} must be at least ${minimum}`);
  }
  return number;
};

const unitGolf = async ({
  input,
  tolerance = 0.2,
  width = 400,
  height = 300
}) => {
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

  if (length.value === 0) {
    return golf({ px: 0, units: [], tolerance: normalizedTolerance });
  }

  const units = resolveUnits({
    width: normalizedWidth,
    height: normalizedHeight
  });
  const inputUnit = units.find(unit => unit.name === length.unit);

  return golf({
    px: length.value * inputUnit.multiplier,
    units,
    tolerance: normalizedTolerance
  });
};

module.exports = unitGolf;

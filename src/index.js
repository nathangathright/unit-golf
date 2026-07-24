const getUnitsAndPxWidth = require("./get-units-and-px-width");
const golf = require("./golf");
const parseLength = require("./parse-length");

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

  const { units, pxWidth } = await getUnitsAndPxWidth({
    input: length.cssText,
    width: normalizedWidth,
    height: normalizedHeight
  });

  return golf({
    px: Math.sign(length.value) * pxWidth,
    units,
    tolerance: normalizedTolerance
  });
};

module.exports = unitGolf;

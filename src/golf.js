"use strict";

const MAX_PRECISION = 8;

const normalizeZero = number => (Object.is(number, -0) ? 0 : number);

const roundError = number => {
  const rounded = Number(number.toFixed(2));
  return normalizeZero(rounded);
};

const serializeScaledInteger = (integer, precision) => {
  if (!Number.isSafeInteger(integer)) {
    throw new RangeError("value is too large to serialize safely");
  }

  if (integer === 0) return "0";

  const sign = integer < 0 ? "-" : "";
  let digits = Math.abs(integer);
  let places = precision;

  while (places > 0 && digits % 10 === 0) {
    digits /= 10;
    places -= 1;
  }

  const source = String(digits);
  if (places === 0) return `${sign}${source}`;

  const padded = source.padStart(places + 1, "0");
  const whole = padded.slice(0, -places);
  const fraction = padded.slice(-places);
  const integerPart = whole === "0" ? "" : whole;

  return `${sign}${integerPart}.${fraction}`;
};

const numericSlack = (expected, actual) =>
  Number.EPSILON * 32 * Math.max(1, Math.abs(expected), Math.abs(actual));

const isWithinTolerance = (error, px, tolerance) =>
  Math.abs(error) <= tolerance + numericSlack(px, px + error);

const compareCandidates = (a, b) =>
  a.number.length - b.number.length ||
  Math.abs(a.error) - Math.abs(b.error) ||
  Math.abs(a.unitValue) - Math.abs(b.unitValue);

const candidateAtPrecision = (px, multiplier, tolerance, precision) => {
  const scale = 10 ** precision;
  const target = px / multiplier;
  const scaledTarget = target * scale;
  const lower = ((px - tolerance) / multiplier) * scale;
  const upper = ((px + tolerance) / multiplier) * scale;
  const minimum = Math.ceil(Math.min(lower, upper));
  const maximum = Math.floor(Math.max(lower, upper));
  const nearest = Math.round(scaledTarget);
  const integers = new Set([
    nearest - 1,
    nearest,
    nearest + 1,
    minimum - 1,
    minimum,
    minimum + 1,
    maximum - 1,
    maximum,
    maximum + 1
  ]);

  if (minimum <= 0 && maximum >= 0) integers.add(0);

  return [...integers]
    .filter(Number.isSafeInteger)
    .map(integer => {
      const number = serializeScaledInteger(integer, precision);
      const unitValue = Number(number);
      return {
        number,
        unitValue,
        error: unitValue * multiplier - px
      };
    })
    .filter(candidate =>
      isWithinTolerance(candidate.error, px, tolerance)
    )
    .sort(compareCandidates)[0];
};

const fallbackCandidate = (px, multiplier) => {
  const target = px / multiplier;
  const safePrecision = Math.max(
    0,
    Math.min(
      MAX_PRECISION,
      Math.floor(
        Math.log10(Number.MAX_SAFE_INTEGER / Math.max(1, Math.abs(target)))
      )
    )
  );
  const scale = 10 ** safePrecision;
  const integer = Math.round(target * scale);
  const number = serializeScaledInteger(integer, safePrecision);
  const unitValue = Number(number);

  return {
    number,
    unitValue,
    error: unitValue * multiplier - px
  };
};

const golfUnit = (px, unit, tolerance) => {
  const { name, multiplier } = unit;

  if (
    typeof name !== "string" ||
    !Number.isFinite(multiplier) ||
    multiplier <= 0
  ) {
    throw new TypeError(`invalid unit: ${name}`);
  }

  let candidate;
  for (let precision = 0; precision <= MAX_PRECISION; precision += 1) {
    candidate = candidateAtPrecision(px, multiplier, tolerance, precision);
    if (candidate) break;
  }

  candidate ||= fallbackCandidate(px, multiplier);

  return {
    unitValue: candidate.unitValue,
    string: `${candidate.number}${name}`,
    pixelOffset: roundError(candidate.error),
    error: candidate.error,
    withinTolerance: isWithinTolerance(candidate.error, px, tolerance)
  };
};

const compareResults = (a, b) =>
  Number(b.withinTolerance) - Number(a.withinTolerance) ||
  a.string.length - b.string.length ||
  Math.abs(a.error) - Math.abs(b.error) ||
  a.index - b.index;

const golf = ({ px, units, tolerance }) => {
  if (!Number.isFinite(px)) throw new TypeError("px must be finite");
  if (!Number.isFinite(tolerance) || tolerance < 0) {
    throw new TypeError("tolerance must be a non-negative number");
  }

  if (px === 0) {
    return [{ unitValue: 0, string: "0", pixelOffset: 0 }];
  }

  return units
    .map((unit, index) => ({
      ...golfUnit(px, unit, tolerance),
      index
    }))
    .sort(compareResults)
    .map(({ withinTolerance, error, index, ...result }) => result);
};

module.exports = golf;
module.exports.serializeScaledInteger = serializeScaledInteger;

"use strict";

const UNIT_NAMES = require("./units");

const NUMBER_PATTERN = "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)";
const LENGTH_PATTERN = new RegExp(
  `^(${NUMBER_PATTERN})(${UNIT_NAMES.join("|")})?$`,
  "i"
);

const invalidLength = message => {
  const error = new TypeError(message);
  error.code = "INVALID_LENGTH";
  return error;
};

const parseLength = input => {
  const source = typeof input === "number" ? String(input) : input;

  if (typeof source !== "string") {
    throw invalidLength("Input must be a CSS length.");
  }

  const match = source.trim().match(LENGTH_PATTERN);
  if (!match) {
    throw invalidLength(`Invalid CSS length: ${source}`);
  }

  const value = Number(match[1]);
  if (!Number.isFinite(value)) {
    throw invalidLength(`Invalid CSS length: ${source}`);
  }

  const unit = (match[2] || "px").toLowerCase();
  const normalizedValue = Object.is(value, -0) ? 0 : value;

  return {
    value: normalizedValue,
    unit
  };
};

module.exports = parseLength;

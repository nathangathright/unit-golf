"use strict";

const cssbattleProfile = require("./profiles/cssbattle.json");
const UNIT_NAMES = require("./units");

const absoluteUnits = {
  px: 1,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 16,
  q: 96 / 101.6
};

const resolveUnits = ({
  width,
  height,
  profile = cssbattleProfile
}) => {
  const multipliers = {
    ...absoluteUnits,
    vw: width / 100,
    vh: height / 100,
    ...profile.fontUnits
  };

  return UNIT_NAMES.map(name => {
    const multiplier = multipliers[name];
    if (!Number.isFinite(multiplier) || multiplier <= 0) {
      throw new TypeError(`profile does not define a valid ${name} unit`);
    }
    return { name, multiplier };
  });
};

module.exports = resolveUnits;
module.exports.absoluteUnits = absoluteUnits;
module.exports.cssbattleProfile = cssbattleProfile;

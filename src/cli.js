#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util");

const { version } = require("../package.json");
const unitGolf = require("./index");
const { SCHEMA_VERSION } = unitGolf;

const HELP = `Usage: unit-golf <length> [options]

Shorten a CSS length for CSSBattle.

Options:
  --tolerance <pixels>  Maximum permitted pixel error (default: 0.2)
  --width <pixels>      Viewport width (default: 400)
  --height <pixels>     Viewport height (default: 300)
  --json                Print a machine-readable result
  -h, --help            Show help
  -V, --version         Show version`;

const SIGNED_LENGTH = /^-(?:\d+(?:\.\d*)?|\.\d+)(?:[a-z]+)?$/i;
const VALUE_OPTIONS = new Set(["--tolerance", "--width", "--height"]);

const cliError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  error.exitCode = 2;
  return error;
};

const extractSignedLength = argv => {
  const args = [];
  let signedInput;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (VALUE_OPTIONS.has(argument)) {
      args.push(argument);
      if (index + 1 < argv.length) args.push(argv[(index += 1)]);
      continue;
    }

    if (signedInput === undefined && SIGNED_LENGTH.test(argument)) {
      signedInput = argument;
      continue;
    }

    args.push(argument);
  }

  return { args, signedInput };
};

const readArguments = argv => {
  const { args, signedInput } = extractSignedLength(argv);
  let parsed;

  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      strict: true,
      options: {
        tolerance: { type: "string" },
        width: { type: "string" },
        height: { type: "string" },
        json: { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
        version: { type: "boolean", short: "V", default: false }
      }
    });
  } catch (error) {
    throw cliError("INVALID_ARGUMENT", error.message);
  }

  const inputs = [signedInput, ...parsed.positionals].filter(
    input => input !== undefined
  );

  if (inputs.length > 1) {
    throw cliError("INVALID_ARGUMENT", "Provide exactly one CSS length.");
  }

  return {
    ...parsed.values,
    input: inputs[0]
  };
};

const displayedError = errorPx => {
  const rounded = Number(errorPx.toFixed(2));
  return Object.is(rounded, -0) ? 0 : rounded;
};

const renderCandidate = candidate => {
  const errorPx = displayedError(candidate.errorPx);
  const offset =
    errorPx === 0 ? "" : ` (${errorPx > 0 ? "+" : ""}${errorPx}px)`;
  return `${candidate.css}${offset}`;
};

const renderText = result => {
  const lines = [
    `⛳  ${renderCandidate(result.best)}`,
    "",
    ...result.alternatives.map(renderCandidate)
  ];
  return `${lines.join("\n")}\n`;
};

const renderError = (error, asJson) => {
  const isUserError =
    error.exitCode === 2 ||
    error.code === "INVALID_LENGTH" ||
    error.code === "INVALID_OPTION";
  const code = isUserError ? error.code || "INVALID_INPUT" : "INTERNAL_ERROR";
  const message = isUserError ? error.message : "Conversion failed unexpectedly.";

  if (asJson) {
    process.stderr.write(
      `${JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        ok: false,
        error: { code, message }
      })}\n`
    );
  } else {
    process.stderr.write(`unit-golf: ${message}\n`);
  }

  process.exitCode = isUserError ? 2 : 1;
};

const main = argv => {
  const asJson = argv.includes("--json");

  try {
    const args = readArguments(argv);

    if (args.help) {
      process.stdout.write(`${HELP}\n`);
      return;
    }

    if (args.version) {
      process.stdout.write(`${version}\n`);
      return;
    }

    const result = unitGolf(args);
    process.stdout.write(
      args.json ? `${JSON.stringify(result)}\n` : renderText(result)
    );
  } catch (error) {
    renderError(error, asJson);
  }
};

main(process.argv.slice(2));

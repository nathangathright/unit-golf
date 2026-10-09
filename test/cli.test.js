"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const cli = path.join(__dirname, "..", "src", "cli.js");

const run = (...args) =>
  spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });

test("renders concise human output", () => {
  const result = run("108px", "--tolerance", "0");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /^⛳  6lh\n\n/);
  assert.equal(result.stderr, "");
});

test("returns machine-readable JSON", () => {
  const result = run("57.3vw", "--json");
  const output = JSON.parse(result.stdout);

  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(output.schemaVersion, 1);
  assert.equal(output.ok, true);
  assert.equal(output.input, "57.3vw");
  assert.equal(output.targetPx, 229.2);
  assert.equal(output.best.css, "172pt");
});

test("accepts a signed length in any argument position", () => {
  const result = run("--tolerance", "0", "-.5px", "--json");
  const output = JSON.parse(result.stdout);

  assert.equal(result.status, 0);
  assert.equal(output.best.css, "-.5px");
});

test("returns structured input errors", () => {
  const result = run("10rem", "--json");
  const output = JSON.parse(result.stderr);

  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.deepEqual(output, {
    schemaVersion: 1,
    ok: false,
    error: {
      code: "INVALID_LENGTH",
      message: "Invalid CSS length: 10rem"
    }
  });
});

test("returns structured argument errors", () => {
  const missing = run("--json");
  const unknown = run("10px", "--json", "--bogus");

  assert.equal(missing.status, 2);
  assert.deepEqual(JSON.parse(missing.stderr), {
    schemaVersion: 1,
    ok: false,
    error: {
      code: "INVALID_LENGTH",
      message: "Input must be a CSS length."
    }
  });
  assert.equal(unknown.status, 2);
  assert.equal(JSON.parse(unknown.stderr).error.code, "INVALID_ARGUMENT");
});

test("returns structured option errors", () => {
  const result = run("10px", "--tolerance", "nope", "--json");
  const output = JSON.parse(result.stderr);

  assert.equal(result.status, 2);
  assert.equal(output.error.code, "INVALID_OPTION");
});

test("documents options and reports its version", () => {
  const help = run("--help");
  const version = run("--version");

  assert.equal(help.status, 0);
  assert.match(help.stdout, /^Usage: unit-golf <length> \[options\]/);
  assert.match(help.stdout, /--json/);
  assert.equal(version.status, 0);
  assert.equal(version.stdout, "2.0.0\n");
});

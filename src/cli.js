#!/usr/bin/env node

const minimist = require("minimist");
const unitGolf = require("./index");

const renderOffset = offset => {
  if (offset === 0) return "";
  return `(${(offset > 0 ? "+" : "") + offset}px)`;
};

const renderBest = (option, chalk) => {
  const { string, pixelOffset } = option;
  return [
    chalk.hex("#8bc34a").bold(`⛳  ${string}`),
    chalk.green(renderOffset(pixelOffset))
  ].join(" ");
};

const renderRest = option => {
  const { string, pixelOffset } = option;
  return [string, renderOffset(pixelOffset)].join(" ");
};

const main = async () => {
  const [{ default: chalk }, { default: ora }] = await Promise.all([
    import("chalk"),
    import("ora")
  ]);
  const args = minimist(process.argv.slice(2));
  const {
    _: [input],
    tolerance,
    width,
    height
  } = args;
  const spinner = ora();
  spinner.start();

  let results;

  try {
    results = await unitGolf({
      input,
      tolerance,
      width,
      height
    });
  } finally {
    spinner.stop();
  }

  const [best, ...rest] = results;
  console.log("");
  console.log(renderBest(best, chalk));
  console.log("");
  console.log(rest.map(renderRest).join("\n"));
  console.log("");
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

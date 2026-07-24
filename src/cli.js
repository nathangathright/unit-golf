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
  const argv = process.argv.slice(2);
  const valueOptions = new Set(["--tolerance", "--width", "--height"]);
  let signedInput;

  for (let index = 0; index < argv.length; index += 1) {
    if (valueOptions.has(argv[index])) {
      index += 1;
      continue;
    }

    if (/^-(?:\d+(?:\.\d*)?|\.\d+)(?:[a-z]+)?$/i.test(argv[index])) {
      signedInput = argv.splice(index, 1)[0];
      break;
    }
  }

  const args = minimist(argv);
  const {
    _: [positionalInput],
    tolerance,
    width,
    height
  } = args;
  const input = signedInput || positionalInput;
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

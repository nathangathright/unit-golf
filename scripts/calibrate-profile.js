"use strict";

const puppeteer = require("puppeteer");

const FONT_UNITS = ["em", "ex", "ch", "lh", "cap"];
const SAMPLE_SIZE = 1024;

const calibrate = async () => {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 300 });
    const fontUnits = await page.evaluate(
      ({ sampleSize, unitNames }) => {
        const element = document.createElement("div");
        element.style.position = "absolute";
        document.body.appendChild(element);

        return Object.fromEntries(
          unitNames.map(name => {
            element.style.width = `${sampleSize}${name}`;
            return [
              name,
              element.getBoundingClientRect().width / sampleSize
            ];
          })
        );
      },
      { sampleSize: SAMPLE_SIZE, unitNames: FONT_UNITS }
    );

    console.log(
      JSON.stringify(
        {
          name: "cssbattle",
          description: "Chromium default document metrics at a 16px font size",
          fontUnits
        },
        null,
        2
      )
    );
  } finally {
    await browser.close();
  }
};

calibrate().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

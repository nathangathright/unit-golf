const UNITS = [
  "px",
  "vw",
  "vh",
  "in",
  "cm",
  "mm",
  "pt",
  "pc",
  "em",
  "ex",
  "q",
  "ch"
];

const loadPuppeteer = () => import("puppeteer").then(module => module.default);

const measureUnits = (value, units) => {
  const el = document.createElement("div");
  document.body.appendChild(el);

  const measureEl = widthValue => {
    el.setAttribute("style", `width:${widthValue}`);
    const { width } = el.getBoundingClientRect();
    el.removeAttribute("style");
    return width;
  };

  const initialWidth = measureEl(value);

  return {
    pxWidth: initialWidth,
    units: units.map(unit => {
      const measured = measureEl(`${initialWidth}${unit}`);
      return {
        name: unit,
        multiplier: measured / initialWidth
      };
    }, [])
  };
};

const getUnits = async ({ input, width, height }) => {
  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    return await page.evaluate(measureUnits, input, UNITS);
  } finally {
    await browser.close();
  }
};

module.exports = getUnits;

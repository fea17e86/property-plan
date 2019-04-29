function insertPlan({ element, ...options }) {
  element.innerHTML = createPlan(options);
}

function createPlan({
  property = {},
  svg: { width, height, preserveAspectRatio = "xMidYMid meet" }
}) {
  const bounds = getBounds({ width: property.width, height: property.height });

  return `
    <svg
      viewBox="0 0 ${bounds.width} ${bounds.height}"
      width="${width}"
      height="${height}"
      preserveAspectRatio="${preserveAspectRatio}"
    >
      <defs>
        ${styles}
        ${pattern}
      </defs>
      ${createSvgPlan(bounds, property)}
      ${createSvgGrid(bounds, property)}
      ${createRulers(bounds, property)}
    </svg>
  `;
}

function createSvgPlan(bounds = {}, property = {}) {
  const svgElements = Object.entries(property.elements).map(([id, element]) =>
    createSvgElement(id, element, bounds, property)
  );
  return `
  <g transform="translate(${bounds.left}, ${bounds.top})">
    ${svgElements.join("\n")}
  </g>
  `;
}

function createSvgElement(id, { type, ...props }) {
  const attrs = Object.entries(props).map(
    ([key, value]) => `${key}="${value}"`
  );
  return `<${type} id="${id}" ${attrs.join(" ")}/>`;
}

function createSvgGrid(bounds, property) {
  return `
  <rect
    transform="translate(${bounds.left}, ${bounds.top})"
    width="${property.width}"
    height="${property.height}"
    fill="url(#grid)"
  />
  `;
}

function createRulers(bounds, property) {
  return `
  <g id="ruler-left" transform="translate(0, ${bounds.top})">
    <rect x="100" y="0" width="100" height="${
      property.height
    }" fill="url(#ruler-v)" />
    ${createRulerLabels(property.height, translateLeftRulerLabel)}
  </g>
  <g id="ruler-right" transform="translate(${property.width +
    bounds.left +
    100}, ${bounds.top})">
    <rect
      x="0"
      y="0"
      width="100"
      height="${property.height}"
      fill="url(#ruler-v)"
      transform="scale(-1,1)"
    />
    ${createRulerLabels(property.height, translateRightRulerLabel)}
  </g>
  <g id="ruler-top" transform="translate(${bounds.left}, 150)">
    <rect x="0" y="0" width="${
      property.width
    }" height="100" fill="url(#ruler-h)" />
    ${createRulerLabels(property.width, translateTopRulerLabel)}
  </g>
  <g id="ruler-bottom" transform="translate(${bounds.left}, ${property.height +
    bounds.top +
    100})">
    <rect
      x="0"
      y="0"
      width="${property.width}"
      height="100"
      fill="url(#ruler-h)"
      transform="scale(1,-1)"
    />
    ${createRulerLabels(property.width, translateBottomRulerLabel)}
  </g>
  `;
}

function translateLeftRulerLabel(value, text) {
  const extraLength = text.length - 2;
  return `translate(${-30 - extraLength * 50}, ${30 + value})`;
}

function translateRightRulerLabel(value) {
  return `translate(10, ${30 + value})`;
}

function translateTopRulerLabel(value) {
  return `translate(${value - 50}, -20)`;
}

function translateBottomRulerLabel(value) {
  return `translate(${value - 50}, 80)`;
}

function getRulerLabel(value, translateFunction) {
  const text = `${value / 100}m`;
  return `<text transform="${translateFunction(
    value,
    text
  )}" font-size="100">${text}</text>`;
}

function createRulerLabels(distance, translateFunction) {
  const steps = distance / 500;
  const elements = [];

  for (let i = 0; i < steps; i++) {
    const value = i * 500;
    elements.push(getRulerLabel(value, translateFunction));
  }

  elements.push(getRulerLabel(distance, translateFunction));

  return elements.join("\n");
}

function getBounds({ width, height }) {
  const vRulerDigits = `${Math.round(width / 10) / 10}m`.length;
  const vRulerWidth = vRulerDigits * 40;
  const hRulerWidth = 250;

  return {
    top: hRulerWidth,
    right: vRulerWidth,
    bottom: hRulerWidth,
    left: vRulerWidth,
    width: width + 2 * vRulerWidth,
    height: height + 2 * hRulerWidth
  };
}

const styles = `
<style type="text/css">
<![CDATA[
text {
  font-family: monospace;
}

.grass {
  fill: mediumspringgreen;
}

.cobblestone {
  fill: gray;
}

.tree {
  fill: forestgreen;
}

.tree.conifer {
  fill: darkolivegreen;
}

.well {
  fill: brown;
}
]]>
</style>
`;

const pattern = `
<pattern
  id="small-ticks-v"
  width="100"
  height="100"
  patternUnits="userSpaceOnUse"
>
  <path
    d="M 100 0 L 0 0 0 100"
    fill="none"
    stroke="black"
    stroke-width="5"
  />
</pattern>
<pattern
  id="big-ticks-v"
  width="500"
  height="100"
  patternUnits="userSpaceOnUse"
>
  <path
    d="M 500 0 L 0 0 0 500"
    fill="none"
    stroke="black"
    stroke-width="20"
  />
</pattern>
<pattern
  id="ruler-h"
  width="500"
  height="100"
  patternUnits="userSpaceOnUse"
>
  <rect width="500" height="100" fill="url(#small-ticks-v)" />
  <rect width="500" height="100" fill="url(#big-ticks-v)" />
</pattern>
<pattern
  id="small-ticks-h"
  width="100"
  height="100"
  patternUnits="userSpaceOnUse"
  stroke-width="5"
>
  <path d="M 0 100 L 0 0 100 0" fill="none" stroke="black" />
</pattern>
<pattern
  id="big-ticks-h"
  width="100"
  height="500"
  patternUnits="userSpaceOnUse"
>
  <path
    d="M 0 500 L 0 0 500 0"
    fill="none"
    stroke="black"
    stroke-width="20"
  />
</pattern>
<pattern
  id="ruler-v"
  width="100"
  height="500"
  patternUnits="userSpaceOnUse"
>
  <rect width="100" height="500" fill="url(#small-ticks-h)" />
  <rect width="100" height="500" fill="url(#big-ticks-h)" />
</pattern>
<pattern
  id="grid"
  width="100"
  height="100"
  patternUnits="userSpaceOnUse"
>
  <path
    d="M 100 0 L 0 0 0 100"
    fill="none"
    stroke="black"
    stroke-opacity="0.3"
    stroke-width="5"
  />
</pattern>
`;

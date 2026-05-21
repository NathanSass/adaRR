export function inchToCm(inches) {
  return inches * 2.54;
}

export function cmToFt(cm) {
  return cm / 30.48;
}

export function ftToCm(foot) {
  return foot * 30.48;
}

export function ftToCmAndRound(ft) {
  return Math.round(ftToCm(ft) * 100) / 100;
}

export function parseStringToHTML(str, tag = "div") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");

  const htmlElement = doc.querySelector(tag);

  return htmlElement;
}

export function formatNumber(amount, minDecimal = 0) {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "decimal",
    minimumFractionDigits: minDecimal,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}

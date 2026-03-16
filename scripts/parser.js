export function parseStringToHTML(str, tag = "div") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");

  const htmlElement = doc.querySelector(tag);

  return htmlElement;
}

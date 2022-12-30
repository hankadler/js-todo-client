// import { fileURLToPath } from "url";
// import {dirname, resolve } from "path";

// const htmlPath = resolve(dirname(fileURLToPath(import.meta.url)), "../dist/index.html")

const path = require("path");
const fs = require("fs");

const htmlPath = path.resolve(__dirname, "../dist/index.html");

const fixDistHtml = () => {
  const htmlContents = fs.readFileSync(htmlPath, "utf-8");
  const fixedContents = htmlContents
    .replace(/(src="\/)/g, "src=\"./")
    .replace(/(href="\/)/g, "href=\"./");
  fs.writeFileSync(htmlPath, fixedContents, { encoding: "utf8", flag: "w" });
  console.log(`\nfixed ${htmlPath}`);
};

if (require.main === module) fixDistHtml();

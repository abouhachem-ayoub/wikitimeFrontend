// this script is called in package.json
// it updates version.js
// with the version number found in package.json
// version.js is then displayed in the app (in toolbar 11/2024)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../package.json"), "utf8"),
);
const version = packageJson.version;

const versionFilePath = path.resolve(__dirname, "version.ts");
const versionFileContent = `export const version = '${version}';\n`;

fs.writeFileSync(versionFilePath, versionFileContent, "utf8");
console.log(`Version ${version} written to src/config/version.ts`);

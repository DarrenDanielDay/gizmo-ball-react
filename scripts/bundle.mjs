import esbuild from "esbuild";
import fs from "fs/promises";
import rimraf from "rimraf";
import path from "path";
import { promisify } from "util";
const rm = promisify(rimraf);

const outTempFileName = "index1.js";
const outHtmlName = "index.html";
const outfileName = "index.js";
const outDir = "build";
const outfile = path.join(outDir, outTempFileName);
const outHtml = path.join(outDir, outHtmlName);
await esbuild.build({
  bundle: true,
  minify: true,
  entryPoints: [path.join(outDir, outfileName)],
  outfile,
});

const tempDir = "dist";
const imgDir = "img";
const imgPath = path.join(outDir, imgDir);
const icon = 'favicon.ico';
const iconPath = path.join(outDir, icon);
await rm(tempDir);
await fs.mkdir(tempDir);
await fs.copyFile(outfile, path.join(tempDir, outfileName));
await fs.copyFile(outHtml, path.join(tempDir, outHtmlName));
await rm(path.join(imgPath, "*.js"));
await fs.rename(imgPath, path.join(tempDir, imgDir));
await fs.rename(iconPath, path.join(tempDir, icon));
await rm(outDir);
await fs.rename(tempDir, outDir);

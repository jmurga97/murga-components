import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

import type { Element as XmlElement } from "@xmldom/xmldom";

interface PackageMetadata {
  name: string;
  version: string;
}

interface ManifestFile {
  bytes: number;
  contentType: string;
  integrity: string;
  path: string;
}

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "cdn-dist");
const bundleDir = path.join(outputDir, ".bundle");
const iconSourceDir = path.join(rootDir, "icons");
const packageMetadata = await readJson<PackageMetadata>(path.join(rootDir, "package.json"));
const versionDir = path.join(outputDir, "v", packageMetadata.version);

const distributableFiles = [
  {
    contentType: "text/javascript; charset=utf-8",
    destination: "murga-components.js",
    source: path.join(bundleDir, "murga-components.js"),
  },
  {
    contentType: "text/css; charset=utf-8",
    destination: "murga-components.css",
    source: path.join(rootDir, "cdn", "murga-components.css"),
  },
  {
    contentType: "font/woff2",
    destination: "fonts/geist-pixel-line.woff2",
    source: path.join(rootDir, "fonts", "GeistPixel-Line.woff2"),
  },
] as const;

await mkdir(versionDir, { recursive: true });

for (const file of distributableFiles) {
  const destination = path.join(versionDir, file.destination);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(file.source, destination);
}

await writeFile(path.join(versionDir, "icons.svg"), await createIconSprite(), "utf8");

const manifestFiles: Record<string, ManifestFile> = {};
for (const file of [
  ...distributableFiles.map(({ contentType, destination }) => ({ contentType, destination })),
  { contentType: "image/svg+xml; charset=utf-8", destination: "icons.svg" },
]) {
  const filePath = path.join(versionDir, file.destination);
  const contents = await readFile(filePath);
  manifestFiles[file.destination] = {
    bytes: (await stat(filePath)).size,
    contentType: file.contentType,
    integrity: createIntegrity(contents),
    path: `/v/${packageMetadata.version}/${file.destination}`,
  };
}

const manifest = {
  files: manifestFiles,
  name: packageMetadata.name,
  version: packageMetadata.version,
};

await writeFile(
  path.join(versionDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
await rm(bundleDir, { recursive: true });

console.log(`Built CDN release ${packageMetadata.version} in ${versionDir}`);

async function createIconSprite() {
  const iconFileNames = (await readdir(iconSourceDir))
    .filter((fileName) => fileName.endsWith(".svg"))
    .sort();

  if (iconFileNames.length === 0) {
    throw new Error("At least one SVG icon is required in icons/.");
  }

  const symbols = await Promise.all(
    iconFileNames.map(async (fileName) => {
      const slug = path.basename(fileName, ".svg");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`Icon filename must be kebab-case: ${fileName}`);
      }

      const source = await readFile(path.join(iconSourceDir, fileName), "utf8");
      return createSymbol(source, `mc-${slug}`, fileName);
    }),
  );

  return [
    '<svg xmlns="http://www.w3.org/2000/svg">',
    ...symbols.map((symbol) => `  ${symbol}`),
    "</svg>",
    "",
  ].join("\n");
}

function createSymbol(source: string, id: string, fileName: string) {
  const parseErrors: string[] = [];
  const document = new DOMParser({
    onError: (level, message) => {
      if (level === "error" || level === "fatalError") {
        parseErrors.push(message);
      }
    },
  }).parseFromString(source, "image/svg+xml");
  const root = document.documentElement;

  if (parseErrors.length > 0 || !root || root.localName !== "svg") {
    throw new Error(`Invalid SVG in ${fileName}: ${parseErrors.join("; ")}`);
  }

  const viewBox = root.getAttribute("viewBox")?.trim();
  if (!viewBox || !isValidViewBox(viewBox)) {
    throw new Error(`Icon ${fileName} must define a numeric viewBox.`);
  }

  validateSvgTree(root, fileName);

  const serializer = new XMLSerializer();
  const contents = Array.from(root.childNodes)
    .filter((node) => node.nodeType === 1 || (node.nodeType === 3 && node.nodeValue?.trim()))
    .map((node) => serializer.serializeToString(node))
    .join("")
    .replaceAll(/>\s+</g, "><");

  return `<symbol id="${id}" viewBox="${viewBox}">${contents}</symbol>`;
}

function validateSvgTree(root: XmlElement, fileName: string) {
  const blockedElements = new Set(["foreignObject", "script", "style"]);
  const elements = [root, ...Array.from(root.getElementsByTagName("*"))];

  for (const element of elements) {
    const localName = element.localName ?? element.nodeName;
    if (blockedElements.has(localName)) {
      throw new Error(`Icon ${fileName} contains unsupported <${localName}> content.`);
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = (attribute.value ?? "").trim();
      const isExternalReference =
        (name === "href" || name.endsWith(":href")) && !value.startsWith("#");

      if (name.startsWith("on") || isExternalReference) {
        throw new Error(`Icon ${fileName} contains an unsafe ${attribute.name} attribute.`);
      }
    }
  }
}

function isValidViewBox(viewBox: string) {
  const values = viewBox.split(/[\s,]+/).map(Number);
  return values.length === 4 && values.every(Number.isFinite) && values[2] > 0 && values[3] > 0;
}

function createIntegrity(contents: Uint8Array) {
  return `sha384-${createHash("sha384").update(contents).digest("base64")}`;
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

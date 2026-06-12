import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

interface PackageMetadata {
  version: string;
}

const bucketName = "murga-components-cdn";
const rootDir = process.cwd();
const mode = process.argv[2];

if (mode !== "--local" && mode !== "--remote") {
  throw new Error("Usage: bun scripts/publish-cdn.ts --local|--remote");
}

const packageMetadata = JSON.parse(
  await readFile(path.join(rootDir, "package.json"), "utf8"),
) as PackageMetadata;
const releaseRoot = path.join(rootDir, "cdn-dist", "v", packageMetadata.version);
const files = await listFiles(releaseRoot);

if (!files.includes("manifest.json")) {
  throw new Error("CDN build is missing. Run `bun run build:cdn` first.");
}

for (const relativePath of files) {
  await putObject(
    `v/${packageMetadata.version}/${relativePath}`,
    path.join(releaseRoot, relativePath),
    contentTypeFor(relativePath),
  );
}

const latestPath = path.join(rootDir, "cdn-dist", "latest.json");
await writeFile(latestPath, `${JSON.stringify({ version: packageMetadata.version }, null, 2)}\n`);
await putObject("latest.json", latestPath, "application/json; charset=utf-8");

console.log(`Published CDN release ${packageMetadata.version} to ${mode.slice(2)} R2.`);

async function listFiles(directory: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(path.join(directory, prefix), { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = path.posix.join(prefix, entry.name);
      return entry.isDirectory() ? listFiles(directory, relativePath) : [relativePath];
    }),
  );
  return files.flat().sort();
}

async function putObject(key: string, filePath: string, contentType: string) {
  const child = Bun.spawn(
    [
      "wrangler",
      "r2",
      "object",
      "put",
      `${bucketName}/${key}`,
      "--file",
      filePath,
      "--content-type",
      contentType,
      mode,
    ],
    {
      cwd: rootDir,
      stderr: "inherit",
      stdout: "inherit",
    },
  );
  const exitCode = await child.exited;

  if (exitCode !== 0) {
    throw new Error(`Failed to upload ${key}.`);
  }
}

function contentTypeFor(fileName: string) {
  if (fileName.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (fileName.endsWith(".css")) return "text/css; charset=utf-8";
  if (fileName.endsWith(".svg")) return "image/svg+xml; charset=utf-8";
  if (fileName.endsWith(".woff2")) return "font/woff2";
  if (fileName.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

interface Env {
  ASSETS: R2Bucket;
}

interface LatestRelease {
  version: string;
}

const allowedAssets = new Set([
  "fonts/geist-pixel-line.woff2",
  "icons.svg",
  "manifest.json",
  "murga-components.css",
  "murga-components.js",
]);
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export default {
  async fetch(request, env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(), status: 204 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonResponse({ error: "Method not allowed" }, 405, { Allow: "GET, HEAD, OPTIONS" });
    }

    const url = new URL(request.url);
    if (url.pathname === "/") {
      return jsonResponse({
        latest: "/latest/manifest.json",
        versionedPattern: "/v/{version}/{asset}",
      });
    }

    const latestMatch = /^\/latest\/(.+)$/.exec(url.pathname);
    if (latestMatch) {
      return redirectLatest(request, env, latestMatch[1]);
    }

    const versionMatch = /^\/v\/([^/]+)\/(.+)$/.exec(url.pathname);
    if (
      !versionMatch ||
      !semverPattern.test(versionMatch[1]) ||
      !allowedAssets.has(versionMatch[2])
    ) {
      return jsonResponse({ error: "Asset not found" }, 404);
    }

    return serveVersionedAsset(request, env, versionMatch[1], versionMatch[2]);
  },
} satisfies ExportedHandler<Env>;

async function redirectLatest(request: Request, env: Env, assetPath: string) {
  if (!allowedAssets.has(assetPath)) {
    return jsonResponse({ error: "Asset not found" }, 404);
  }

  const latestObject = await env.ASSETS.get("latest.json");
  if (!latestObject) {
    return jsonResponse({ error: "No CDN release has been published" }, 503);
  }

  const latest = await latestObject.json<LatestRelease>();
  if (!semverPattern.test(latest.version)) {
    return jsonResponse({ error: "Invalid latest release metadata" }, 500);
  }

  const destination = new URL(request.url);
  destination.pathname = `/v/${latest.version}/${assetPath}`;
  const headers = corsHeaders();
  headers.set("Cache-Control", "no-store");
  headers.set("Location", destination.toString());
  return new Response(null, { headers, status: 307 });
}

async function serveVersionedAsset(request: Request, env: Env, version: string, assetPath: string) {
  const key = `v/${version}/${assetPath}`;
  const object = request.method === "HEAD" ? await env.ASSETS.head(key) : await env.ASSETS.get(key);

  if (!object) {
    return jsonResponse({ error: "Asset not found" }, 404);
  }

  const headers = corsHeaders();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Content-Type", contentTypeFor(assetPath));
  headers.set("ETag", object.httpEtag);

  return new Response(request.method === "HEAD" ? null : (object as R2ObjectBody).body, {
    headers,
  });
}

function corsHeaders() {
  return new Headers({
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
  });
}

function jsonResponse(body: object, status = 200, extraHeaders: HeadersInit = {}) {
  const headers = corsHeaders();
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");

  for (const [name, value] of new Headers(extraHeaders)) {
    headers.set(name, value);
  }

  return Response.json(body, { headers, status });
}

function contentTypeFor(assetPath: string) {
  if (assetPath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (assetPath.endsWith(".css")) return "text/css; charset=utf-8";
  if (assetPath.endsWith(".svg")) return "image/svg+xml; charset=utf-8";
  if (assetPath.endsWith(".woff2")) return "font/woff2";
  return "application/json; charset=utf-8";
}

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const root = resolve("dist");
const port = Number(process.env.PORT ?? 4321);
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".json", "application/json"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

async function getFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  let candidate = resolve(join(root, decoded));
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return null;

  try {
    const info = await stat(candidate);
    if (info.isDirectory()) candidate = join(candidate, "index.html");
    const file = await stat(candidate);
    return file.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const file = await getFile(pathname);

  if (!file) {
    const notFound = join(root, "404.html");
    response.writeHead(404, { "Content-Type": mimeTypes.get(".html") });
    createReadStream(notFound).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes.get(extname(file)) ?? "application/octet-stream",
  });
  createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Static test server: http://127.0.0.1:${port}\n`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

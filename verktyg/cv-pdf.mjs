// Gör PDF:erna av CV-sidorna: cv/Idris-Altun-CV.pdf och en/cv/Idris-Altun-CV.pdf.
// Kör: node verktyg/cv-pdf.mjs   (kräver Node 22 eller nyare och Microsoft Edge)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const rot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sidor = ["cv/", "en/cv/"];
const typer = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webp": "image/webp" };

const edgeVagar = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const edge = edgeVagar.find((p) => fs.existsSync(p));
if (!edge) throw new Error("Hittar inte Microsoft Edge");

// En liten webbserver så att typsnittet laddas som på riktiga sidan
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const fil = path.join(rot, p);
  if (!fil.startsWith(rot) || !fs.existsSync(fil)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": typer[path.extname(fil)] || "application/octet-stream" });
  fs.createReadStream(fil).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const bas = `http://127.0.0.1:${server.address().port}/`;

const port = 9400 + Math.floor(Math.random() * 400);
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "cv-pdf-"));
const proc = spawn(edge, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "about:blank"], { stdio: "ignore" });
const vanta = (ms) => new Promise((r) => setTimeout(r, ms));

let mal;
for (let i = 0; i < 60 && !mal; i++) {
  await vanta(250);
  try { mal = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
if (!mal) throw new Error("Edge startade inte");

const ws = new WebSocket(mal.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const vantar = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && vantar.has(d.id)) { vantar.get(d.id)(d); vantar.delete(d.id); }
};
const skicka = (metod, params = {}) => new Promise((r) => { const i = ++id; vantar.set(i, r); ws.send(JSON.stringify({ id: i, method: metod, params })); });

await skicka("Page.enable");
for (const sida of sidor) {
  await skicka("Page.navigate", { url: bas + sida });
  await vanta(1500);
  // Länkarna i PDF:en ska gå till den riktiga sidan, inte till den lokala servern
  await skicka("Runtime.evaluate", {
    expression: `document.fonts.ready.then(() => { for (const a of document.querySelectorAll('a[href]')) { const u = new URL(a.href); if (u.hostname === '127.0.0.1') a.href = 'https://idrisaltun.com' + u.pathname + u.hash; } return true; })`,
    awaitPromise: true,
  });
  const svar = await skicka("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  if (!svar.result) throw new Error(JSON.stringify(svar.error));
  const ut = path.join(rot, sida, "Idris-Altun-CV.pdf");
  fs.writeFileSync(ut, Buffer.from(svar.result.data, "base64"));
  console.log("Skrev", path.relative(rot, ut));
}

ws.close();
proc.kill();
server.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
process.exit(0);

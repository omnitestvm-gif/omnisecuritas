import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContactHandler, jsonResponse, MAX_BODY_BYTES } from './contact.js';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

async function forward(response, result) {
  response.writeHead(result.status, Object.fromEntries(result.headers));
  response.end(Buffer.from(await result.arrayBuffer()));
}

export function createWebsiteServer({ contactHandler = createContactHandler() } = {}) {
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/api/contact') {
        let body;
        if (!['GET', 'HEAD'].includes(request.method)) {
          const chunks = [];
          let size = 0;
          let tooLarge = Number(request.headers['content-length']) > MAX_BODY_BYTES;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) tooLarge = true;
            if (tooLarge) {
              response.shouldKeepAlive = false;
              await forward(
                response,
                jsonResponse(413, 'Please shorten your inquiry and try again.'),
              );
              return;
            }
            chunks.push(chunk);
          }
          body = Buffer.concat(chunks);
        }
        const webRequest = new Request('http://localhost/api/contact', {
          method: request.method,
          headers: request.headers,
          body,
        });
        await forward(
          response,
          await contactHandler(webRequest, { clientAddress: request.socket.remoteAddress }),
        );
        return;
      }
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end('Method not allowed');
        return;
      }
      const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
      const file = path.resolve(root, `.${relativePath}`);
      const relative = path.relative(root, file);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }
      const data = await readFile(file);
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(request.method === 'HEAD' ? undefined : data);
    } catch (error) {
      if (response.headersSent) {
        response.end();
        return;
      }
      const status = error instanceof URIError ? 400 : 404;
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(status === 400 ? 'Bad request' : 'Not found');
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

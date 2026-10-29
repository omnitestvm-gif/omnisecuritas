import { loadLocalEnv } from '../server/env.js';
import { createWebsiteServer } from '../server/node-server.js';

loadLocalEnv();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const server = createWebsiteServer();
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use.` : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`Local: http://${host}:${port}`));

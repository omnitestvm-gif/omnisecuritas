import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

export function loadLocalEnv() {
  // Existing environment variables win; .env.local takes precedence over .env.
  config({ path: fileURLToPath(new URL('../.env.local', import.meta.url)), quiet: true });
  config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
}

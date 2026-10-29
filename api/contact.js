import { createContactHandler } from '../server/contact.js';

// Vercel Node.js Function. SMTP credentials stay on the server.
export default { fetch: createContactHandler() };

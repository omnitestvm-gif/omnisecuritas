import { createHmac, randomBytes } from 'node:crypto';
import { composeInquiry, createMailer, isEmail, RECIPIENT, smtpConfiguration } from './mail.js';

export const MAX_BODY_BYTES = 16 * 1024;
const interests = new Set([
  'Managed Detection & Response',
  'Endpoint Security',
  'Threat Hunting',
  'Security Assessment',
  'Incident Readiness',
  'Awareness Training',
  'Penetration Testing',
  'Incident Response Services',
  'Forensic Investigation',
  'Partnerships',
]);
const fields = new Set(['name', 'email', 'company', 'interest', 'message', 'website']);
const singleLineControls = /[\u0000-\u001f\u007f]/;
const messageControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function jsonResponse(status, message, extraHeaders = {}) {
  return Response.json(
    { ok: status === 200, message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...extraHeaders,
      },
    },
  );
}

export function validateInquiry(data) {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    Object.keys(data).some((key) => !fields.has(key))
  )
    return null;
  const inquiry = {};
  for (const [key, max] of [
    ['name', 100],
    ['email', 180],
    ['company', 150],
    ['interest', 100],
    ['message', 2000],
    ['website', 200],
  ]) {
    const value = data[key] ?? '';
    if (typeof value !== 'string' || value.length > max) return null;
    if ((key === 'message' ? messageControls : singleLineControls).test(value)) return null;
    inquiry[key] = value.trim();
  }
  if (
    !inquiry.name ||
    !inquiry.company ||
    !isEmail(inquiry.email) ||
    !interests.has(inquiry.interest) ||
    inquiry.website
  )
    return null;
  return inquiry;
}

// Best-effort per-process protection. Serverless instances do not share this map.
export function createRateLimiter({
  limit = 5,
  windowMs = 15 * 60 * 1000,
  maxEntries = 2048,
  now = Date.now,
} = {}) {
  const entries = new Map();
  const salt = randomBytes(32);
  return (address) => {
    const time = now();
    for (const [key, entry] of entries) if (entry.expires <= time) entries.delete(key);
    const key = createHmac('sha256', salt)
      .update(address || 'unknown')
      .digest('hex');
    let entry = entries.get(key);
    if (!entry) {
      // Fail closed when capacity is reached, rather than evicting active limits.
      if (entries.size >= maxEntries) return Math.ceil(windowMs / 1000);
      entry = { count: 0, expires: time + windowMs };
      entries.set(key, entry);
    }
    entry.count++;
    return entry.count > limit ? Math.max(1, Math.ceil((entry.expires - time) / 1000)) : 0;
  };
}

function allowedOrigins(env) {
  const origins = new Set();
  for (const value of (env.CONTACT_ALLOWED_ORIGINS || '').split(',')) {
    try {
      if (value.trim()) origins.add(new URL(value.trim()).origin);
    } catch {
      /* Invalid configuration is not allowed. */
    }
  }
  for (const value of [env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    try {
      if (value) origins.add(new URL(`https://${value}`).origin);
    } catch {
      /* Fail closed. */
    }
  }
  if (!env.VERCEL && env.NODE_ENV !== 'production') {
    const port = env.PORT || '4173';
    origins.add(`http://localhost:${port}`);
    origins.add(`http://127.0.0.1:${port}`);
  }
  return origins;
}

async function readJson(request) {
  const declared = Number(request.headers.get('content-length'));
  if (declared > MAX_BODY_BYTES) throw new Error('TOO_LARGE');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('BAD_JSON');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new Error('TOO_LARGE');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createContactHandler({
  env = process.env,
  mailerFactory = createMailer,
  rateLimit = createRateLimiter(),
  logger = console,
} = {}) {
  let mailer;
  return async (request, context = {}) => {
    if (request.method !== 'POST')
      return jsonResponse(405, 'Use POST to submit an inquiry.', { Allow: 'POST' });
    const origin = request.headers.get('origin');
    if (!origin || !allowedOrigins(env).has(origin))
      return jsonResponse(403, 'Please submit the form from this website.');
    if (
      request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json'
    )
      return jsonResponse(415, 'Please submit the website form.');
    const address = env.VERCEL
      ? request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for')
      : context.clientAddress;
    const retryAfter = rateLimit(address);
    if (retryAfter)
      return jsonResponse(429, 'Too many attempts. Please wait before trying again.', {
        'Retry-After': String(retryAfter),
      });
    let data;
    try {
      data = await readJson(request);
    } catch (error) {
      return jsonResponse(
        error.message === 'TOO_LARGE' ? 413 : 400,
        'Please check your inquiry and try again.',
      );
    }
    const inquiry = validateInquiry(data);
    if (!inquiry)
      return jsonResponse(400, 'Please check your name, email, company, service, and message.');
    let configuration;
    try {
      configuration = smtpConfiguration(env);
    } catch {
      return jsonResponse(
        503,
        'Online inquiries are temporarily unavailable. Please email our sales team directly.',
      );
    }
    try {
      mailer ??= mailerFactory(configuration);
      const info = await mailer.sendMail(composeInquiry(inquiry, configuration.from));
      const accepted = info.accepted?.some(
        (value) => (typeof value === 'string' ? value : value.address)?.toLowerCase() === RECIPIENT,
      );
      if (!accepted) throw new Error('RECIPIENT_NOT_ACCEPTED');
      return jsonResponse(
        200,
        'Your inquiry was submitted. Thank you for contacting OmniSecuritas.',
      );
    } catch {
      // Do not log message contents, credentials, or SMTP responses containing addresses.
      logger.error(
        'Contact email submission failed. Check SMTP configuration and provider status.',
      );
      return jsonResponse(
        502,
        'We could not submit your inquiry. Please try again or email our sales team directly.',
      );
    }
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import nodemailer from 'nodemailer';
import {
  createContactHandler,
  createRateLimiter,
  MAX_BODY_BYTES,
  validateInquiry,
} from '../server/contact.js';
import { composeInquiry, RECIPIENT, smtpConfiguration } from '../server/mail.js';
import { createWebsiteServer } from '../server/node-server.js';
import vercelFunction from '../api/contact.js';

const env = {
  NODE_ENV: 'production',
  SMTP_USER: 'website.sender@gmail.com',
  SMTP_PASS: 'test-app-password',
  CONTACT_ALLOWED_ORIGINS: 'https://omnisecuritas.com.ph',
};
const inquiry = {
  name: 'Juan Dela Cruz',
  email: 'juan@example.com',
  company: 'Example Corp',
  interest: 'Managed Detection & Response',
  message: 'Please contact us about MDR.\nThank you.',
  website: '',
};
const origin = 'https://omnisecuritas.com.ph';
const request = (data = inquiry, overrides = {}) =>
  new Request('https://omnisecuritas.com.ph/api/contact', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    ...overrides,
  });
function fixture(overrides = {}) {
  const sent = [];
  const handler = createContactHandler({
    env,
    logger: { error() {} },
    mailerFactory: () => ({
      async sendMail(message) {
        sent.push(message);
        return { accepted: [RECIPIENT] };
      },
    }),
    ...overrides,
  });
  return { handler, sent };
}

test('submits only to sales with authenticated From and visitor Reply-To', async () => {
  const { handler, sent } = fixture();
  const response = await handler(request(), { clientAddress: '192.0.2.1' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, RECIPIENT);
  assert.equal(sent[0].from.address, env.SMTP_USER);
  assert.equal(sent[0].replyTo.address, inquiry.email);
  assert.equal(sent[0].html, undefined);
  assert.equal(sent[0].attachments, undefined);
  assert.match(sent[0].text, /Company: Example Corp/);
});

test('rejects malformed fields, header injection, extra recipients, and honeypot submissions', async () => {
  const cases = [
    null,
    [],
    {},
    { ...inquiry, name: '' },
    { ...inquiry, company: '   ' },
    { ...inquiry, name: 'Attacker\r\nBcc: other@example.com' },
    { ...inquiry, company: 'Company\u0000' },
    { ...inquiry, email: 'person@example.com,other@example.com' },
    { ...inquiry, email: 'Person <person@example.com>' },
    { ...inquiry, email: 'person@example.com\r\nBcc: other@example.com' },
    { ...inquiry, message: 'Unsafe\u0000value' },
    { ...inquiry, interest: 'Unknown' },
    { ...inquiry, website: 'spam.example' },
    { ...inquiry, to: 'attacker@example.com' },
    { ...inquiry, name: 'a'.repeat(101) },
    { ...inquiry, message: 'a'.repeat(2001) },
    { ...inquiry, company: { toString: 'company' } },
  ];
  for (const data of cases) {
    const { handler, sent } = fixture();
    assert.equal((await handler(request(data))).status, 400);
    assert.equal(sent.length, 0);
  }
  assert.equal(validateInquiry({ ...inquiry, name: '  José Reyes  ' }).name, 'José Reyes');
});

test('requires POST, a permitted exact origin, and JSON', async () => {
  const { handler, sent } = fixture();
  assert.equal((await handler(new Request('https://example.com/api/contact'))).status, 405);
  for (const badOrigin of [
    '',
    'null',
    'https://omnisecuritas.com.ph.attacker.example',
    'https://attacker.example',
  ]) {
    assert.equal(
      (
        await handler(
          request(inquiry, { headers: { Origin: badOrigin, 'Content-Type': 'application/json' } }),
        )
      ).status,
      403,
    );
  }
  assert.equal(
    (await handler(request(inquiry, { headers: { Origin: origin, 'Content-Type': 'text/plain' } })))
      .status,
    415,
  );
  assert.equal(sent.length, 0);
});

test('rejects invalid JSON and bounded bodies, including chunked requests', async () => {
  const { handler, sent } = fixture();
  assert.equal((await handler(request(inquiry, { body: '{broken' }))).status, 400);
  assert.equal(
    (await handler(request(inquiry, { body: 'a'.repeat(MAX_BODY_BYTES + 1) }))).status,
    413,
  );
  const chunked = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(MAX_BODY_BYTES));
      controller.enqueue(new Uint8Array(1));
      controller.close();
    },
  });
  assert.equal((await handler(request(inquiry, { body: chunked, duplex: 'half' }))).status, 413);
  assert.equal(sent.length, 0);
});

test('rate limits repeat attempts with expiry and bounded capacity', async () => {
  let time = 0;
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000, maxEntries: 2, now: () => time });
  assert.equal(limiter('one'), 0);
  assert.equal(limiter('one'), 0);
  assert.equal(limiter('one'), 1);
  assert.equal(limiter('two'), 0);
  assert.equal(limiter('three'), 1);
  time = 1001;
  assert.equal(limiter('one'), 0);
  const { handler, sent } = fixture({ rateLimit: () => 120 });
  const response = await handler(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '120');
  assert.equal(sent.length, 0);
});

test('allows configured Vercel URLs and uses only trusted platform address for limits', async () => {
  const addresses = [];
  const { handler } = fixture({
    env: {
      ...env,
      VERCEL: '1',
      VERCEL_URL: 'preview.vercel.app',
      VERCEL_PROJECT_PRODUCTION_URL: 'project.vercel.app',
    },
    rateLimit: (address) => {
      addresses.push(address);
      return 0;
    },
  });
  for (const allowed of ['https://preview.vercel.app', 'https://project.vercel.app', origin]) {
    assert.equal(
      (
        await handler(
          request(inquiry, {
            headers: {
              Origin: allowed,
              'Content-Type': 'application/json',
              'x-vercel-forwarded-for': '192.0.2.20',
            },
          }),
        )
      ).status,
      200,
    );
  }
  assert.deepEqual(addresses, ['192.0.2.20', '192.0.2.20', '192.0.2.20']);
  assert.equal(
    (
      await handler(
        request(inquiry, {
          headers: { Origin: 'http://localhost:4173', 'Content-Type': 'application/json' },
        }),
      )
    ).status,
    403,
  );
});

test('missing credentials, rejected recipients, or SMTP failures never report success', async () => {
  const { handler: unconfigured } = fixture({ env: { ...env, SMTP_PASS: '' } });
  assert.equal((await unconfigured(request())).status, 503);
  const logs = [];
  for (const sendMail of [
    async () => ({ accepted: [], rejected: [RECIPIENT] }),
    async () => {
      throw new Error('password=secret');
    },
  ]) {
    const { handler } = fixture({
      logger: { error: (text) => logs.push(text) },
      mailerFactory: () => ({ sendMail }),
    });
    const response = await handler(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  }
  assert.ok(logs.every((value) => !value.includes('secret') && !value.includes(inquiry.email)));
});

test('SMTP enforces TLS and keeps Gmail sender aligned with login', () => {
  const configuration = smtpConfiguration({ ...env, SMTP_PASS: 'abcd efgh ijkl mnop' });
  assert.equal(configuration.options.host, 'smtp.gmail.com');
  assert.equal(configuration.options.secure, true);
  assert.equal(configuration.options.auth.pass, 'abcdefghijklmnop');
  assert.equal(configuration.options.tls.minVersion, 'TLSv1.2');
  assert.equal(configuration.options.disableFileAccess, true);
  assert.equal(configuration.options.disableUrlAccess, true);
  const startTls = smtpConfiguration({ ...env, SMTP_PORT: '587' }).options;
  assert.equal(startTls.secure, false);
  assert.equal(startTls.requireTLS, true);
  assert.throws(() => smtpConfiguration({ ...env, SMTP_PORT: '25' }));
  assert.throws(() => smtpConfiguration({ ...env, SMTP_FROM: 'sales@omnisecuritas.com.ph' }));
});

test('Nodemailer builds plain text mail without a network connection', async () => {
  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: 'unix',
  });
  const message = composeInquiry(
    { ...inquiry, name: 'José Reyes', message: '<script>alert(1)</script>\nHello' },
    env.SMTP_USER,
  );
  const info = await transport.sendMail(message);
  const raw = info.message.toString();
  assert.match(raw, /To: sales@omnisecuritas.com.ph/);
  assert.match(raw, /Reply-To: .*<juan@example.com>/);
  assert.match(raw, /Content-Type: text\/plain/);
  assert.doesNotMatch(raw, /Content-Type: text\/html/);
  assert.equal(vercelFunction.fetch instanceof Function, true);
});

test('local HTTP server serves pages and contact API without exposing server files', async () => {
  const { handler, sent } = fixture();
  const server = createWebsiteServer({ contactHandler: handler });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(`${base}/contact.html`)).status, 200);
    assert.equal((await fetch(`${base}/.env.local`)).status, 404);
    assert.equal((await fetch(`${base}/server/mail.js`)).status, 404);
    assert.equal((await fetch(`${base}/api/contact`)).status, 405);
    const response = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    assert.equal(response.status, 200);
    assert.equal(sent.length, 1);
    const tooLarge = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: 'a'.repeat(MAX_BODY_BYTES + 1),
    });
    assert.equal(tooLarge.status, 413);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

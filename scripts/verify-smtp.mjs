import { loadLocalEnv } from '../server/env.js';
import { createMailer, smtpConfiguration } from '../server/mail.js';

loadLocalEnv();
let transport;
try {
  transport = createMailer(smtpConfiguration());
  await transport.verify();
  console.log('SMTP connection and authentication succeeded. No email was sent.');
} catch {
  console.error(
    'SMTP verification failed. Check your private SMTP settings, Gmail App Password, and network access. No email was sent.',
  );
  process.exitCode = 1;
} finally {
  transport?.close();
}

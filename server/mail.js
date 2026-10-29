import nodemailer from 'nodemailer';

export const RECIPIENT = 'sales@omnisecuritas.com.ph';
const addressPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
export const isEmail = (value) =>
  typeof value === 'string' && value.length <= 180 && addressPattern.test(value);

export function smtpConfiguration(env = process.env) {
  const host = (env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(env.SMTP_PORT || 465);
  const user = (env.SMTP_USER || '').trim();
  const pass = host === 'smtp.gmail.com' ? (env.SMTP_PASS || '').replace(/\s/g, '') : env.SMTP_PASS;
  const from = (env.SMTP_FROM || user).trim();
  if (!host || ![465, 587].includes(port) || !isEmail(user) || !pass || !isEmail(from)) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }
  if (host === 'smtp.gmail.com' && from.toLowerCase() !== user.toLowerCase()) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }
  return {
    from,
    options: {
      host,
      port,
      secure: port === 465,
      requireTLS: true,
      auth: { user, pass },
      tls: { minVersion: 'TLSv1.2' },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
      disableFileAccess: true,
      disableUrlAccess: true,
      logger: false,
      debug: false,
    },
  };
}

export function composeInquiry(inquiry, from) {
  return {
    from: { name: 'OmniSecuritas Website', address: from },
    to: RECIPIENT,
    replyTo: { name: inquiry.name, address: inquiry.email },
    subject: `Website inquiry: ${inquiry.interest}`,
    text: [
      'New inquiry from the OmniSecuritas website',
      '',
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Company: ${inquiry.company}`,
      `Service: ${inquiry.interest}`,
      '',
      inquiry.message || 'Please contact me to discuss our requirements.',
      '',
      'Use Reply to respond directly to the visitor.',
    ].join('\n'),
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

export function createMailer(configuration) {
  return nodemailer.createTransport(configuration.options);
}

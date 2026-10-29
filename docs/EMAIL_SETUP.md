# Contact email setup with Gmail

The homepage and Contact Us form submit JSON to `/api/contact`. A Node.js backend uses the open-source Nodemailer library to send the inquiry through Gmail SMTP. The same backend runs locally and as a Vercel Node.js Function.

## Where the inquiry goes

| Email field | Value                                                               |
| ----------- | ------------------------------------------------------------------- |
| From        | Your configured Gmail address, displayed as “OmniSecuritas Website” |
| To          | `sales@omnisecuritas.com.ph` — fixed in server code                 |
| Reply-To    | The visitor’s validated email address                               |

Your personal Gmail address will be visible as the sender. This setup assumes the sales mailbox exists and receives email. If you want inquiries delivered to a different mailbox later, change `RECIPIENT` in `server/mail.js` on the server; visitors cannot choose a recipient.

The website does not save inquiries in a database. Gmail, the destination email system, and hosting infrastructure may retain messages or operational records. Successful submission means the SMTP server accepted the email for the recipient; check the sales inbox and spam folder to confirm delivery. There is no automatic email to the visitor.

## 1. Create a Gmail App Password

1. Sign in to the Google account you want to use as the sender.
2. Enable [2-Step Verification](https://support.google.com/accounts/answer/185839).
3. Open [Google App Passwords](https://myaccount.google.com/apppasswords) and create an entry named **OmniSecuritas Website**.
4. Copy the generated password into your private environment settings. Do not use your regular Google password or paste credentials into chat, source files, or GitHub.

App Passwords require 2-Step Verification. Some accounts do not offer them; see [Google’s App Password guide](https://support.google.com/accounts/answer/185833). If unavailable, this password-based configuration will need to be replaced with Gmail OAuth2 or another SMTP provider. Changing your Google account password revokes existing App Passwords.

## 2. Run locally in Antigravity

Open this project root in the IDE. Create the local settings file once:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` privately:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-personal-address@gmail.com
SMTP_PASS=your-generated-app-password
```

Use your real Gmail address and App Password in those two fields. `SMTP_FROM` may be left blank; it defaults to `SMTP_USER`. For Gmail, these addresses must match. The `.env.local` file is ignored by Git and deployment uploads. The browser never receives these values. Do not put this file in `public/`.

```powershell
npm install
npm run smtp:verify
npm run dev
```

`smtp:verify` checks SMTP connection and authentication without sending an email. Open <http://localhost:4173/contact.html>, submit a test inquiry, then check the sales mailbox. That manual submission sends a real email.

If a preview is already running, stop it with **Ctrl+C** and restart `npm run dev`. Restart after changing environment variables. A generic static preview, Live Server, or opening the HTML file directly cannot run the email backend. Both `localhost` and `127.0.0.1` are permitted locally; changing `PORT` also changes the permitted local origins.

## 3. Deploy to Vercel

Import the **whole repository root**, including `api/` and `server/`. Keep the existing `vercel.json`: build `npm run build`, output `public`, framework **Other**. Vercel serves the static website and creates the `/api/contact` Node.js Function separately.

In **Project Settings → Environment Variables**, add:

| Name                      | Value                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `SMTP_USER`               | Your Gmail address                                                                                                    |
| `SMTP_PASS`               | Your Google App Password                                                                                              |
| `SMTP_HOST`               | `smtp.gmail.com` (also the default)                                                                                   |
| `SMTP_PORT`               | `465` (also the default)                                                                                              |
| `CONTACT_ALLOWED_ORIGINS` | Your exact website origins, separated by commas, e.g. `https://omnisecuritas.com.ph,https://www.omnisecuritas.com.ph` |

Set credentials for the Vercel environments where you want email enabled. Prefer limiting real credentials to Production if untrusted contributors can create previews. Redeploy after adding or changing variables. These are runtime server secrets; do not use public-prefixed variable names or embed them in frontend code.

The Vercel system URLs `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL` are also allowed automatically. If a stable branch alias or custom domain returns 403, add its exact origin to `CONTACT_ALLOWED_ORIGINS` and redeploy. No wildcard origins are used. If automatic system environment exposure is disabled in the Vercel project, add the deployed origin explicitly.

The separate `.chatgpt.site` preview uses a different hosting runtime. This Nodemailer backend is supplied for localhost and Vercel; it is not installed on that preview. Uploading only `public/` to a static host will not provide email delivery.

## Security and operational behavior

- TLS is required. Port 465 uses TLS immediately; port 587 requires STARTTLS. Certificate verification remains enabled. Gmail’s documented endpoints are covered in [Google SMTP documentation](https://developers.google.com/workspace/gmail/imap/imap-smtp).
- Only same-origin JSON POST submissions are accepted. The backend validates field sizes, service choices, single email addresses, and control characters. It rejects extra recipient fields and other unknown fields.
- The recipient is fixed. The backend sends plain text only, accepts no attachments, and disables file and URL access in Nodemailer. It does not log inquiry contents or SMTP credentials.
- A honeypot and a bounded, expiring in-memory limit of five attempts per client address per 15 minutes provide basic abuse protection. Network identifiers are hashed with a process-specific salt. Limits reset on process restart and are **not shared across Vercel instances**. Same-origin checks do not authenticate non-browser clients. Add Vercel Firewall rules or a shared rate limiter/CAPTCHA if traffic or abuse requires stronger protection.
- The form shows a pending state, keeps entered details on failure, and only clears them after SMTP acceptance. A timeout can occur after an email has been accepted; check for a reply before resubmitting repeatedly.
- Gmail applies account sending restrictions. Monitor the sending account and destination inbox; for higher volume, configure a dedicated SMTP service or business account.

## Troubleshooting

| Result                                          | What to check                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Online inquiries unavailable / 503              | `SMTP_USER` and `SMTP_PASS` are set; restart locally or redeploy Vercel                           |
| Submission failed / 502                         | Run `npm run smtp:verify`; check the App Password, account access, and outbound SMTP connectivity |
| Website origin rejected / 403                   | Add the exact deployed origin to `CONTACT_ALLOWED_ORIGINS`; no paths or wildcards                 |
| Too many attempts / 429                         | Wait 15 minutes before another attempt                                                            |
| API not found / 404 or method not allowed / 405 | Restart with `npm run dev`; on Vercel import the full root with `api/`, not only `public/`        |
| Submitted but not in the inbox                  | Check sales mailbox existence, spam/quarantine, Gmail account notices, and destination filtering  |

Run `npm test` for offline backend tests. They use injected mail transports and Nodemailer’s stream transport; they never send real email.

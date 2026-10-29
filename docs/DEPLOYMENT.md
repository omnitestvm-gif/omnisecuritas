# GitHub and Vercel deployment

## 1. Prepare the project

Open the directory containing `package.json` and `vercel.json` in Antigravity. In its terminal:

```powershell
npm install
npm run build
npm run dev
```

Check <http://127.0.0.1:4173>. Stop the preview with Ctrl+C. If PowerShell blocks npm scripts, substitute `npm.cmd` for `npm`.

## 2. Upload to GitHub

Create a new empty repository in your GitHub account. Do not initialize it with another README, license, or `.gitignore` when following these commands.

The working directory on this machine is:

```powershell
cd "C:\Users\ruel3\Music\Omni_Website"
```

Initialize Git if the folder is not already a repository:

```powershell
git init -b main
```

Review, stage, and commit your project:

```powershell
git status
git add .
git commit -m "Prepare OmniSecuritas website for Vercel"
```

Add your **actual GitHub repository URL** and push. Replace both placeholders below:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

GitHub may ask you to sign in. The retained `sites/` folder, `.env.local` and other secret environment files, local dependencies, deployment state, and generated archives are ignored. Never force-add credentials to Git. `package-lock.json`, the website assets, and vendor notices belong in the repository.

If an `origin` already exists, inspect it with `git remote -v` before choosing how to update it. Avoid overwriting an existing remote unintentionally.

GitHub’s [instructions for adding local code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github) explain the full workflow.

## 3. Import into Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Connect GitHub if needed and import the repository you just pushed.
3. Keep **Root Directory** at the repository root. Do not select `public` as the root; Vercel needs the root configuration and package files.
4. Use **Other** as the framework preset.
5. Check that **Build Command** is `npm run build` and **Output Directory** is `public`. These are set in `vercel.json`.
6. Use `npm ci` as the install command, or retain the detected npm installation command. Add the Gmail SMTP credentials and permitted website origins described in [Email setup](EMAIL_SETUP.md). Keep build-time development dependencies enabled: esbuild, TypeScript, and Tailwind are required by `npm run build`.
7. Select **Deploy** and open Vercel’s returned URL after the deployment succeeds.

Vercel hosts the static contents of `public/` and builds `api/contact.js` as a Node.js Function at `/api/contact`. Keep `server/` in the repository: it contains shared backend code. The local development server serves the same endpoint. A static-only host cannot run Nodemailer.

See [Vercel’s build settings](https://vercel.com/docs/builds/configure-a-build), [configuration reference](https://vercel.com/docs/project-configuration/vercel-json), and [GitHub integration](https://vercel.com/docs/git/vercel-for-github).

The build generates all five HTML pages from `src/pages/`, `src/layout.html`, and `src/partials/`. Keep these source templates in GitHub together with the generated pages and assets. No SPA rewrite is needed: each page has its own `.html` URL.

## 4. Publish later changes

Edit the site, validate, and push:

```powershell
npm run build
git add .
git commit -m "Update website content"
git push
```

With Vercel’s GitHub integration connected, pushes trigger deployments according to the project’s branch settings. The production branch is normally `main`; review the setting in your Vercel project.

## Troubleshooting

| Symptom                                | Check                                                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Vercel homepage is 404                 | Root Directory is the repository root; Output Directory is `public`; `public/index.html` is committed     |
| Logo, fonts, or animations are missing | Commit all files inside `public/`; run `npm run build` to identify broken asset paths                     |
| `npm` is not recognized                | Install Node.js, then restart the IDE terminal                                                            |
| PowerShell blocks `npm.ps1`            | Run `npm.cmd install`, `npm.cmd run build`, or `npm.cmd run dev`                                          |
| Local port 4173 is occupied            | Stop the earlier preview or set `$env:PORT = '4174'` before `npm run dev`                                 |
| Form does not send automatically       | Configure Gmail in `.env.local` locally or Vercel environment settings; see [Email setup](EMAIL_SETUP.md) |
| Globe is static                        | Reduced-motion preferences or WebGL availability may activate the fallback                                |

No GitHub repository or Vercel deployment is created by running the local validation scripts.

The build also type-checks and bundles the small React/Motion threat-hunting component and compiles its Tailwind utilities. Use `npm ci` before building a freshly extracted project. The generated HTML remains usable without JavaScript.

import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const root = fileURLToPath(new URL('../', import.meta.url));
function runNodeScript(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.status !== 0) throw new Error(`Build step failed: ${script}`);
}
runNodeScript('node_modules/typescript/bin/tsc', ['--noEmit']);
await mkdir(path.join(root, '.build'), { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: ['components/homepage-islands.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
  outfile: path.join(root, '.build/homepage-islands-ssr.mjs'),
});
const { ThreatHuntingProcess, SecurityClarity, HeroGlobe } = await import(
  pathToFileURL(path.join(root, '.build/homepage-islands-ssr.mjs')).href
);
const threatHuntingMarkup = renderToString(createElement(ThreatHuntingProcess));
const securityClarityMarkup = renderToString(createElement(SecurityClarity));
const heroGlobeMarkup = renderToString(createElement(HeroGlobe));
await build({
  absWorkingDir: root,
  entryPoints: ['src/islands/homepage.tsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'external',
  outfile: path.join(root, 'public/js/homepage-islands.js'),
});
for (const obsolete of ['public/js/threat-hunting.js', 'public/js/threat-hunting.js.LEGAL.txt']) {
  await unlink(path.join(root, obsolete)).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}
runNodeScript('node_modules/@tailwindcss/cli/dist/index.mjs', [
  '-i',
  'src/styles/components.css',
  '-o',
  'public/css/components.css',
  '--minify',
]);
const readSource = (name) => readFile(path.join(root, 'src', name), 'utf8');
const metadata = JSON.parse(await readSource('pages.json'));
const layout = await readSource('layout.html');
const partials = {};
partials['threat-hunting'] = threatHuntingMarkup;
partials['security-clarity'] = securityClarityMarkup;
partials['hero-globe'] = heroGlobeMarkup;
for (const name of ['header', 'footer', 'dialog', 'mdr-workflow', 'contact-section']) {
  partials[name] = await readSource(`partials/${name}.html`);
}
const escapeAttribute = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

for (const [slug, page] of Object.entries(metadata)) {
  let content = await readSource(`pages/${slug}.html`);
  content = content.replace(/\{\{([\w-]+)\}\}/g, (match, name) => {
    if (!(name in partials)) throw new Error(`Unknown partial: ${name}`);
    return partials[name];
  });
  const header = partials.header.replace(
    `data-nav="${page.active}"`,
    `data-nav="${page.active}" aria-current="page"`,
  );
  const values = {
    title: escapeAttribute(page.title),
    description: escapeAttribute(page.description),
    header,
    footer: partials.footer,
    dialog: partials.dialog,
    content,
    componentStyles: [
      page.solutionsHero ? '<link rel="stylesheet" href="css/solutions-hero.css" />' : '',
      page.threatHunting ? '<link rel="stylesheet" href="css/components.css" />' : '',
      page.servicesHero ? '<link rel="stylesheet" href="css/services-hero.css" />' : '',
    ].join('\n'),
    pageScripts: [
      page.solutionsHero ? '<script src="js/solutions-hero.js" defer></script>' : '',
      page.servicesHero ? '<script src="js/services-hero.js" defer></script>' : '',
      page.globe || page.threatHunting
        ? '<script type="module" src="js/homepage-islands.js"></script>'
        : '',
    ].join('\n'),
  };
  const html = layout.replace(/\{\{(\w+)\}\}/g, (match, name) => {
    if (!(name in values)) throw new Error(`Unknown layout value: ${name}`);
    return values[name];
  });
  await writeFile(path.join(root, 'public', `${slug}.html`), html);
}
console.log(`Built ${Object.keys(metadata).length} static pages from shared templates.`);
await import('./validate.mjs');

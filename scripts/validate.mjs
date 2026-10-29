import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = path.join(projectRoot, 'public');
const failures = [];
let references = 0;
const pageIds = new Map();

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const lists = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(target) : [target];
    }),
  );
  return lists.flat();
}

async function checkReference(fromFile, reference, checkAnchor = false) {
  if (!reference || reference === '#' || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(reference)) return;
  const target = decodeURIComponent(reference.split(/[?#]/)[0]);
  const resolved = !target
    ? fromFile
    : target.startsWith('/')
      ? path.join(publicRoot, target)
      : path.resolve(path.dirname(fromFile), target);
  const relative = path.relative(publicRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    failures.push(`Reference escapes public/: ${reference}`);
    return;
  }
  try {
    const info = await stat(resolved);
    if (!info.isFile()) throw new Error('Not a file');
    references++;
    const fragment = reference.includes('#') ? decodeURIComponent(reference.split('#')[1]) : '';
    if (checkAnchor && fragment && pageIds.has(resolved) && !pageIds.get(resolved).has(fragment)) {
      failures.push(`Broken anchor: ${path.relative(publicRoot, fromFile)} -> ${reference}`);
    }
  } catch {
    failures.push(`Missing asset: ${path.relative(publicRoot, fromFile)} -> ${reference}`);
  }
}

const config = JSON.parse(await readFile(path.join(projectRoot, 'vercel.json'), 'utf8'));
if (config.outputDirectory !== 'public') failures.push('Vercel outputDirectory must be public.');
if (config.framework !== null) failures.push('Vercel framework must be null (Other).');

const files = await filesIn(publicRoot);
for (const file of files.filter((file) => path.extname(file) === '.html')) {
  const html = await readFile(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (ids.length !== new Set(ids).size) failures.push(`Duplicate IDs in ${path.basename(file)}`);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    failures.push(`Expected one page heading in ${path.basename(file)}`);
  if (/\{\{[\w-]+\}\}/.test(html)) failures.push(`Unresolved template in ${path.basename(file)}`);
  pageIds.set(file, new Set(ids));
}

for (const file of files) {
  const extension = path.extname(file);
  if (!['.html', '.css', '.js'].includes(extension)) continue;
  const source = await readFile(file, 'utf8');
  if (extension === '.html') {
    for (const match of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
      await checkReference(file, match[1], true);
    }
  }
  if (extension === '.css') {
    for (const match of source.matchAll(/url\(\s*['"]?([^\s'"\)]+)['"]?\s*\)/g)) {
      await checkReference(file, match[1]);
    }
  }
  if (extension === '.js' && !file.includes(`${path.sep}vendor${path.sep}`)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) failures.push(result.stderr || `Invalid JavaScript: ${file}`);
    for (const match of source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)) {
      await checkReference(file, match[1]);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${files.length} public files, ${references} local asset references, JavaScript syntax, section anchors, and Vercel configuration.`,
  );
  console.log(
    'Ready to deploy. Compiled component assets and generated pages are served from public/.',
  );
}

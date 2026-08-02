/**
 * Bundle the Drafting Table prototype into ONE self-contained HTML file.
 * React, lucide icons, CSS and fonts-CSS are all inlined — the file opens
 * offline with a double-click. Output: frontend/prototypes/AIIMIN-Drafting-Table.html
 *
 * Run: node scripts/build-proto.mjs
 */
import * as esbuild from 'esbuild';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const OUT = resolve(root, 'prototypes/AIIMIN-Drafting-Table.html');

// Bundle JS (JSX -> IIFE, React bundled in, CSS collected separately).
const result = await esbuild.build({
  entryPoints: [resolve(root, 'src/prototypes/drafting-table/standalone.jsx')],
  bundle: true,
  format: 'iife',
  minify: true,
  write: false,
  outdir: resolve(root, '.proto-build'),
  jsx: 'automatic',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  define: { 'process.env.NODE_ENV': '"production"' },
  target: ['es2019'],
});

let js = '';
let css = '';
for (const f of result.outputFiles) {
  if (f.path.endsWith('.css')) css += f.text;
  else js += f.text;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AIIMIN — Drafting Table prototype</title>
<style>
${css}
html, body { margin: 0; padding: 0; background: #0b0c0e; }
</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, 'utf8');
console.log('wrote', OUT, (html.length / 1024).toFixed(0) + 'kb');

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const requiredFiles = [
  'index.html',
  'app.js',
  'game.js',
  'styles.css',
  'assets/player.png',
  'assets/crate.png',
];

test('static bundle contains every runtime file used by native wrappers', () => {
  for (const relativePath of requiredFiles) {
    const absolutePath = resolve(dist, relativePath);
    assert.equal(existsSync(absolutePath), true, `missing dist/${relativePath}`);
  }

  const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
  assert.match(html, /app\.js/);
});

test('native packaging entrypoints and scripts are declared', () => {
  assert.equal(existsSync(resolve(root, 'desktop/main.cjs')), true, 'missing desktop/main.cjs');
  assert.equal(existsSync(resolve(root, 'forge.config.cjs')), true, 'missing forge.config.cjs');
  assert.equal(existsSync(resolve(root, 'capacitor.config.ts')), true, 'missing capacitor.config.ts');

  const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  assert.equal(typeof packageJson.scripts['desktop:make'], 'string');
  assert.equal(typeof packageJson.scripts['android:build'], 'string');
});

test('desktop metadata includes an application version for Electron packaging', () => {
  const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  assert.match(packageJson.version, /^\d+\.\d+\.\d+$/);
});

test('squirrel metadata includes an author for the Windows installer', () => {
  const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  assert.equal(typeof packageJson.author, 'string');
  assert.notEqual(packageJson.author.trim(), '');
});

test('repository includes a reproducible Android CI build workflow', () => {
  const workflow = resolve(root, '.github', 'workflows', 'android.yml');
  assert.equal(existsSync(workflow), true, 'missing .github/workflows/android.yml');
  const yaml = readFileSync(workflow, 'utf8');
  assert.match(yaml, /assembleDebug/);
  assert.match(yaml, /upload-artifact/);
});

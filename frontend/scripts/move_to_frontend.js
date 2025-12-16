const fs = require('fs');
const path = require('path');

const root = process.cwd();
const destRoot = path.join(root, 'frontend');

const items = [
  'android',
  'app',
  'app.json',
  'assets',
  'components',
  'constants',
  'eslint.config.js',
  'expo-env.d.ts',
  'hooks',
  'package-lock.json',
  'package.json',
  'README.md',
  'scripts',
  'store',
  'tsconfig.json'
];

function safeMove(item) {
  try {
    const src = path.join(root, item);
    const dest = path.join(destRoot, item);
    if (!fs.existsSync(src)) {
      console.log(`SKIP: ${item} (not found)`);
      return;
    }
    if (fs.existsSync(dest)) {
      console.log(`SKIP: ${item} (already exists in frontend/)`);
      return;
    }
    fs.renameSync(src, dest);
    console.log(`MOVED: ${item}`);
  } catch (err) {
    console.error(`ERROR moving ${item}:`, err.message);
  }
}

if (!fs.existsSync(destRoot)) fs.mkdirSync(destRoot, { recursive: true });

console.log('Starting move to frontend/');
items.forEach(safeMove);
console.log('Move complete. Please review frontend/ and restart tooling if needed.');

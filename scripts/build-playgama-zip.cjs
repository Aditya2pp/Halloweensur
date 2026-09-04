const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const pythonScript = path.join(__dirname, 'build-playgama-zip.py');

try {
  execSync(`python3 "${pythonScript}"`, { stdio: 'inherit', cwd: rootDir });
} catch (e) {
  console.error('Failed to run python zip script:', e);
  process.exit(1);
}

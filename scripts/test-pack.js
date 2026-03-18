#!/usr/bin/env node
/**
 * Installs the packed tarball (backend-ai-starter-recipes-*.tgz) into a temp dir,
 * runs npx bare --help and npx bare --preset nestjs-prisma --output ./out,
 * and verifies output. Use after: npm run build && npm pack.
 */
import { readdirSync, mkdtempSync, existsSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const tgzFiles = readdirSync(repoRoot).filter(
  (f) => f.startsWith('backend-ai-starter-recipes-') && f.endsWith('.tgz')
);
if (tgzFiles.length === 0) {
  console.error('No backend-ai-starter-recipes-*.tgz found. Run: npm run build && npm pack');
  process.exit(1);
}
const tarballPath = path.join(repoRoot, tgzFiles[0]);

const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'bare-pack-'));
try {
  execSync('npm init -y', { cwd: tmpDir, stdio: 'pipe' });
  execSync(`npm install "${tarballPath}"`, { cwd: tmpDir, stdio: 'inherit' });
  execSync('npx bare --help', { cwd: tmpDir, stdio: 'inherit' });
  execSync('npx bare --preset nestjs-prisma --output ./out', {
    cwd: tmpDir,
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
  });
  const agentPath = path.join(tmpDir, 'out', '.ai', 'AGENT.md');
  if (!existsSync(agentPath)) {
    console.error('Expected out/.ai/AGENT.md not found after preset run');
    process.exit(1);
  }
  console.log('test:pack passed.');
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { FileWriter } from '../src/writer.js';
import { generateCursor } from '../src/adapters/cursor.js';
import { generateClaudeCode } from '../src/adapters/claude-code.js';
import { generateVsCodeCopilot } from '../src/adapters/vscode-copilot.js';
import { generateAntigravity } from '../src/adapters/antigravity.js';
import { generateWindsurf } from '../src/adapters/windsurf.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureAi = path.join(root, 'test', 'fixtures', 'minimal-ai', '.ai');

async function seedMinimalAi(targetDir: string) {
  await fs.cp(fixtureAi, path.join(targetDir, '.ai'), { recursive: true });
}

describe('IDE adapters', () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-adapters-'));
    await seedMinimalAi(tmp);
  });

  it('generateCursor writes .mdc rules with frontmatter', async () => {
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const index = await fs.readFile(path.join(tmp, '.cursor/rules/index.mdc'), 'utf-8');
    expect(index).toMatch(/alwaysApply:\s*true/);
    expect(index).toMatch(/description:\s*Master Instructions/);
    expect(index).toMatch(/Test Agent/);
    const dataLayer = await fs.readFile(
      path.join(tmp, '.cursor/rules/data-layer.mdc'),
      'utf-8',
    );
    expect(dataLayer).toMatch(/globs:/);
    expect(dataLayer).toMatch(/prisma/);
    const testing = await fs.readFile(path.join(tmp, '.cursor/rules/testing.mdc'), 'utf-8');
    expect(testing).toMatch(/\.spec\.ts/);
  });

  it('generateClaudeCode writes CLAUDE.md', async () => {
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    const claude = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claude).toMatch(/Test Agent/);
    expect(claude).toMatch(/Architecture rule/);
  });

  it('generateVsCodeCopilot writes copilot-instructions.md', async () => {
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    const copilot = await fs.readFile(
      path.join(tmp, '.github/copilot-instructions.md'),
      'utf-8',
    );
    expect(copilot).toMatch(/Test Agent/);
  });

  it('generateWindsurf writes .windsurfrules', async () => {
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    const rules = await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8');
    expect(rules).toMatch(/Test Agent/);
  });

  it('generateAntigravity writes workflow from SKILL.md', async () => {
    const writer = new FileWriter(tmp);
    await generateAntigravity(tmp, writer);
    const wf = await fs.readFile(path.join(tmp, '.agents/workflows/plan-review.md'), 'utf-8');
    expect(wf).toMatch(/Plan review skill/);
  });
});

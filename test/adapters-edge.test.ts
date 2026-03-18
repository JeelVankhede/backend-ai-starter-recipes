import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { FileWriter } from '../src/writer.js';
import { generateCursor } from '../src/adapters/cursor.js';
import { generateClaudeCode } from '../src/adapters/claude-code.js';
import { generateVsCodeCopilot } from '../src/adapters/vscode-copilot.js';
import { generateWindsurf } from '../src/adapters/windsurf.js';
import { generateAntigravity } from '../src/adapters/antigravity.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('adapter error and branch paths', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generateCursor logs error when .ai is missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-cur-err-'));
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateClaudeCode logs error when AGENT.md missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-claude-err-'));
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateVsCodeCopilot logs error when .ai missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-copilot-err-'));
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateWindsurf logs error when .ai missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-wind-err-'));
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateVsCodeCopilot succeeds with AGENT only (no rules dir)', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-copilot-agent-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# Agent only');
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    const md = await fs.readFile(path.join(tmp, '.github', 'copilot-instructions.md'), 'utf-8');
    expect(md).toMatch(/Agent only/);
  });

  it('generateWindsurf succeeds with AGENT only', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-wind-agent-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# W');
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8')).toMatch(/W/);
  });

  it('generateClaudeCode with agent only + skills as file (inner catch)', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-claude-sk-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'skills'), 'not-a-dir');
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    const claude = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claude).toMatch(/A/);
  });

  it('generateCursor skips non-directory entries in skills', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-cur-skip-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'x.md'), '# R');
    await fs.mkdir(path.join(tmp, '.ai', 'skills'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'not-folder'), 'x');
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 'plan-review'), { recursive: true });
    await fs.writeFile(
      path.join(tmp, '.ai', 'skills', 'plan-review', 'SKILL.md'),
      '# S',
    );
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.cursor/skills/plan-review/SKILL.md'), 'utf-8')).toMatch(
      /S/,
    );
  });

  it('generateCursor api-patterns and external-integrations globs', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-cur-glob-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'api-patterns.md'), '# API');
    await fs.writeFile(
      path.join(tmp, '.ai', 'rules', 'external-integrations.md'),
      '# Ext',
    );
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const api = await fs.readFile(path.join(tmp, '.cursor/rules/api-patterns.mdc'), 'utf-8');
    expect(api).toMatch(/\.controller\.ts/);
    const ext = await fs.readFile(
      path.join(tmp, '.cursor/rules/external-integrations.mdc'),
      'utf-8',
    );
    expect(ext).toMatch(/src\/external/);
  });

  it('generateAntigravity skips non-directories and dirs without SKILL.md', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-anti-'));
    await fs.mkdir(path.join(tmp, '.ai', 'skills'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'readme.txt'), 'x');
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 'empty-skill'), { recursive: true });
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 'ok-skill'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'ok-skill', 'SKILL.md'), '# OK');
    const writer = new FileWriter(tmp);
    await generateAntigravity(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.agents/workflows/ok-skill.md'), 'utf-8')).toMatch(
      /OK/,
    );
    const names = await fs.readdir(path.join(tmp, '.agents/workflows'));
    expect(names).toEqual(['ok-skill.md']);
  });

  it('generateAntigravity no-op when skills dir missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-anti-miss-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    const writer = new FileWriter(tmp);
    await generateAntigravity(tmp, writer);
    await expect(fs.access(path.join(tmp, '.agents'))).rejects.toThrow();
  });

  it('generateCursor skips non-.md files in rules', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-cur-md-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'only.txt'), 'x');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'keep.md'), '# K');
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const keep = await fs.readFile(path.join(tmp, '.cursor/rules/keep.mdc'), 'utf-8');
    expect(keep).toMatch(/K/);
  });

  it('generateClaudeCode merges rules and copies skill files', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-claude-full-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# Agent');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'skip.bin'), '');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'rule.md'), '# Rule body');
    await fs.mkdir(path.join(tmp, '.ai', 'skills'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'not-a-folder'), 'skip');
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 's1'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 's1', 'SKILL.md'), '# S');
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 's1', 'extra.md'), '# E');
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    const claude = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claude).toMatch(/Agent/);
    expect(claude).toMatch(/Rule body/);
    expect(await fs.readFile(path.join(tmp, '.claude/skills/s1/SKILL.md'), 'utf-8')).toMatch(/S/);
    expect(await fs.readFile(path.join(tmp, '.claude/skills/s1/extra.md'), 'utf-8')).toMatch(/E/);
  });

  it('generateVsCodeCopilot skips non-.md in rules', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-vsc-skip-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'x.txt'), 'nope');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'r.md'), '# R');
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.github/copilot-instructions.md'), 'utf-8')).toMatch(
      /R/,
    );
  });

  it('generateWindsurf skips non-.md in rules', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-ws-skip-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'bad.exe'), '');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'good.md'), '# G');
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8')).toMatch(/G/);
  });
});

import { describe, it, expect } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { FileWriter } from './writer.js';

describe('FileWriter', () => {
  it('creates nested file with trimmed body and trailing newline', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-writer-'));
    const writer = new FileWriter(tmp);
    await writer.write('nested/deep/file.md', '  hello world  ');
    const full = path.join(tmp, 'nested/deep/file.md');
    const content = await fs.readFile(full, 'utf-8');
    expect(content).toBe('hello world\n');
  });

  it('ensureCleanOutputDir removes directory', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-clean-'));
    await fs.mkdir(path.join(tmp, '.ai/rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai/rules/x.md'), 'x');
    const writer = new FileWriter(tmp);
    await writer.ensureCleanOutputDir('.ai');
    await expect(fs.access(path.join(tmp, '.ai'))).rejects.toThrow();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
  checkbox: vi.fn(),
}));

import { input, select, checkbox } from '@inquirer/prompts';
import { askQuestions } from './prompts.js';

function mockStandardSelectsAndInputs() {
  vi.mocked(input)
    .mockResolvedValueOnce('proj-x')
    .mockResolvedValueOnce('desc-x');
  vi.mocked(select)
    .mockResolvedValueOnce('nestjs')
    .mockResolvedValueOnce('typescript')
    .mockResolvedValueOnce('prisma')
    .mockResolvedValueOnce('postgresql')
    .mockResolvedValueOnce('zod')
    .mockResolvedValueOnce('swagger')
    .mockResolvedValueOnce('none')
    .mockResolvedValueOnce('jest')
    .mockResolvedValueOnce('github-actions');
}

describe('askQuestions', () => {
  beforeEach(() => {
    vi.mocked(input).mockReset();
    vi.mocked(select).mockReset();
    vi.mocked(checkbox).mockReset();
  });

  it('returns UserAnswers matching mocked selections', async () => {
    mockStandardSelectsAndInputs();
    vi.mocked(checkbox)
      .mockResolvedValueOnce(['sentry'])
      .mockResolvedValueOnce(['cursor'])
      .mockResolvedValueOnce(['plan-review']);
    const answers = await askQuestions();
    expect(answers.projectName).toBe('proj-x');
    expect(answers.ideTargets).toEqual(['cursor']);
    expect(answers.skills).toEqual(['plan-review']);
  });

  it('expands ideTargets when "all" is selected', async () => {
    mockStandardSelectsAndInputs();
    vi.mocked(checkbox)
      .mockResolvedValueOnce(['sentry'])
      .mockResolvedValueOnce(['all'])
      .mockResolvedValueOnce(['plan-review']);
    const answers = await askQuestions();
    expect(answers.ideTargets).toEqual([
      'cursor',
      'claude-code',
      'vscode-copilot',
      'antigravity',
      'windsurf',
    ]);
  });

  it('expands skills when "all" is selected', async () => {
    mockStandardSelectsAndInputs();
    vi.mocked(checkbox)
      .mockResolvedValueOnce(['sentry'])
      .mockResolvedValueOnce(['cursor'])
      .mockResolvedValueOnce(['all']);
    const answers = await askQuestions();
    expect(answers.skills).toEqual([
      'plan-review',
      'code-review',
      'qa',
      'ship',
      'document-release',
      'retro',
      'db-migration-review',
      'api-contract-check',
      'dependency-audit',
    ]);
  });
});

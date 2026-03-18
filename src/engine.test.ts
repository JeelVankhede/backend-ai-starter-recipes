import { describe, it, expect, beforeAll, vi } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { TemplateEngine } from './engine.js';
import type { TemplateContext } from './types.js';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function minimalContext(): TemplateContext {
  return {
    projectName: 't',
    projectDescription: 'd',
    framework: 'nestjs',
    language: 'typescript',
    orm: 'prisma',
    database: 'postgresql',
    validation: 'zod',
    apiDocs: 'swagger',
    auth: 'none',
    testFramework: 'jest',
    monitoring: [],
    cicd: 'github-actions',
    ideTargets: [],
    skills: [],
    ormServiceName: 'PrismaService',
    ormSchemaPath: 'prisma/schema.prisma',
    testCommand: 'npm test',
    buildCommand: 'npm run build',
    lintCommand: 'npm run lint',
    isNestJS: true,
    isExpress: false,
    isFastify: false,
    isHono: false,
    hasPrisma: true,
    hasTypeORM: false,
    hasDrizzle: false,
    hasMikroORM: false,
    hasKnex: false,
    hasSwagger: true,
    hasAuth: false,
    hasJest: true,
    hasVitest: false,
    hasMocha: false,
  };
}

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeAll(async () => {
    engine = new TemplateEngine(pkgRoot);
    await engine.initialize();
  });

  it('renders agent.hbs with non-empty output', async () => {
    const out = await engine.render('agent.hbs', minimalContext());
    expect(out.length).toBeGreaterThan(50);
    expect(out).toMatch(/AI|agent|NestJS|project/i);
  });

  it('renders data-layer.hbs when hasPrisma true vs false', async () => {
    const withPrisma = await engine.render('rules/data-layer.hbs', {
      ...minimalContext(),
      hasPrisma: true,
    });
    const without = await engine.render('rules/data-layer.hbs', {
      ...minimalContext(),
      hasPrisma: false,
      orm: 'none',
    });
    expect(withPrisma).not.toBe(without);
    expect(withPrisma.length).toBeGreaterThan(10);
  });

  it('registerHelpers: or, and, includes with null array', async () => {
    await engine.initialize();
    const t = Handlebars.compile(
      '{{or a b}}|{{and c d}}|{{and c d z}}|{{includes items "z"}}',
    );
    expect(
      t({ a: false, b: true, c: true, d: true, z: false, items: ['a'] }),
    ).toBe('true|true|false|false');
    expect(Handlebars.compile('{{includes items "a"}}')({ items: ['a', 'b'] })).toBe(
      'true',
    );
    expect(Handlebars.compile('{{includes arr "x"}}')({ arr: null })).toBe('');
    expect(
      Handlebars.compile('{{eq x y}}|{{neq x z}}')({ x: 1, y: 1, z: 2 }),
    ).toBe('true|true');
  });

  it('registerPartials warns when partials directory is missing', async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-eng-'));
    await fs.mkdir(path.join(base, 'templates'), { recursive: true });
    await fs.writeFile(path.join(base, 'templates', 'x.hbs'), 'ok');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const eng = new TemplateEngine(base);
    await eng.initialize();
    expect(warn).toHaveBeenCalledWith('Could not load partials:', expect.anything());
    warn.mockRestore();
    const out = await eng.render('x.hbs', minimalContext());
    expect(out).toBe('ok');
  });

  it('registerPartials ignores non-.hbs files in partials dir', async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), 'bare-eng-part-'));
    const partials = path.join(base, 'templates', 'partials');
    await fs.mkdir(partials, { recursive: true });
    await fs.writeFile(path.join(partials, 'note.txt'), 'skip');
    await fs.writeFile(path.join(partials, 'useful.hbs'), 'partial-body');
    await fs.mkdir(path.join(base, 'templates'), { recursive: true });
    await fs.writeFile(
      path.join(base, 'templates', 't.hbs'),
      '{{> useful}}',
    );
    const eng = new TemplateEngine(base);
    await eng.initialize();
    const out = await eng.render('t.hbs', minimalContext());
    expect(out).toContain('partial-body');
  });
});

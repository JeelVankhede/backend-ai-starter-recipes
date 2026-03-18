import { describe, it, expect } from 'vitest';
import { buildContext } from './context-builder.js';
import type { UserAnswers } from './types.js';

function baseAnswers(overrides: Partial<UserAnswers> = {}): UserAnswers {
  return {
    projectName: 'my-app',
    projectDescription: 'A backend',
    framework: 'nestjs',
    language: 'typescript',
    orm: 'prisma',
    database: 'postgresql',
    validation: 'class-validator',
    apiDocs: 'swagger',
    auth: 'jwt-passport',
    testFramework: 'jest',
    monitoring: ['sentry'],
    cicd: 'github-actions',
    ideTargets: ['cursor'],
    skills: ['plan-review'],
    ...overrides,
  };
}

describe('buildContext', () => {
  it('happy path: NestJS + Prisma + jest + swagger', () => {
    const ctx = buildContext(baseAnswers());
    expect(ctx.ormServiceName).toBe('PrismaService');
    expect(ctx.ormSchemaPath).toBe('prisma/schema.prisma');
    expect(ctx.buildCommand).toBe('npm run build');
    expect(ctx.testCommand).toBe('npm run test');
    expect(ctx.hasPrisma).toBe(true);
    expect(ctx.hasSwagger).toBe(true);
    expect(ctx.hasAuth).toBe(true);
    expect(ctx.hasJest).toBe(true);
    expect(ctx.isNestJS).toBe(true);
  });

  const ormCases: [UserAnswers['orm'], string, string][] = [
    ['prisma', 'PrismaService', 'prisma/schema.prisma'],
    ['typeorm', 'DataSource', 'src/entities/'],
    ['drizzle', 'db', 'src/db/schema.ts'],
    ['mikro-orm', 'EntityManager', 'src/entities/'],
    ['knex', 'knex', 'src/db/migrations/'],
  ];

  it.each(ormCases)('ORM %s maps service and path', (orm, service, schemaPath) => {
    const ctx = buildContext(baseAnswers({ orm }));
    expect(ctx.ormServiceName).toBe(service);
    expect(ctx.ormSchemaPath).toBe(schemaPath);
    expect(ctx.hasPrisma).toBe(orm === 'prisma');
    expect(ctx.hasTypeORM).toBe(orm === 'typeorm');
    expect(ctx.hasDrizzle).toBe(orm === 'drizzle');
    expect(ctx.hasMikroORM).toBe(orm === 'mikro-orm');
    expect(ctx.hasKnex).toBe(orm === 'knex');
  });

  it('ORM none', () => {
    const ctx = buildContext(baseAnswers({ orm: 'none' }));
    expect(ctx.ormServiceName).toBe('Database');
    expect(ctx.ormSchemaPath).toBe('');
    expect(ctx.hasPrisma).toBe(false);
    expect(ctx.hasKnex).toBe(false);
  });

  it('framework nestjs vs express buildCommand', () => {
    expect(buildContext(baseAnswers({ framework: 'nestjs' })).buildCommand).toBe(
      'npm run build',
    );
    expect(buildContext(baseAnswers({ framework: 'express' })).buildCommand).toBe(
      'tsc --noEmit',
    );
    expect(buildContext(baseAnswers({ framework: 'fastify' })).buildCommand).toBe(
      'tsc --noEmit',
    );
  });

  it('test framework commands and flags', () => {
    expect(buildContext(baseAnswers({ testFramework: 'jest' })).testCommand).toBe(
      'npm run test',
    );
    expect(buildContext(baseAnswers({ testFramework: 'jest' })).hasJest).toBe(true);

    const vitestCtx = buildContext(baseAnswers({ testFramework: 'vitest' }));
    expect(vitestCtx.testCommand).toBe('npx vitest run');
    expect(vitestCtx.hasVitest).toBe(true);

    const mochaCtx = buildContext(baseAnswers({ testFramework: 'mocha' }));
    expect(mochaCtx.testCommand).toBe('npx mocha');
    expect(mochaCtx.hasMocha).toBe(true);
  });

  it('hasSwagger and hasAuth', () => {
    expect(buildContext(baseAnswers({ apiDocs: 'none' })).hasSwagger).toBe(false);
    expect(buildContext(baseAnswers({ auth: 'none' })).hasAuth).toBe(false);
    expect(buildContext(baseAnswers({ auth: 'custom' })).hasAuth).toBe(true);
  });
});

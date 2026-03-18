/**
 * Maps interactive or preset {@link UserAnswers} into {@link TemplateContext}
 * (ORM names, commands, framework/feature booleans).
 * @module context-builder
 */
import { UserAnswers, TemplateContext } from './types.js';

/**
 * Builds the Handlebars context used by all templates.
 * @param answers - Raw answers from prompts or preset JSON
 * @returns Context with derived fields for conditional template blocks
 */
export function buildContext(answers: UserAnswers): TemplateContext {
  let ormServiceName = 'Database';
  let ormSchemaPath = '';

  if (answers.orm === 'prisma') {
    ormServiceName = 'PrismaService';
    ormSchemaPath = 'prisma/schema.prisma';
  } else if (answers.orm === 'typeorm') {
    ormServiceName = 'DataSource';
    ormSchemaPath = 'src/entities/';
  } else if (answers.orm === 'drizzle') {
    ormServiceName = 'db';
    ormSchemaPath = 'src/db/schema.ts';
  } else if (answers.orm === 'mikro-orm') {
    ormServiceName = 'EntityManager';
    ormSchemaPath = 'src/entities/';
  } else if (answers.orm === 'knex') {
    ormServiceName = 'knex';
    ormSchemaPath = 'src/db/migrations/';
  }

  let compileCmd = answers.framework === 'nestjs' ? 'npm run build' : 'tsc --noEmit';
  let lintCmd = 'npm run lint';

  let testCmd = 'npm run test';
  if (answers.testFramework === 'vitest') testCmd = 'npx vitest run';
  if (answers.testFramework === 'mocha') testCmd = 'npx mocha';

  return {
    ...answers,

    ormServiceName,
    ormSchemaPath,
    testCommand: testCmd,
    buildCommand: compileCmd,
    lintCommand: lintCmd,

    isNestJS: answers.framework === 'nestjs',
    isExpress: answers.framework === 'express',
    isFastify: answers.framework === 'fastify',
    isHono: answers.framework === 'hono',

    hasPrisma: answers.orm === 'prisma',
    hasTypeORM: answers.orm === 'typeorm',
    hasDrizzle: answers.orm === 'drizzle',
    hasMikroORM: answers.orm === 'mikro-orm',
    hasKnex: answers.orm === 'knex',

    hasSwagger: answers.apiDocs === 'swagger',
    hasAuth: answers.auth !== 'none',

    hasJest: answers.testFramework === 'jest',
    hasVitest: answers.testFramework === 'vitest',
    hasMocha: answers.testFramework === 'mocha',
  };
}

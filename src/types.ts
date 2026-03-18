/**
 * Shared types for CLI answers, presets, and Handlebars context.
 * @module types
 */

/** Answers from interactive prompts or a JSON preset file. */
export interface UserAnswers {
  projectName: string;
  projectDescription: string;
  framework: 'nestjs' | 'express' | 'fastify' | 'hono';
  language: 'typescript' | 'javascript';
  orm: 'prisma' | 'typeorm' | 'drizzle' | 'mikro-orm' | 'knex' | 'none';
  database: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
  validation: 'class-validator' | 'zod' | 'joi' | 'none';
  apiDocs: 'swagger' | 'none';
  auth: 'jwt-passport' | 'session' | 'oauth2-provider' | 'custom' | 'none';
  testFramework: 'jest' | 'vitest' | 'mocha';
  monitoring: string[];
  cicd: 'github-actions' | 'gitlab-ci' | 'none';
  ideTargets: string[];
  skills: string[];
}

/** {@link UserAnswers} plus derived strings and booleans for templates. */
export interface TemplateContext extends UserAnswers {
  ormServiceName: string;
  ormSchemaPath: string;
  testCommand: string;
  buildCommand: string;
  lintCommand: string;

  isNestJS: boolean;
  isExpress: boolean;
  isFastify: boolean;
  isHono: boolean;

  hasPrisma: boolean;
  hasTypeORM: boolean;
  hasDrizzle: boolean;
  hasMikroORM: boolean;
  hasKnex: boolean;
  hasSwagger: boolean;
  hasAuth: boolean;
  hasJest: boolean;
  hasVitest: boolean;
  hasMocha: boolean;
}

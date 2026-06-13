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

/**
 * In-memory render output that adapters consume. Replaces the v1.1 `.ai/` intermediate tree.
 * `rules` keys are rule basenames (e.g. `architecture-api`, `data-layer-migrations`).
 * `lifecycle` keys are stage names (e.g. `think`, `plan`, ..., `reflect`).
 */
export interface RenderedContext {
  agent: string;
  rules: Record<string, string>;
  lifecycle: Record<string, string>;
}

/** Outcome of a single `FileWriter.write()` call. WP-B always emits `created`; WP-C adds the other statuses. */
export type WriteStatus = 'created' | 'backed-up' | 'skipped' | 'overwritten';

export interface WriteResult {
  path: string;
  status: WriteStatus;
}

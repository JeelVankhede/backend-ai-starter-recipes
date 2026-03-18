/**
 * Interactive Inquirer flow producing {@link UserAnswers} when no `--preset` is used.
 * @module prompts
 */
import { input, select, checkbox } from '@inquirer/prompts';
import { UserAnswers } from './types.js';

/**
 * Runs the full stack/IDE/skills questionnaire.
 * @returns Structured answers for {@link buildContext}
 */
export async function askQuestions(): Promise<UserAnswers> {
  const projectName = await input({
    message: 'Project name:',
    default: 'my-backend',
  });

  const projectDescription = await input({
    message: 'Brief project description:',
    default: 'A backend service',
  });

  const framework = await select({
    message: 'Backend framework:',
    choices: [
      { name: 'NestJS (recommended)', value: 'nestjs' },
      { name: 'Express', value: 'express' },
      { name: 'Fastify', value: 'fastify' },
      { name: 'Hono', value: 'hono' },
    ],
  });

  const language = await select({
    message: 'Language:',
    choices: [
      { name: 'TypeScript (recommended)', value: 'typescript' },
      { name: 'JavaScript', value: 'javascript' },
    ],
  });

  const orm = await select({
    message: 'ORM / Query Builder:',
    choices: [
      { name: 'Prisma', value: 'prisma' },
      { name: 'TypeORM', value: 'typeorm' },
      { name: 'Drizzle', value: 'drizzle' },
      { name: 'MikroORM', value: 'mikro-orm' },
      { name: 'Knex', value: 'knex' },
      { name: 'None (raw SQL)', value: 'none' },
    ],
  });

  const database = await select({
    message: 'Database:',
    choices: [
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'MySQL', value: 'mysql' },
      { name: 'MongoDB', value: 'mongodb' },
      { name: 'SQLite', value: 'sqlite' },
    ],
  });

  const validation = await select({
    message: 'Validation library:',
    choices: [
      { name: 'class-validator + class-transformer (recommended for NestJS)', value: 'class-validator' },
      { name: 'Zod', value: 'zod' },
      { name: 'Joi', value: 'joi' },
      { name: 'None', value: 'none' },
    ],
  });

  const apiDocs = await select({
    message: 'API documentation:',
    choices: [
      { name: 'Swagger / OpenAPI', value: 'swagger' },
      { name: 'None', value: 'none' },
    ],
  });

  const auth = await select({
    message: 'Authentication approach:',
    choices: [
      { name: 'JWT (Passport)', value: 'jwt-passport' },
      { name: 'Session-based', value: 'session' },
      { name: 'OAuth2 provider (Auth0/Clerk/Privy)', value: 'oauth2-provider' },
      { name: 'Custom', value: 'custom' },
      { name: 'None (public API)', value: 'none' },
    ],
  });

  const testFramework = await select({
    message: 'Testing framework:',
    choices: [
      { name: 'Jest', value: 'jest' },
      { name: 'Vitest', value: 'vitest' },
      { name: 'Mocha', value: 'mocha' },
    ],
  });

  const monitoring = await checkbox({
    message: 'Monitoring/Observability (select all that apply):',
    choices: [
      { name: 'Sentry (error tracking)', value: 'sentry', checked: true },
      { name: 'New Relic / Datadog (APM)', value: 'apm' },
      { name: 'Prometheus + Grafana', value: 'prometheus' },
    ],
  });

  const cicd = await select({
    message: 'CI/CD approach:',
    choices: [
      { name: 'GitHub Actions', value: 'github-actions' },
      { name: 'GitLab CI', value: 'gitlab-ci' },
      { name: 'None', value: 'none' },
    ],
  });

  let ideTargets = await checkbox({
    message: 'Generate instructions for which IDEs? (select all that apply)',
    choices: [
      { name: 'All IDEs (Cursor, Claude Code, Copilot, Antigravity, Windsurf)', value: 'all' },
      { name: 'Cursor (.cursor/rules/)', value: 'cursor' },
      { name: 'Claude Code (CLAUDE.md)', value: 'claude-code' },
      { name: 'VS Code Copilot (.github/copilot-instructions.md)', value: 'vscode-copilot' },
      { name: 'Antigravity (.agents/workflows/)', value: 'antigravity' },
      { name: 'Windsurf (.windsurfrules)', value: 'windsurf' },
    ],
  });

  if (ideTargets.includes('all')) {
    ideTargets = ['cursor', 'claude-code', 'vscode-copilot', 'antigravity', 'windsurf'];
  }

  let skills = await checkbox({
    message: 'Which AI skills/workflows to include?',
    choices: [
      { name: 'All Skills', value: 'all' },
      { name: 'plan-review (Architecture review before implementation)', value: 'plan-review', checked: true },
      { name: 'code-review (Pre-landing diff review with checklist)', value: 'code-review', checked: true },
      { name: 'qa (Systematic API quality testing)', value: 'qa', checked: true },
      { name: 'ship (Automated ship workflow)', value: 'ship', checked: true },
      { name: 'document-release (Auto-update docs after shipping)', value: 'document-release' },
      { name: 'retro (Developer productivity retrospective)', value: 'retro' },
      { name: 'db-migration-review (Specialized migration safety review)', value: 'db-migration-review' },
      { name: 'api-contract-check (Detects breaking changes in API contracts)', value: 'api-contract-check' },
      { name: 'dependency-audit (Reviews dependencies for security/size)', value: 'dependency-audit' },
    ],
  });

  if (skills.includes('all')) {
    skills = [
      'plan-review',
      'code-review',
      'qa',
      'ship',
      'document-release',
      'retro',
      'db-migration-review',
      'api-contract-check',
      'dependency-audit',
    ];
  }

  return {
    projectName,
    projectDescription,
    framework,
    language,
    orm,
    database,
    validation,
    apiDocs,
    auth,
    testFramework,
    monitoring,
    cicd,
    ideTargets,
    skills,
  } as UserAnswers;
}

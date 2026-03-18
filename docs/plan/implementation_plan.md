# Implementation Plan: `backend-ai-starter-recipes`

An interactive Node.js CLI tool that generates customized AI agent instructions for backend projects.

## Background

We're building a CLI that asks developers about their tech stack (framework, ORM, auth, testing, etc.) and generates a fully customized `.ai/` directory with rules, skills, context templates, and IDE-specific adapter files. This replaces the static template approach with dynamic Handlebars-powered generation.

---

## Proposed Changes

### CLI & Core Engine

#### [NEW] [package.json](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/package.json)
- Name: `backend-ai-starter-recipes`
- `bin` field pointing to compiled CLI entry
- Dependencies: `handlebars`, `@inquirer/prompts`, `commander`, `chalk`
- Dev deps: `typescript`, `tsup`, `@types/node`
- Scripts: `build`, `dev`, `start`

#### [NEW] [tsconfig.json](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/tsconfig.json)
- ES2022 target, NodeNext module resolution, strict mode

#### [NEW] [tsup.config.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/tsup.config.ts)
- Entry: `src/cli.ts`, format: ESM, bundle dependencies

#### [NEW] [src/cli.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/cli.ts)
- Commander.js setup with `--output`, `--preset`, `--dry-run` flags
- Calls prompts → generator → adapters pipeline

#### [NEW] [src/prompts.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/prompts.ts)
- 9 prompt groups using `@inquirer/prompts` (input, select, checkbox)
- Groups: project identity, framework, data layer, API/validation, auth, testing, monitoring/CI, IDE targets, skills
- Returns fully typed `UserAnswers` object

#### [NEW] [src/types.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/types.ts)

```typescript
interface UserAnswers {
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

interface TemplateContext extends UserAnswers {
  // Derived values
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
  hasSwagger: boolean;
  hasAuth: boolean;
  hasJest: boolean;
  hasVitest: boolean;
}
```

#### [NEW] [src/context-builder.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/context-builder.ts)
- Transforms `UserAnswers` → `TemplateContext` with all derived boolean/string values

#### [NEW] [src/engine.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/engine.ts)
- Loads Handlebars templates from `templates/` directory
- Registers partials from `templates/partials/`
- Registers helpers: `eq`, `neq`, `includes`, `or`, `and`
- Renders each template with the context
- Writes output to target directory

#### [NEW] [src/writer.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/writer.ts)
- Creates directory structure
- Writes rendered files
- Reports summary with chalk (files created, total size)

---

### Handlebars Templates — Rules (10 files)

All templates live in `templates/` and use `{{#if}}` blocks for framework/ORM/library conditionals.

#### [NEW] [templates/agent.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/agent.hbs)
- Master instruction file → `.ai/AGENT.md`
- Covers: general principles, plan-first approach, coding standards, interaction framework, scope challenge, priority hierarchy
- Conditional sections for framework-specific DI patterns, naming conventions

#### [NEW] [templates/rules/architecture.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/architecture.hbs)
- Module/component structure per framework (NestJS modules, Express routers, Fastify plugins, Hono groups)
- DI conventions, folder layout, health checks, graceful shutdown
- Uses `repositoryPattern` partial

#### [NEW] [templates/rules/data-layer.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/data-layer.hbs)
- ORM-specific: schema/entity definitions, migration commands, client generation
- Universal: repository pattern, atomic migrations, soft deletes, transactions, seeding
- Uses `migrationCommands` and `repositoryPattern` partials

#### [NEW] [templates/rules/api-patterns.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/api-patterns.hbs)
- Validation library patterns (class-validator, zod, joi)
- Swagger/OpenAPI if enabled
- Pagination (cursor vs offset), rate limiting, CORS, API versioning strategy

#### [NEW] [templates/rules/errors-logging-security.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/errors-logging-security.hbs)
- Framework-specific error handling (NestJS exceptions, Express middleware, Fastify handler, Hono onError)
- Logging patterns, no PII, correlation IDs
- Input sanitization, auth best practices

#### [NEW] [templates/rules/external-integrations.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/external-integrations.hbs)
- Service wrapper pattern per framework
- try/catch → framework exception mapping
- File upload/storage patterns, email/notification patterns

#### [NEW] [templates/rules/testing.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/testing.hbs)
- Test framework specifics (Jest TestBed for NestJS, vitest setup, mocha)
- Unit + e2e patterns, mocking conventions, test fixtures
- Uses `testCommands` partial

#### [NEW] [templates/rules/pre-commit.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/pre-commit.hbs)
- Quality gates (build, lint, test commands)
- Fix-first heuristic, suppressions list
- Uses `testCommands`, `buildCommands`, `migrationCommands` partials

#### [NEW] [templates/rules/async-patterns.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/async-patterns.hbs)
- Queue/background job patterns (BullMQ for NestJS, Bull for Express, etc.)
- Cron/scheduled task conventions
- Event-driven architecture, retry/DLQ patterns, idempotency

#### [NEW] [templates/rules/environment.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/environment.hbs)
- `.env` conventions, config patterns per framework
- Docker/containerization best practices (multi-stage builds, .dockerignore)
- Feature flags, dev/staging/prod separation

#### [NEW] [templates/rules/git-conventions.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/rules/git-conventions.hbs)
- Conventional commits format
- Branch naming conventions
- PR template structure

---

### Handlebars Templates — Skills (10 files)

#### [NEW] [templates/skills/plan-review.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/plan-review.hbs)
- Scope challenge → architecture review → data layer → API design → tests
- Framework-specific review checklist items
- Interactive question format with lettered options

#### [NEW] [templates/skills/code-review-skill.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/code-review-skill.hbs)
- Two-pass diff review (critical + informational)
- References the checklist file
- Read-only by default, fix-on-request

#### [NEW] [templates/skills/code-review-checklist.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/code-review-checklist.hbs)
- Framework-specific critical checks (auth guards, error handling)
- ORM-specific data layer checks (migrations, repository pattern)
- Suppressions list
- Uses `gitRules` partial

#### [NEW] [templates/skills/qa.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/qa.hbs)
- Modes: full, quick, targeted
- Static analysis (build + lint + test commands from context)
- Endpoint/route review per framework
- Health score calculation
- Uses `testCommands`, `buildCommands` partials

#### [NEW] [templates/skills/ship.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/ship.hbs)
- Pre-flight → merge main → quality checks → review → commit → push → PR
- Framework-specific build/test commands
- Uses `testCommands`, `buildCommands`, `gitRules` partials

#### [NEW] [templates/skills/document-release.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/document-release.hbs)
- Reads all doc files, cross-references diff
- Updates README, CHANGELOG, API docs
- Uses `gitRules` partial

#### [NEW] [templates/skills/retro.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/retro.hbs)
- Git stats analysis (commits, LOC, files changed)
- Test health trends
- Shipping velocity metrics

#### [NEW] [templates/skills/db-migration-review.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/db-migration-review.hbs)
- Specialized migration safety review
- Destructive change detection, data backfill checks, rollback plan
- ORM-specific migration file analysis

#### [NEW] [templates/skills/api-contract-check.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/api-contract-check.hbs)
- Detects breaking changes in API contracts
- Validates request/response shape changes
- Framework-specific route/controller analysis

#### [NEW] [templates/skills/dependency-audit.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/skills/dependency-audit.hbs)
- Reviews `package.json` diff for new/updated deps
- Security (known vulnerabilities), license compliance, bundle size impact
- Flags unnecessary or duplicate dependencies

---

### Handlebars Templates — Partials (5 files)

#### [NEW] [templates/partials/migrationCommands.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/partials/migrationCommands.hbs)
- ORM-specific migration create/run/revert commands

#### [NEW] [templates/partials/repositoryPattern.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/partials/repositoryPattern.hbs)
- Repository layer rules with `{{ormServiceName}}` 

#### [NEW] [templates/partials/testCommands.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/partials/testCommands.hbs)
- Test framework-specific run/watch/coverage commands

#### [NEW] [templates/partials/buildCommands.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/partials/buildCommands.hbs)
- Framework-specific build/compile commands

#### [NEW] [templates/partials/gitRules.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/partials/gitRules.hbs)
- Branch check, diff commands, merge conventions

---

### Handlebars Templates — Context & Tracking (3 files)

#### [NEW] [templates/context/domain-map.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/context/domain-map.hbs)
- Architecture skeleton per framework (user fills in specifics)
- Key files table template, patterns table, common pitfalls

#### [NEW] [templates/context/tech-stack.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/context/tech-stack.hbs)
- Pre-filled with all user choices (framework, ORM, DB, validation, auth, testing, monitoring)

#### [NEW] [templates/tracking/efficiency.hbs](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/templates/tracking/efficiency.hbs)
- Acceptance rate, iteration count, rejection reasons table
- Skill usage tracking table with all selected skills
- Refinement process guide

---

### IDE Adapters (5 files)

#### [NEW] [src/adapters/cursor.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/adapters/cursor.ts)
Transformation rules:

| Source | Output | Transform |
|--------|--------|-----------|
| `.ai/AGENT.md` | `.cursor/rules/index.mdc` | Add `alwaysApply: true` frontmatter |
| `.ai/rules/architecture.md` | `.cursor/rules/architecture.mdc` | Add `alwaysApply: true` |
| `.ai/rules/data-layer.md` | `.cursor/rules/data-layer.mdc` | Add `globs` for ORM files |
| `.ai/rules/api-patterns.md` | `.cursor/rules/api-patterns.mdc` | Add `globs: **/*.dto.ts,**/*.controller.ts` |
| `.ai/rules/testing.md` | `.cursor/rules/testing.mdc` | Add `globs: **/*.spec.ts,**/*.e2e-spec.ts` |
| `.ai/rules/external-integrations.md` | `.cursor/rules/external-integrations.mdc` | Add `globs: src/external/**/*.ts` |
| Other rules | → `.mdc` | Add `alwaysApply: true` |
| `.ai/skills/*/SKILL.md` | `.cursor/skills/*/SKILL.md` | Copy as-is |
| `.ai/context/*` | `.cursor/context/*` | Copy as-is |

#### [NEW] [src/adapters/claude-code.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/adapters/claude-code.ts)
- Merge `AGENT.md` + all rules into single `CLAUDE.md` with `##` section headers
- Copy skills to `.claude/skills/`

#### [NEW] [src/adapters/vscode-copilot.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/adapters/vscode-copilot.ts)
- Merge all content into `.github/copilot-instructions.md`

#### [NEW] [src/adapters/antigravity.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/adapters/antigravity.ts)
- Convert skills to `.agents/workflows/*.md` with `description` frontmatter

#### [NEW] [src/adapters/windsurf.ts](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/src/adapters/windsurf.ts)
- Merge all content into `.windsurfrules`

---

### Presets & Meta

#### [NEW] [presets/nestjs-prisma.json](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/presets/nestjs-prisma.json)
#### [NEW] [presets/nestjs-typeorm.json](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/presets/nestjs-typeorm.json)
#### [NEW] [presets/express-prisma.json](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/presets/express-prisma.json)
#### [NEW] [presets/fastify-drizzle.json](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/presets/fastify-drizzle.json)
- Pre-filled answer sets for common stacks, skip interactive prompts

#### [NEW] [README.md](file:///Users/jeel-rikoouu/Work/Misc/backend-ai-template/README.md)
- Project overview, quick start, usage examples, preset list, supported IDEs

---

## Complete Source File Manifest

| # | Path | Type | Purpose |
|---|------|------|---------|
| **CLI Core (8 files)** |
| 1 | `package.json` | Config | Dependencies, scripts, bin |
| 2 | `tsconfig.json` | Config | TypeScript config |
| 3 | `tsup.config.ts` | Config | Build config |
| 4 | `src/cli.ts` | Source | CLI entry point |
| 5 | `src/prompts.ts` | Source | Interactive prompts |
| 6 | `src/types.ts` | Source | TypeScript types |
| 7 | `src/context-builder.ts` | Source | Answers → Context |
| 8 | `src/engine.ts` | Source | Handlebars render engine |
| 9 | `src/writer.ts` | Source | File output |
| **IDE Adapters (5 files)** |
| 10 | `src/adapters/cursor.ts` | Source | → `.cursor/` |
| 11 | `src/adapters/claude-code.ts` | Source | → `CLAUDE.md` |
| 12 | `src/adapters/vscode-copilot.ts` | Source | → `.github/` |
| 13 | `src/adapters/antigravity.ts` | Source | → `.agents/` |
| 14 | `src/adapters/windsurf.ts` | Source | → `.windsurfrules` |
| **Templates — Rules (11 files)** |
| 15 | `templates/agent.hbs` | Template | AGENT.md |
| 16 | `templates/rules/architecture.hbs` | Template | Module structure |
| 17 | `templates/rules/data-layer.hbs` | Template | ORM patterns |
| 18 | `templates/rules/api-patterns.hbs` | Template | Validation, pagination |
| 19 | `templates/rules/errors-logging-security.hbs` | Template | Error/log/security |
| 20 | `templates/rules/external-integrations.hbs` | Template | 3rd party wrappers |
| 21 | `templates/rules/testing.hbs` | Template | Test conventions |
| 22 | `templates/rules/pre-commit.hbs` | Template | Quality gates |
| 23 | `templates/rules/async-patterns.hbs` | Template | Queues, cron, events |
| 24 | `templates/rules/environment.hbs` | Template | Env, Docker, flags |
| 25 | `templates/rules/git-conventions.hbs` | Template | Commits, branches |
| **Templates — Skills (10 files)** |
| 26 | `templates/skills/plan-review.hbs` | Template | Plan review |
| 27 | `templates/skills/code-review-skill.hbs` | Template | Code review |
| 28 | `templates/skills/code-review-checklist.hbs` | Template | Review checklist |
| 29 | `templates/skills/qa.hbs` | Template | QA testing |
| 30 | `templates/skills/ship.hbs` | Template | Ship workflow |
| 31 | `templates/skills/document-release.hbs` | Template | Doc updates |
| 32 | `templates/skills/retro.hbs` | Template | Retro stats |
| 33 | `templates/skills/db-migration-review.hbs` | Template | Migration review |
| 34 | `templates/skills/api-contract-check.hbs` | Template | API contract check |
| 35 | `templates/skills/dependency-audit.hbs` | Template | Dep audit |
| **Templates — Partials (5 files)** |
| 36 | `templates/partials/migrationCommands.hbs` | Partial | Migration commands |
| 37 | `templates/partials/repositoryPattern.hbs` | Partial | Repository rules |
| 38 | `templates/partials/testCommands.hbs` | Partial | Test commands |
| 39 | `templates/partials/buildCommands.hbs` | Partial | Build commands |
| 40 | `templates/partials/gitRules.hbs` | Partial | Git conventions |
| **Templates — Context & Tracking (3 files)** |
| 41 | `templates/context/domain-map.hbs` | Template | Architecture map |
| 42 | `templates/context/tech-stack.hbs` | Template | Stack summary |
| 43 | `templates/tracking/efficiency.hbs` | Template | Quality metrics |
| **Presets (4 files)** |
| 44 | `presets/nestjs-prisma.json` | Data | Quick start preset |
| 45 | `presets/nestjs-typeorm.json` | Data | Quick start preset |
| 46 | `presets/express-prisma.json` | Data | Quick start preset |
| 47 | `presets/fastify-drizzle.json` | Data | Quick start preset |
| **Meta (1 file)** |
| 48 | `README.md` | Docs | Usage guide |

**Total: 48 source files**

---

## Implementation Phases

### Phase 1: Foundation
Files 1–9, 15–17 (core CLI + engine + 3 sample templates)
- Working `npx` command that asks prompts and generates partial output
- Validate: run CLI → check `.ai/AGENT.md` and 2 rules render correctly

### Phase 2: Full Templates  
Files 18–43 (remaining 8 rules + all 10 skills + partials + context)
- Every template has conditional blocks for all 4 frameworks × 5 ORMs
- Validate: run CLI with different combos → diff output for correctness

### Phase 3: IDE Adapters
Files 10–14 (5 adapter modules)
- Each adapter transforms `.ai/` → IDE-specific format
- Validate: run CLI with each IDE selected → check output structure

### Phase 4: Polish
Files 44–48 (presets + README)
- `--preset` flag works
- README covers full usage
- Validate: `npx backend-ai-starter-recipes --preset nestjs-prisma` works end-to-end

---

## Verification Plan

### Automated (CLI Smoke Tests)

```bash
# Phase 1: Basic generation
node dist/cli.js --output /tmp/test-nestjs-prisma
# Verify: .ai/AGENT.md exists, contains "NestJS", "Prisma"

# Phase 2: Multi-combo validation
node dist/cli.js --preset nestjs-prisma --output /tmp/test1
node dist/cli.js --preset express-prisma --output /tmp/test2
node dist/cli.js --preset fastify-drizzle --output /tmp/test3
# Verify: diff test1/.ai/rules/data-layer.md test2/.ai/rules/data-layer.md (should differ)
# Verify: grep "Express" test2/.ai/AGENT.md (should find Express)
# Verify: grep "Drizzle" test3/.ai/rules/data-layer.md (should find Drizzle)

# Phase 3: IDE adapter output
node dist/cli.js --preset nestjs-prisma --output /tmp/test-cursor
# Verify: .cursor/rules/index.mdc exists, starts with --- frontmatter
# Verify: CLAUDE.md exists if claude-code selected
# Verify: .github/copilot-instructions.md exists if vscode selected

# Phase 4: Presets
node dist/cli.js --preset nestjs-prisma --output /tmp/test-preset
# Verify: no interactive prompts, output matches expected structure
```

### Manual Verification
1. Run `npx backend-ai-starter-recipes` interactively, walk through all prompts, inspect generated files
2. Copy generated `.cursor/rules/*.mdc` into a real Cursor workspace → verify rules show in Cursor UI
3. Copy generated `CLAUDE.md` into a project → verify Claude Code reads it
4. Read through 2-3 generated skill files → verify they're coherent and reference correct commands for the chosen stack

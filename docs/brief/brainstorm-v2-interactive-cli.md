# Backend AI Template — Brainstorm v2: Interactive CLI Generator

> **v1 backup:** See `brainstorm_v1_static_template.md` for the original static-file approach.

---

## The Pivot

Instead of static template files with `<!-- CUSTOMIZE -->` placeholders, build a **Node.js CLI tool** that:

1. **Asks** the developer about their stack (framework, ORM, auth, validation, etc.)
2. **Renders** Handlebars templates with their answers
3. **Outputs** a fully customized `.ai/` directory ready to drop into any repo

```
npx create-ai-rules
# or
npx create-ai-rules --output ./my-project
```

---

## Why This Is Better

| Static Template | Interactive CLI |
|-----------------|-----------------|
| User manually finds + replaces `<!-- CUSTOMIZE -->` blocks | CLI fills everything in automatically |
| Easy to miss a placeholder → stale/wrong instructions | All values gathered upfront, consistent everywhere |
| One ORM flavor hardcoded | User picks Prisma / TypeORM / Drizzle / MikroORM / Knex |
| User must know what to customize | Guided prompts explain each choice |
| IDE adapter = manual copy + rename | CLI generates IDE-specific files automatically |

---

## Tech Stack for the CLI Tool

| Concern | Library | Why |
|---------|---------|-----|
| **Templating** | **Handlebars** | Simple `{{variable}}` syntax, `{{#if}}` conditionals, partials for shared blocks. No embedded JS logic — keeps templates readable |
| **Interactive prompts** | **@inquirer/prompts** | Modern version of Inquirer.js (the legacy `inquirer` package is no longer actively developed). Clean API, promise-based |
| **CLI framework** | **Commander.js** | Argument parsing, `--output`, `--preset`, `--help` flags |
| **Output styling** | **chalk** | Colored terminal output for a polished experience |
| **File operations** | **Node.js fs/path** | No extra deps needed |
| **Language** | **TypeScript** | Type safety for template context objects |
| **Build** | **tsup** | Fast bundler, outputs CJS + ESM, minimal config |

---

## CLI Interactive Flow

The CLI asks ~12 questions in logical groups. Each choice affects which template blocks render.

### Group 1: Project Identity

```
? Project name: (my-backend)
? Brief project description: (A NestJS backend service)
```

### Group 2: Framework & Language

```
? Backend framework:
  ❯ NestJS (recommended)
    Express
    Fastify
    Hono

? Language:
  ❯ TypeScript (recommended)
    JavaScript
```

### Group 3: Data Layer

```
? ORM / Query Builder:
  ❯ Prisma
    TypeORM
    Drizzle
    MikroORM
    Knex
    None (raw SQL)

? Database:
  ❯ PostgreSQL
    MySQL
    MongoDB
    SQLite
```

### Group 4: API & Validation

```
? Validation library:
  ❯ class-validator + class-transformer (recommended for NestJS)
    zod
    joi
    None

? API documentation:
  ❯ Swagger / OpenAPI (@nestjs/swagger)
    None
```

### Group 5: Auth & Security

```
? Authentication approach:
  ❯ JWT (Passport)
    Session-based
    OAuth2 provider (Auth0/Clerk/Privy)
    Custom
    None (public API)
```

### Group 6: Testing

```
? Testing framework:
  ❯ Jest (recommended for NestJS)
    Vitest
    Mocha
```

### Group 7: DevOps & Quality

```
? Monitoring/Observability:
  ☑ Sentry (error tracking)
  ☑ New Relic / Datadog (APM)
  ☐ Prometheus + Grafana
  ☐ None

? CI/CD:
  ❯ GitHub Actions
    GitLab CI
    None
```

### Group 8: IDE Targets

```
? Generate instructions for which IDEs? (select all that apply)
  ☑ Universal (.ai/) — always generated
  ☐ Cursor (.cursor/rules/)
  ☐ Claude Code (CLAUDE.md)
  ☐ VS Code Copilot (.github/copilot-instructions.md)
  ☐ Antigravity (.agents/workflows/)
  ☐ Windsurf (.windsurfrules)
```

### Group 9: Skills

```
? Which AI skills/workflows to include?
  ☑ plan-review   — Architecture review before implementation
  ☑ code-review   — Pre-landing diff review with checklist
  ☑ qa            — Systematic API quality testing
  ☑ ship          — Automated ship workflow (checks → PR)
  ☐ document-release — Auto-update docs after shipping
  ☐ retro         — Developer productivity retrospective
```

---

## Template Architecture

### Directory Structure (Source Repo)

```
backend-ai-template/
├── src/
│   ├── cli.ts                      # Entry point — Commander setup
│   ├── prompts.ts                  # All Inquirer prompt definitions
│   ├── generator.ts                # Reads answers → renders templates → writes files
│   ├── adapters/                   # IDE-specific format converters
│   │   ├── cursor.ts               # → .cursor/rules/*.mdc
│   │   ├── claude-code.ts          # → CLAUDE.md
│   │   ├── vscode-copilot.ts       # → .github/copilot-instructions.md
│   │   ├── antigravity.ts          # → .agents/workflows/*.md
│   │   └── windsurf.ts             # → .windsurfrules
│   └── types.ts                    # UserConfig type definition
├── templates/                      # Handlebars templates
│   ├── agent.hbs                   # → .ai/AGENT.md
│   ├── rules/
│   │   ├── architecture.hbs        # → .ai/rules/architecture.md
│   │   ├── data-layer.hbs          # → .ai/rules/data-layer.md
│   │   ├── api-patterns.hbs        # → .ai/rules/api-patterns.md
│   │   ├── errors-logging-security.hbs
│   │   ├── external-integrations.hbs
│   │   ├── testing.hbs
│   │   └── pre-commit.hbs
│   ├── skills/
│   │   ├── plan-review.hbs
│   │   ├── code-review-skill.hbs
│   │   ├── code-review-checklist.hbs
│   │   ├── qa.hbs
│   │   ├── ship.hbs
│   │   ├── document-release.hbs
│   │   └── retro.hbs
│   ├── context/
│   │   ├── domain-map.hbs
│   │   └── tech-stack.hbs
│   └── tracking/
│       └── efficiency.hbs
├── package.json
├── tsconfig.json
└── README.md
```

### How Handlebars Templates Work

Each `.hbs` file uses the gathered user config as context:

```handlebars
# Data Layer ({{orm}})

{{#if (eq orm "prisma")}}
**Schema:** `prisma/schema.prisma` defines all models. Use UUIDs for primary keys.
{{else if (eq orm "typeorm")}}
**Entities:** Define entities in `src/entities/` using TypeORM decorators.
{{else if (eq orm "drizzle")}}
**Schema:** Define schemas in `src/db/schema.ts` using Drizzle's TypeScript-first API.
{{/if}}

**Repository Pattern:** All database access goes through `[feature].repository.ts`.
Services never import `{{ormServiceName}}` directly.

**Migrations:**
{{#if (eq orm "prisma")}}
- Create: `npx prisma migrate dev --name <descriptive_name>`
- Apply: `npx prisma migrate deploy`
- Generate client: `npx prisma generate`
{{else if (eq orm "typeorm")}}
- Generate: `npx typeorm migration:generate -n <descriptive_name>`
- Run: `npx typeorm migration:run`
- Revert: `npx typeorm migration:revert`
{{else if (eq orm "drizzle")}}
- Generate: `npx drizzle-kit generate`
- Push: `npx drizzle-kit push`
- Migrate: `npx drizzle-kit migrate`
{{/if}}

**Universal rules (apply regardless of ORM):**
- Migrations must be atomic — one logical change per migration
- Never edit existing migration files; always create new ones
- Use descriptive migration names
- Prefer soft deletes over hard deletes
- Test migrations in dev before production
```

### Template Context Object (TypeScript)

```typescript
interface TemplateContext {
  // Project
  projectName: string;
  projectDescription: string;

  // Framework
  framework: 'nestjs' | 'express' | 'fastify' | 'hono';
  language: 'typescript' | 'javascript';

  // Data layer
  orm: 'prisma' | 'typeorm' | 'drizzle' | 'mikro-orm' | 'knex' | 'none';
  ormServiceName: string;        // Derived: PrismaService, DataSource, etc.
  database: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';

  // API
  validation: 'class-validator' | 'zod' | 'joi' | 'none';
  apiDocs: 'swagger' | 'none';

  // Auth
  auth: 'jwt-passport' | 'session' | 'oauth2-provider' | 'custom' | 'none';

  // Testing
  testFramework: 'jest' | 'vitest' | 'mocha';
  testCommand: string;           // Derived: npm run test, npx vitest, etc.

  // DevOps
  monitoring: string[];          // ['sentry', 'newrelic']
  cicd: 'github-actions' | 'gitlab-ci' | 'none';

  // IDE targets
  ideTargets: string[];          // ['cursor', 'claude-code', ...]

  // Skills
  skills: string[];              // ['plan-review', 'code-review', 'qa', 'ship']

  // Derived helpers
  isNestJS: boolean;
  hasPrisma: boolean;
  hasSwagger: boolean;
  hasAuth: boolean;
}
```

---

## Output: What Gets Generated

Given a user who picks: NestJS + Prisma + class-validator + Jest + Cursor IDE:

```
my-project/
├── .ai/                              # Always generated (canonical source)
│   ├── AGENT.md                      # Master instructions, fully filled
│   ├── rules/
│   │   ├── architecture.md           # NestJS module structure
│   │   ├── data-layer.md             # Prisma-specific commands + universal rules
│   │   ├── api-patterns.md           # class-validator + Swagger patterns
│   │   ├── errors-logging-security.md
│   │   ├── external-integrations.md
│   │   ├── testing.md                # Jest patterns
│   │   └── pre-commit.md             # Quality gates
│   ├── skills/
│   │   ├── plan-review/SKILL.md
│   │   ├── code-review/
│   │   │   ├── SKILL.md
│   │   │   └── checklist.md
│   │   ├── qa/SKILL.md
│   │   └── ship/SKILL.md
│   ├── context/
│   │   ├── domain-map.md             # Template structure, user fills in specifics
│   │   └── tech-stack.md             # Pre-filled with their choices
│   └── tracking/
│       └── efficiency.md
│
├── .cursor/                          # Only if Cursor was selected
│   └── rules/
│       ├── index.mdc                 # alwaysApply: true
│       ├── architecture.mdc          # alwaysApply: true
│       ├── data-layer.mdc            # globs: prisma/**/*,**/*.repository.ts
│       ├── api-patterns.mdc          # globs: **/*.dto.ts,**/*.controller.ts
│       ├── errors-logging-security.mdc
│       ├── external-integrations.mdc # globs: src/external/**/*.ts
│       ├── testing.mdc               # globs: **/*.spec.ts,**/*.e2e-spec.ts
│       └── pre-commit.mdc
│
└── (CLAUDE.md, .github/, etc. if those IDEs were selected)
```

---

## Presets (Fast Path)

For common combos, offer presets that skip most questions:

```
npx create-ai-rules --preset nestjs-prisma
npx create-ai-rules --preset express-typeorm
npx create-ai-rules --preset fastify-drizzle
```

Preset files live in `/presets/*.json` and contain pre-filled answers.

---

## File Manifest: Complete List of Templates

| # | Template | Output | Conditional on |
|---|----------|--------|---------------|
| 1 | `agent.hbs` | `.ai/AGENT.md` | Always |
| 2 | `rules/architecture.hbs` | `.ai/rules/architecture.md` | Always |
| 3 | `rules/data-layer.hbs` | `.ai/rules/data-layer.md` | `orm !== 'none'` |
| 4 | `rules/api-patterns.hbs` | `.ai/rules/api-patterns.md` | Always |
| 5 | `rules/errors-logging-security.hbs` | `.ai/rules/errors-logging-security.md` | Always |
| 6 | `rules/external-integrations.hbs` | `.ai/rules/external-integrations.md` | Always |
| 7 | `rules/testing.hbs` | `.ai/rules/testing.md` | Always |
| 8 | `rules/pre-commit.hbs` | `.ai/rules/pre-commit.md` | Always |
| 9 | `skills/plan-review.hbs` | `.ai/skills/plan-review/SKILL.md` | `'plan-review' in skills` |
| 10 | `skills/code-review-skill.hbs` | `.ai/skills/code-review/SKILL.md` | `'code-review' in skills` |
| 11 | `skills/code-review-checklist.hbs` | `.ai/skills/code-review/checklist.md` | `'code-review' in skills` |
| 12 | `skills/qa.hbs` | `.ai/skills/qa/SKILL.md` | `'qa' in skills` |
| 13 | `skills/ship.hbs` | `.ai/skills/ship/SKILL.md` | `'ship' in skills` |
| 14 | `skills/document-release.hbs` | `.ai/skills/document-release/SKILL.md` | `'document-release' in skills` |
| 15 | `skills/retro.hbs` | `.ai/skills/retro/SKILL.md` | `'retro' in skills` |
| 16 | `context/domain-map.hbs` | `.ai/context/domain-map.md` | Always |
| 17 | `context/tech-stack.hbs` | `.ai/context/tech-stack.md` | Always |
| 18 | `tracking/efficiency.hbs` | `.ai/tracking/efficiency.md` | Always |

**IDE adapters** are not Handlebars templates but TypeScript transformer functions that read the generated `.ai/` files and reformat them for each IDE.

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- CLI scaffold with Commander + @inquirer/prompts
- Template context types
- Core Handlebars templates (agent, rules, 2 skills)
- File writer with directory creation
- Basic output with chalk

### Phase 2: Full Templates
- All 18 templates with full conditional logic
- All ORM variants (Prisma, TypeORM, Drizzle, MikroORM, Knex)
- All framework variants (NestJS focus, Express/Fastify stubs)
- All skill workflows

### Phase 3: IDE Adapters
- Cursor adapter (.mdc format)
- Claude Code adapter (CLAUDE.md)
- VS Code Copilot adapter
- Antigravity adapter
- Windsurf adapter

### Phase 4: Polish
- Presets (--preset flag)
- Dry-run mode (--dry-run)
- Config file mode (read from .ai-config.json)
- npx support and npm publishing

---

## Open Questions

1. **Package name:** `create-ai-rules`? `create-backend-ai-config`? `ai-agent-init`?
2. **Should we support `--config file.json`** for CI/automated generation, or is interactive-only fine for v1?
3. **How much framework-specific content** for Express/Fastify/Hono vs. NestJS? Should we do NestJS-deep and Express/Fastify-light?
4. **Handlebars custom helpers** — should we use `eq`, `includes`, `or` helpers, or keep templates simpler with pre-computed booleans in the context object?

# Usage

## Try it in 2 minutes

Run the NestJS/Prisma preset into a throwaway folder:

```bash
npx backend-ai-starter-recipes --preset nestjs-prisma --output ./my-backend
```

Then inspect the generated operating manual:

```text
my-backend/
├── .ai/
│   ├── AGENT.md
│   ├── lifecycle/
│   ├── rules/
│   ├── skills/
│   ├── context/
│   └── tracking/
└── .cursor/ or other IDE adapter files
```

Use `bare --preset nestjs-prisma --output ./my-backend` after a global install.

## Two modes

| Mode | When to use |
|------|-------------|
| **Interactive** | First time, or a custom stack not covered by a preset |
| **`--preset`** | CI, docs, or a known stack (Nest + Prisma, etc.) |

## Interactive flow (grouped)

The CLI walks through **project identity → stack → tooling → outputs**. Roughly:

```mermaid
flowchart TB
  subgraph P1 [Project identity]
    A1[Project name]
    A2[Description]
  end
  subgraph P2 [Stack]
    B1[Framework: NestJS Express Fastify Hono]
    B2[Language: TS or JS]
    B3[ORM and database]
    B4[Validation API docs Auth]
  end
  subgraph P3 [Tooling]
    C1[Test framework]
    C2[Monitoring]
    C3[CI/CD]
  end
  subgraph P4 [Outputs]
    D1[Target IDEs]
    D2[Skills to include]
  end
  P1 --> P2 --> P3 --> P4
```

::: tip What you will be asked
- **Framework:** NestJS, Express, Fastify, Hono  
- **Language:** TypeScript or JavaScript  
- **ORM:** Prisma, TypeORM, Drizzle, MikroORM, Knex, or none (raw SQL)  
- **Database:** PostgreSQL, MySQL, MongoDB, SQLite  
- **Validation:** class-validator, Zod, Joi, or none  
- **API docs:** Swagger/OpenAPI or none  
- **Auth:** JWT (Passport), session, OAuth2 provider, custom, or none  
- **Tests:** Jest, Vitest, Mocha  
- **Monitoring:** Sentry, APM, Prometheus (multi-select)  
- **CI/CD:** GitHub Actions, GitLab CI, or none  
- **IDEs:** Cursor, Claude Code, VS Code Copilot, Antigravity, Windsurf, or all  
- **Skills:** plan-review, code-review, QA, ship, plus optional workflows (document-release, retro, db-migration-review, api-contract-check, dependency-audit) or all  
:::

If you omit `--output`, the CLI prompts for a directory (and warns if it is non-empty).

## Preset coverage

| Preset | Stack (summary) |
|--------|------------------|
| `nestjs-prisma` | NestJS, TypeScript, Prisma, PostgreSQL, class-validator, Swagger/OpenAPI, JWT, Jest |
| `nestjs-typeorm` | NestJS, TypeScript, TypeORM, PostgreSQL, class-validator, Swagger/OpenAPI, JWT, Jest |
| `express-prisma` | Express, TypeScript, Prisma, PostgreSQL, Zod, Swagger/OpenAPI, JWT, Vitest |
| `fastify-drizzle` | Fastify, TypeScript, Drizzle, PostgreSQL, Zod, Swagger/OpenAPI, JWT, Vitest |

::: code-group

```bash [nestjs-prisma]
npx backend-ai-starter-recipes --preset nestjs-prisma --output ./my-nestjs-app
```

```bash [nestjs-typeorm]
npx backend-ai-starter-recipes --preset nestjs-typeorm --output ./my-app
```

```bash [express-prisma]
npx backend-ai-starter-recipes --preset express-prisma --output ./my-express-app
```

```bash [fastify-drizzle]
npx backend-ai-starter-recipes --preset fastify-drizzle --output ./my-fastify-app
```

:::

## CLI flags

| Flag | Short | Description |
|------|-------|-------------|
| `--output <dir>` | `-o` | Output directory (skips the path prompt) |
| `--preset <name>` | `-p` | Use a JSON preset from the package’s `presets/` folder |

## Minimal example

```bash
npx backend-ai-starter-recipes --preset nestjs-prisma --output ./api
```

You should see a tree similar to:

```text
api/
├── .ai/
│   ├── AGENT.md
│   ├── rules/
│   ├── skills/
│   ├── context/
│   └── tracking/
├── .cursor/          # if Cursor was selected in preset
└── ...
```

(Preset defaults include specific IDEs; customize via interactive run or by editing a copied preset JSON for your fork.)

## Known Limitations

- This is an early community release intended for developer testing and feedback.
- Presets are opinionated starting points, not proof that every team using that stack should follow the same rules.
- Generated `.ai/` content should be reviewed and edited inside your real repo before treating it as authoritative.
- IDE adapters depend on how each AI tool reads repository context; behavior may differ across tool versions.
- The CLI creates AI instructions, lifecycle guidance, rules, skills, context, tracking, and adapter files. It does not scaffold a complete backend service.

---

**Next:** learn what each folder means — [Understanding the output](/guide/5-the-output).

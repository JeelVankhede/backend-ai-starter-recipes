# Backend AI Starter Recipes

[![CI](https://github.com/JeelVankhede/backend-ai-starter-recipes/actions/workflows/ci.yml/badge.svg)](https://github.com/JeelVankhede/backend-ai-starter-recipes/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/backend-ai-starter-recipes.svg)](https://www.npmjs.com/package/backend-ai-starter-recipes)
[![Node.js](https://img.shields.io/node/v/backend-ai-starter-recipes)](https://github.com/JeelVankhede/backend-ai-starter-recipes/blob/main/package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/JeelVankhede/backend-ai-starter-recipes/blob/main/LICENSE)

Generate opinionated, customized AI agent instructions and workflows for your Node.js backend projects.

**Package:** [`backend-ai-starter-recipes`](https://www.npmjs.com/package/backend-ai-starter-recipes) on npm. **Short CLI:** `bare` (after global install).

Requires **Node.js 20+**.

## Quick start

### npx (no install)

```bash
npx backend-ai-starter-recipes --output ./my-backend
```

### Global install (short command `bare`)

```bash
npm install -g backend-ai-starter-recipes
bare --output ./my-backend
```

Both commands accept the same flags (`--output`, `--preset`, etc.).

Answer the prompts to define your framework, ORM, validation, auth, testing, and target IDEs. The CLI writes a canonical `.ai/` directory and IDE-specific files (**Cursor**, **Claude Code**, **VS Code Copilot**, **Antigravity**, **Windsurf**).

## Non-interactive presets

```bash
npx backend-ai-starter-recipes --preset nestjs-prisma --output ./my-nestjs-app
npx backend-ai-starter-recipes --preset express-prisma --output ./my-express-app
npx backend-ai-starter-recipes --preset fastify-drizzle --output ./my-fastify-app
```

(Use `bare` instead of `npx backend-ai-starter-recipes` if installed globally.)

## Supported stack

- **Frameworks:** NestJS, Express, Fastify, Hono
- **Languages:** TypeScript, JavaScript
- **ORMs:** Prisma, TypeORM, Drizzle, MikroORM, Knex, raw SQL
- **Databases:** PostgreSQL, MySQL, MongoDB, SQLite
- **Validation:** class-validator, Zod, Joi
- **Testing:** Jest, Vitest, Mocha
- **Auth:** JWT, Session, OAuth2
- **IDEs:** Cursor, Claude Code, VS Code Copilot, Antigravity, Windsurf

## What gets generated?

- `.ai/AGENT.md` — core AI behavior
- `.ai/rules/` — architecture, API, errors, testing, Git, etc.
- `.ai/skills/` — workflows (plan-review, code-review, qa, ship, …)
- `.ai/context/`, `.ai/tracking/` — reference and metrics
- Plus adapters for each selected IDE

## Development

```bash
npm ci
npm run build   # CLI e2e tests use dist/cli.js
npm test        # Vitest
npm run test:coverage
```

## Repository & contributing

- Source: [github.com/JeelVankhede/backend-ai-starter-recipes](https://github.com/JeelVankhede/backend-ai-starter-recipes)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for branches, PRs, branch protection, and **release process** (manual workflow; npm **Trusted Publishing / OIDC**, no publish token).

## Security

Report vulnerabilities via [GitHub Security Advisories](https://github.com/JeelVankhede/backend-ai-starter-recipes/security/advisories/new) or see [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).

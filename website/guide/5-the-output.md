# Understanding the output

## Generated output by adapter

The CLI creates repo instructions and adapter files, not a runnable backend service.
Files are written directly to each IDE's native paths — no `.ai/` intermediate directory is created.

| Adapter | What gets written |
| --- | --- |
| **Cursor** | `.cursor/rules/index.mdc` (agent + context) · `.cursor/rules/<rule>.mdc` (9 rules, per-rule globs) · `.cursor/skills/<stage>/SKILL.md` (7 lifecycle stages) |
| **Claude Code** | `.claude/rules/<rule>.md` (9 rules) · `.claude/commands/<stage>.md` (7 lifecycle stages) · `CLAUDE.md` (load-when pointer index) |
| **VS Code Copilot** | `.github/copilot-instructions.md` (agent + all rules + all lifecycle stages merged into one file) |
| **Windsurf** | `.windsurf/rules/<rule>.md` (9 rules) · `.windsurf/rules/lifecycle-<stage>.md` (7 stages) · `.windsurfrules` (agent + context) |
| **Antigravity** | `.agents/workflows/<stage>.md` (7 lifecycle stages) |

Select one or more adapters during the interactive prompt. Only the files for selected adapters are written.

The `data-layer-migrations` rule is included only when an ORM was selected (Prisma, TypeORM, Drizzle, MikroORM, or Knex).

## Rules (topics)

9 rule files covering: architecture-api, auth-security, errors-logging-observability, integrations-async, testing, pre-commit, environment, git-conventions, and (conditionally) data-layer-migrations.

## Lifecycle

The 7 lifecycle stages are written in adapter-native paths (see table above):

- **think** — understand the backend goal, stack, contracts, data/auth risks, and constraints before planning
- **plan** — name affected APIs, data models, migrations, auth boundaries, integrations, jobs, risks, and tests
- **build** — implement only the approved backend scope
- **review** — check correctness, API compatibility, data integrity, security, and observability
- **test** — run or define validation proportional to backend risk
- **ship** — summarize changes, validation, release notes, breaking changes, and rollback notes
- **reflect** — capture backend template gaps and follow-up tasks

## Cursor

- `.cursor/rules/index.mdc` — agent identity + project context (`alwaysApply: true`)
- `.cursor/rules/<rule>.mdc` — per-rule file with `globs` where relevant (e.g. `testing`, `data-layer-migrations`)
- `.cursor/skills/<stage>/SKILL.md` — lifecycle stage invoked via `/think`, `/plan`, etc.

## Claude Code

- `.claude/rules/<rule>.md` — per-rule file (loaded on demand)
- `.claude/commands/<stage>.md` — lifecycle stage invoked from the command palette
- `CLAUDE.md` — slim pointer index listing all rules and lifecycle commands with `load-when` paths

## VS Code Copilot

`.github/copilot-instructions.md` — single merged file with agent instructions, all rules, and all lifecycle sections. Reference sections by name in Copilot chat.

## Windsurf

- `.windsurfrules` — agent + context (always-on)
- `.windsurf/rules/<rule>.md` — per-rule files
- `.windsurf/rules/lifecycle-<stage>.md` — per-stage lifecycle files

## Antigravity

`.agents/workflows/<stage>.md` — one workflow file per lifecycle stage (7 total).

**Next:** [Recommended workflow](/guide/6-workflow).

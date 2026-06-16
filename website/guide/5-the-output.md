# Understanding the output

## What gets generated

The CLI writes adapter-native files directly into your project. You get only the files for the IDEs you selected — nothing else is created.

Commit these files like any other project config. The CLI creates AI instructions and adapter files, not a runnable backend service. Review and edit the generated content before treating it as authoritative.

| Adapter | What gets written |
| --- | --- |
| **Cursor** | `.cursor/rules/index.mdc` (agent + context) · `.cursor/rules/<rule>.mdc` (9 rules, per-rule globs) · `.cursor/skills/<stage>/SKILL.md` (7 lifecycle stages) |
| **Claude Code** | `.claude/rules/<rule>.md` (9 rules) · `.claude/commands/<stage>.md` (7 lifecycle stages) · `CLAUDE.md` (load-when pointer index) |
| **VS Code Copilot** | `.github/copilot-instructions.md` (agent + all rules + all lifecycle stages merged into one file) |
| **Windsurf** | `.windsurf/rules/<rule>.md` (9 rules) · `.windsurf/rules/lifecycle-<stage>.md` (7 stages) · `.windsurfrules` (agent + context) |
| **Antigravity** | `.agents/workflows/<stage>.md` (7 lifecycle stages) |

Select one or more adapters during the interactive prompt. Only the files for selected adapters are written.

The `data-layer-migrations` rule is included only when an ORM was selected (Prisma, TypeORM, Drizzle, MikroORM, or Knex).

## Rules

| Rule file | What it controls |
| --- | --- |
| `architecture-api.md` | Module/router/plugin layout, DI, repository pattern, API design, OpenAPI, pagination, versioning |
| `auth-security.md` | Authentication, authorisation, secrets handling |
| `data-layer-migrations.md` | ORM schema, migrations, repositories *(if ORM ≠ none)* |
| `errors-logging-observability.md` | Error handling, logging, observability hooks |
| `integrations-async.md` | Third-party clients, retries, queues, jobs, idempotency, cron |
| `environment.md` | Config, env files, Docker, flags |
| `git-conventions.md` | Branches, commits, PR focus |
| `pre-commit.md` | Build / lint / test gates before commit |
| `testing.md` | Unit vs e2e, framework idioms, mocking |

## Lifecycle stages

The 7 lifecycle stages are written in adapter-native paths (see table above):

- **think** — understand the backend goal, stack, contracts, data/auth risks, and constraints before planning
- **plan** — name affected APIs, data models, migrations, auth boundaries, integrations, jobs, risks, and tests
- **build** — implement only the approved backend scope
- **review** — check correctness, API compatibility, data integrity, security, and observability
- **test** — run or define validation proportional to backend risk
- **ship** — summarize changes, validation, release notes, breaking changes, and rollback notes
- **reflect** — capture backend template gaps and follow-up tasks

## Per-adapter output

### Cursor

```
.cursor/rules/index.mdc           # agent identity (alwaysApply: true)
.cursor/rules/<rule>.mdc          # one file per rule, globs where relevant
.cursor/skills/think/
.cursor/skills/plan/
.cursor/skills/build/
.cursor/skills/review/
.cursor/skills/test/
.cursor/skills/ship/
.cursor/skills/reflect/
```

### Claude Code

```
CLAUDE.md                         # agent identity + all rules merged
.claude/commands/think.md
.claude/commands/plan.md
.claude/commands/build.md
.claude/commands/review.md
.claude/commands/test.md
.claude/commands/ship.md
.claude/commands/reflect.md
```

### VS Code Copilot

```
.github/copilot-instructions.md   # agent identity + all rules merged
```

### Windsurf

```
.windsurfrules                         # agent identity (slim doc)
.windsurf/rules/<rule>.md              # one file per rule
.windsurf/rules/lifecycle-think.md
.windsurf/rules/lifecycle-plan.md
.windsurf/rules/lifecycle-build.md
.windsurf/rules/lifecycle-review.md
.windsurf/rules/lifecycle-test.md
.windsurf/rules/lifecycle-ship.md
.windsurf/rules/lifecycle-reflect.md
```

### Antigravity

```
.agents/workflows/think.md
.agents/workflows/plan.md
.agents/workflows/build.md
.agents/workflows/review.md
.agents/workflows/test.md
.agents/workflows/ship.md
.agents/workflows/reflect.md
```

**Next:** [Recommended workflow](/guide/6-workflow).

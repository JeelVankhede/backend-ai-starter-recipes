# Migrating from v1.1 to v1.2

> This guide is for existing Bare users upgrading from v1.1. New users: start with [Understanding the output](/guide/5-the-output).

## What changed

**v1.1** wrote a `.ai/` canonical directory to your project on every run — the CLI then copied content from `.ai/` into adapter-specific files. This intermediate directory cluttered projects with files that no IDE natively reads.

**v1.2** removes `.ai/` entirely. Rules, lifecycle files, and agent instructions are rendered in memory and written directly to each IDE's native paths. You see only the files your selected IDE actually reads.

### Before (v1.1)

```text
my-backend/
├── .ai/
│   ├── AGENT.md
│   ├── lifecycle/    ← 7 stage files
│   ├── rules/        ← 10 rule files
│   ├── skills/       ← standalone skill files
│   ├── context/
│   └── tracking/
├── .cursor/          ← adapter files (sourced from .ai/)
└── CLAUDE.md         ← adapter file (sourced from .ai/)
```

### After (v1.2)

```text
my-backend/
├── .cursor/rules/         ← 9 rule files, written directly
├── .cursor/skills/        ← 7 lifecycle stage files, written directly
├── CLAUDE.md              ← pointer index, written directly
├── .claude/rules/         ← 9 rule files
├── .claude/commands/      ← 7 lifecycle commands
└── .github/copilot-instructions.md   ← all merged, written directly
```

---

## Complete output path table (v1.2)

| Adapter | Rules | Lifecycle |
| --- | --- | --- |
| **Cursor** | `.cursor/rules/<rule>.mdc` (9 files) + `.cursor/rules/index.mdc` | `.cursor/skills/<stage>/SKILL.md` (7 files) |
| **Claude Code** | `.claude/rules/<rule>.md` (9 files) + `CLAUDE.md` pointer index | `.claude/commands/<stage>.md` (7 files) |
| **VS Code Copilot** | `.github/copilot-instructions.md` (all rules merged) | Same file — `## Lifecycle: <Stage>` sections |
| **Windsurf** | `.windsurf/rules/<rule>.md` (9 files) + `.windsurfrules` | `.windsurf/rules/lifecycle-<stage>.md` (7 files) |
| **Antigravity** | Not supported | `.agents/workflows/<stage>.md` (7 files) |

The `data-layer-migrations` rule is included only when an ORM was selected (Prisma, TypeORM, Drizzle, MikroORM, or Knex).

---

## Bare rule changes (v1.1 → v1.2)

Two rule pairs were folded and two were renamed. If you have referenced or customized any of these files in a consumer project, rename or merge them before re-running the CLI.

| v1.1 output filename | v1.2 output filename | Change |
| --- | --- | --- |
| `errors-logging-security.mdc` / `.md` | **`errors-logging-observability.mdc` / `.md`** | Rename — security scope moved to `auth-security` |
| `api-patterns.mdc` + `architecture.mdc` / `.md` | **`architecture-api.mdc` / `.md`** | Fold 2→1 |
| `external-integrations.mdc` + `async-patterns.mdc` / `.md` | **`integrations-async.mdc` / `.md`** | Fold 2→1 |
| `data-layer.mdc` / `.md` | **`data-layer-migrations.mdc` / `.md`** | Rename — suffix added |

---

## Write mode on re-run

Re-running the CLI on an existing project backs up your existing adapter files by default:

```bash
bare --output ./my-backend                          # backs up to <file>.bare-backup
bare --output ./my-backend --write-mode overwrite   # overwrites without backup
bare --output ./my-backend --write-mode skip-existing  # skips existing files
```

---

## Manual cleanup

After confirming v1.2 output is correct for your project:

```bash
rm -rf .ai/
```

The `.ai/` directory is no longer written by v1.2 — it is safe to delete. Your IDE adapter files are now the source of truth.

---

## FAQ

**Why is `.ai/` no longer generated?**

`.ai/` was an internal intermediate artifact that no IDE natively reads. v1.2 generates files directly in the paths your IDE expects, eliminating the intermediate step and the clutter.

**Where do my rules live now?**

In your IDE's native location — see the [output path table](#complete-output-path-table-v12) above. For Cursor: `.cursor/rules/<rule>.mdc`. For Claude Code: `.claude/rules/<rule>.md`. For VS Code Copilot: `.github/copilot-instructions.md`. For Windsurf: `.windsurf/rules/<rule>.md`.

**Can I revert to v1.1 output?**

Yes — install the previous version: `npm install -g backend-ai-starter-recipes@1.1.0`. v1.1 docs are available via the version switcher in the nav.

**What happened to standalone skills?**

Standalone skills (`plan-review`, `code-review`, etc.) are no longer generated. The 7 lifecycle stages (Think → Reflect) cover the same workflow phases and are invoked directly from your IDE — see [Lifecycle in practice](/guide/7-lifecycle-demo).

**Where did `errors-logging-security.mdc` go?**

It was renamed to `errors-logging-observability.mdc` in v1.2. Security concerns (authz, input validation) moved to the new `auth-security` rule; observability (logging, error handling, tracing hooks) is now the focus of the renamed file. Same scope, more precise boundary.

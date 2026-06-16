# How it works

The CLI is a **templated pipeline**: your answers become a `TemplateContext`, Handlebars renders your rules and lifecycle stages in memory, and IDE adapters write those directly as native files for the tools you selected.

## End-to-end pipeline

```mermaid
flowchart LR
  A[Interactive prompts or preset JSON] --> B[buildContext]
  B --> C[TemplateContext]
  C --> D[Handlebars templates]
  D --> F[IDE adapters]
  F --> G[".cursor/, CLAUDE.md, copilot-instructions.md, …"]
```

1. **Prompts or preset** — Same data shape: framework, ORM, DB, validation, auth, tests, CI, IDEs.  
2. **`buildContext`** — Derives flags and strings the templates need (`hasPrisma`, `ormServiceName`, `testCommand`, …).  
3. **Handlebars** — Rules, lifecycle stages, and the agent file are rendered from `.hbs` templates into memory.  
4. **Adapters** — Each selected adapter writes its native files directly: Cursor `.mdc` rules, `CLAUDE.md`, Copilot instructions, Windsurf rules, or Antigravity workflows. No intermediate directory is written to disk.

::: details Deeper dive (for contributors)
Templates live under `templates/` in the repo (`agent.hbs`, `rules/`, `skills/`, `partials/`). The engine registers helpers (`eq`, `neq`, `includes`, `or`, `and`) and partials like `migrationCommands` and `gitRules` so ORM- and framework-specific text stays DRY.
:::

## One template, many stacks

`data-layer.hbs` is a good mental model: the **same** template branches on `orm` to emit Prisma vs TypeORM vs Drizzle commands and paths.

```mermaid
flowchart TB
  T[data-layer.hbs] --> P[Prisma paths and migrate commands]
  T --> TY[TypeORM entities and migrations]
  T --> D[Drizzle schema and drizzle-kit]
  T --> N[None: placeholder guidance]
```

That is how the whole generator stays maintainable — **one** rule file per concern, filled with your choices.

---

**Next:** get the CLI on your machine — [Installation](/guide/3-installation).

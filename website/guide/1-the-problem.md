# The problem

You open Cursor, Claude Code, or Copilot, type a prompt, and get… something plausible. Then you spend the next ten messages explaining that you use **Prisma**, not raw SQL; that errors should use your **NestJS** exception filter; that tests are **Vitest**, not Jest; that you want **Conventional Commits** and a **repository pattern**.

That friction is not laziness — it is **missing shared context**. General-purpose models do not ship with *your* stack, *your* repo layout, or *your* definition of “done.”

## Before BARE

::: info Typical loop
- Re-state stack and conventions in every session  
- Inconsistent file structure and patterns across features  
- Reviews catch “wrong framework idioms” instead of real design issues  
- Shipping means remembering checklists the agent was never given  
:::

## After BARE

::: tip What changes
- **Rules** encode how your backend should be structured, validated, tested, and secured — once.  
- **Skills** encode workflows (plan → review → implement → QA → ship) you can trigger deliberately.  
- **Context** files (`domain-map`, `tech-stack`) anchor the agent to *this* product.  
- **Tracking** (`efficiency`) helps you tighten rules when the model keeps missing the mark.  
:::

## What you generate (at a glance)

| Piece | Role |
|-------|------|
| **Agent file** | Core identity, quality gates, and principles for your repo |
| **Rules** (9 files) | Always-on standards — architecture, API, data layer, errors, testing, Git, and more |
| **Lifecycle stages** | Seven named workflows — Think, Plan, Build, Review, Test, Ship, Reflect |
| **Context** | Domain map and approved tech stack you fill in once |
| **IDE format** | Delivered as Cursor `.mdc` rules, `CLAUDE.md`, Copilot instructions, Windsurf rules, or Antigravity workflows |

---

**Next:** see how a few questions become all of that — [How it works](/guide/2-how-it-works).

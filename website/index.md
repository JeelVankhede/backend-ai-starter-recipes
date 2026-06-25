---
layout: home

hero:
  name: <span class="decorate">B</span>ackend-<span class="decorate">A</span>i-starter-<span class="decorate">RE</span>cipes
  text: Stop re-explaining your backend stack to every AI agent.
  tagline: Opinionated rules, skills, and context for NestJS, Express, Fastify, and Hono — one command, every adapter.
  actions:
    - theme: brand
      text: Try it in 2 minutes
      link: /guide/4-usage#try-it-in-2-minutes
    - theme: alt
      text: View on GitHub
      link: https://github.com/JeelVankhede/backend-ai-starter-recipes

features:
  - title: Framework-aware rules
    icon: 📐
    details: Architecture, APIs, data layer, testing, and Git conventions tailored to NestJS, Express, Fastify, or Hono — plus your ORM and validation choice.
  - title: AI workflow skills
    icon: 🧭
    details: Reusable workflows like plan-review, code-review, QA, and ship so every feature follows the same quality path without re-prompting.
  - title: Multi-IDE adapters
    icon: 🖥️
    details: Your stack choices render directly into Cursor rules, Claude Code instructions, Copilot config, Antigravity workflows, or Windsurf rules — pick what you use.

---

## How it works in 30 seconds

```mermaid
flowchart LR
  A[You answer prompts] --> B[CLI renders templates]
  B --> C[IDE-native files]
  C --> D[Agent follows your standards]
```

1. **Run** `npx backend-ai-starter-recipes` (or `bare` if installed globally) and point at your project folder.  
2. **Get** adapter-native files for every IDE you selected — Cursor rules, a `CLAUDE.md`, Copilot instructions, Windsurf rules, or Antigravity workflows. Nothing else lands in your project.  
3. **Build** features: the agent reads those docs automatically, so you describe *what* you want, not *how* to format every PR.

![BARE walkthrough](/walkthrough.gif)

::: tip Next step
Jump to [Try it in 2 minutes](/guide/4-usage#try-it-in-2-minutes), or continue with [The problem](/guide/1-the-problem).
:::

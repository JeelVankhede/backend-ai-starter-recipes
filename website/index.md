---
layout: home

hero:
  name: <span class="decorate">B</span>ackend-<span class="decorate">A</span>i-starter-<span class="decorate">RE</span>cipes
  text: Stop repeating yourself to AI
  tagline: Generate opinionated rules, skills, and context so your agent already knows your stack — npm package backend-ai-starter-recipes, CLI bare.
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
    details: One canonical .ai/ tree becomes Cursor rules, Claude Code, Copilot instructions, Antigravity workflows, or Windsurf rules — pick what you use.

---

## How it works in 30 seconds

```mermaid
flowchart LR
  A[You answer prompts] --> B[CLI renders templates]
  B --> C[".ai/ rules + skills"]
  C --> D[IDE-specific files]
  D --> E[Agent follows your standards]
```

1. **Run** `npx backend-ai-starter-recipes` (or `bare` if installed globally) and point at your project folder.  
2. **Get** a `.ai/` directory — your single source of truth — plus files your IDE understands.  
3. **Build** features: the agent reads those docs automatically, so you describe *what* you want, not *how* to format every PR.

::: tip Next step
Jump to [Try it in 2 minutes](/guide/4-usage#try-it-in-2-minutes), or continue with [The problem](/guide/1-the-problem).
:::

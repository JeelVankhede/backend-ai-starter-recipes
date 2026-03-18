# Brainstorm v1: Static AI Template

## Initial Concept
The original idea for this project was to establish a canonical set of AI behavior instructions for backend projects by placing a series of pre-written Markdown files (e.g., `AGENT.md`, `architecture.md`, `data-layer.md`) into a static `.ai/` directory in the user's repository.

## Rules Breakdown
1. **AGENT.md:** General principles (testing, interaction framework).
2. **architecture.md:** High-level layer separation (Controller → Service → Data).
3. **data-layer.md:** Database schema rules, migration expectations.
4. **api-patterns.md:** Validation and response structure.
5. **skills:** Actionable scripts (QA, ship, code review) read by AI to execute tasks.

## Why it was Pivoted
The static approach meant tying the rules heavily to a "one size fits all" tech stack. For instance, assuming Prisma or NestJS in static files meant developers using Drizzle or Express would have to heavily manually tweak the copied files.
This led exactly to the **v2 approach**: creating an interactive CLI tool using Handlebars templates that outputs fully tailored `.ai/` files specific to the user's framework, ORM, and validation pipeline.

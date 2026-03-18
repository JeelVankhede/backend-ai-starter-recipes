# backend-ai-starter-recipes — Task Tracker

## Planning
- [x] Research existing `.cursor/` setup (rules, skills, context)
- [x] Research gstack repository (skills, architecture, template system)
- [x] Brainstorm v1: Static template approach
- [x] Brainstorm v2: Interactive CLI generator pivot
- [x] Visual architecture document
- [x] Gap analysis: missing backend concerns
- [x] Write formal implementation plan
- [x] User approval on implementation plan

## Phase 1: Foundation (MVP)
- [x] Initialize Node.js project (package.json, tsconfig, tsup)
- [x] CLI scaffold (Commander.js entry point)
- [x] Prompt definitions (@inquirer/prompts)
- [x] Template context types (TypeScript interfaces)
- [x] Handlebars engine setup + custom helpers
- [x] File writer (read templates → render → write output)
- [x] Core templates: `agent.hbs`, 3-4 rules

## Phase 2: Full Templates
- [x] All 10 rule templates with framework/ORM conditionals
- [x] All 10 skill templates
- [x] 5 Handlebars partials
- [x] Context templates (domain-map, tech-stack)
- [x] Tracking template (efficiency)

## Phase 3: IDE Adapters
- [x] Cursor adapter (.md → .mdc with frontmatter)
- [x] Claude Code adapter (merge → CLAUDE.md + copy skills)
- [x] VS Code Copilot adapter (merge → single .md)
- [x] Antigravity adapter (skills → workflows)
- [x] Windsurf adapter (merge → .windsurfrules)

## Phase 4: Polish & Verification
- [x] Presets (--preset flag)
- [x] README.md with usage instructions
- [x] Test: run CLI with different combos, verify output
- [x] npx support (bin field in package.json)
- [x] Interactive output directory validation and confirmation

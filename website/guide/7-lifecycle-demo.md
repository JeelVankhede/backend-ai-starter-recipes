# Lifecycle in practice

> Introduced in Bare v1.2

This page walks through a real task end-to-end using the 7-stage Bare lifecycle. Every stage is **user-invoked** — the CLI generates the lifecycle files; you decide when to use them with your AI tool.

**Task:** Adding a billing webhook endpoint to a NestJS backend.  
**Stack:** NestJS, TypeScript, Prisma, PostgreSQL, class-validator, Swagger/OpenAPI, JWT.  
**IDE used in examples:** Cursor (adapt invocations for your tool — see each stage).

---

## 1. Task setup

You have a NestJS API with authentication and a Prisma data layer. The product team wants a `POST /webhooks/billing` endpoint that processes Stripe events, updates subscription status in the database, and emits domain events. You open your project in Cursor.

The generated lifecycle files sit in adapter-native paths. In Cursor they are at `.cursor/skills/think/SKILL.md`, `.cursor/skills/plan/SKILL.md`, and so on.

---

## 2. Think

**Goal:** Understand the task, the affected code surfaces, and any constraints before touching a line.

**How to invoke:**

- **Cursor:** type `/think` in Agent chat.
- **Claude Code:** run `/think` from the command palette.
- **Copilot:** open `copilot-instructions.md` and reference the `## Lifecycle: Think` section.
- **Windsurf:** the Think stage is in `.windsurf/rules/lifecycle-think.md`.
- **Antigravity:** open `.agents/workflows/think.md`.

**What the AI does at this stage:**

> Example AI output:
>
> ```
> Goal: add POST /webhooks/billing — Stripe event ingestion.
> Affected surfaces: src/webhooks/webhooks.module.ts (new),
>   src/webhooks/webhooks.controller.ts (new), src/webhooks/webhooks.service.ts (new),
>   src/billing/billing.service.ts (update subscription status),
>   prisma/schema.prisma (add SubscriptionEvent table).
> Constraints: Stripe sends raw body — must disable JSON parsing on this route.
>   Idempotency required: same event_id must not be processed twice.
>   Auth: no JWT guard on webhook route; use Stripe-Signature header verification instead.
> Open questions: should failed events be retried via a queue or dead-lettered?
>   Proposal: dead-letter to a PostgreSQL table for now; queue in a follow-up.
> ```

The AI lists what it will touch, flags constraints, and surfaces open questions **before** writing code. You review and correct any misunderstandings.

---

## 3. Plan

**Goal:** Produce a concrete implementation plan with affected files, module boundaries, and risk callouts.

**How to invoke:**

- **Cursor:** type `/plan` in Agent chat.
- **Claude Code:** run `/plan` from the command palette.
- **Copilot:** reference the `## Lifecycle: Plan` section in `copilot-instructions.md`.
- **Windsurf:** `.windsurf/rules/lifecycle-plan.md`.
- **Antigravity:** `.agents/workflows/plan.md`.

**What the AI produces:**

> Example AI output:
>
> ```
> Plan: Billing webhook — NestJS/Prisma
>
> Files to create:
>   src/webhooks/webhooks.module.ts     — imports BillingModule, RawBodyMiddleware
>   src/webhooks/webhooks.controller.ts — POST /webhooks/billing, @RawBody() guard
>   src/webhooks/webhooks.service.ts    — processStripeEvent(), idempotency check
>   src/webhooks/dto/stripe-event.dto.ts
>
> Files to modify:
>   src/billing/billing.service.ts      — updateSubscriptionStatus(customerId, status)
>   src/app.module.ts                   — register WebhooksModule
>   prisma/schema.prisma                — add StripeWebhookEvent model (idempotency log)
>
> Migration: add_stripe_webhook_events (non-destructive, new table)
>
> Risks:
>   - Raw body middleware conflicts with global JSON body parser — apply middleware only to /webhooks/*
>   - Stripe-Signature verification must happen before any body parsing
>
> Tests: unit test for processStripeEvent idempotency; e2e test for POST /webhooks/billing with mock signature.
> ```

You review the plan, correct scope, and give the go-ahead.

---

## 4. Build → Test → Ship (summarized)

With an approved plan, you invoke each stage in turn:

- **`/build`** — AI implements only the scoped files. You review diffs as it works.
- **`/review`** — AI checks correctness, API compatibility, data integrity, security (Stripe signature verification, no JWT leakage), and observability hooks.
- **`/test`** — AI runs `vitest run` or `jest`; reports coverage gaps and flags the e2e test for the webhook route.
- **`/ship`** — AI writes a commit message, lists changed files, and drafts a PR description with rollback notes (migration is non-destructive; rollback = drop the new table).

Each invocation is a discrete, user-triggered action.

---

## 5. Reflect

**Goal:** Capture what the lifecycle revealed — gaps in rules, follow-up tasks, template improvements.

**How to invoke:**

- **Cursor:** type `/reflect` in Agent chat.
- **Claude Code:** run `/reflect` from the command palette.
- **Copilot:** reference the `## Lifecycle: Reflect` section.
- **Windsurf:** `.windsurf/rules/lifecycle-reflect.md`.
- **Antigravity:** `.agents/workflows/reflect.md`.

**Example gap captured:**

> AI noted: no rule covers raw body middleware placement in NestJS when a global body parser is configured. During Build, it added the middleware correctly but flagged that the project's `architecture-api` rule doesn't mention raw body handling for webhook routes. Logged as a backlog item: "Add raw body middleware pattern to `architecture-api.md`."

This is the reflect loop in action — the lifecycle surfaces a real gap in the AI's operating instructions and gives you a concrete item to close.

---

## Key principles

1. **Every stage is user-invoked.** The CLI generates the lifecycle files; it does not run them or chain them automatically.
2. **You stay in control.** Review the Think output before letting the AI plan. Review the plan before letting it build.
3. **The lifecycle is not a script.** Skip stages that don't apply (e.g. `/review` before a trivial one-line change).
4. **Reflect closes the loop.** Gaps found during a task become rule improvements for the next task.

---

**Next:** [Recommended workflow](/guide/6-workflow) · [Understanding the output](/guide/5-the-output)

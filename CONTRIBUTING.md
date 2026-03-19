# Contributing

Thanks for helping improve **backend-ai-starter-recipes**.

## Branching

- **`main`** — release-ready code only.
- **Feature branches:** `feature/short-description` (e.g. `feature/add-preset-hono`).
- **Fix branches:** `fix/issue-or-topic` (e.g. `fix/preset-path-windows`).

Fork the repo, branch from `main`, then open a **Pull Request** against `main`.

## Before you open a PR

1. Run **`npm run build`** and ensure it succeeds.
2. If you touch **`website/`**, run **`npm run docs:build`** (also runs in CI).
3. If you change user-facing behavior, update **README.md** as needed.
4. Add or extend **JSDoc** on exported functions and non-obvious logic in `src/`.

## Commit messages

Clear, imperative messages are enough (optional: [Conventional Commits](https://www.conventionalcommits.org/)).

## Protecting `main` (maintainers)

- Block force pushes; **require a pull request** and **required status checks** before merging to `main`.
- After the first green CI run on `main`, add the exact check names shown in Actions (e.g. matrix job names).
- If you use **rulesets** or branch protection that restrict pushes, allow a **bypass** for the automation that runs [`.github/workflows/release.yml`](.github/workflows/release.yml) so it can push the version bump and release tags.

Only people with **Write** (or **Maintain**) should merge to `main`; keep that list small.

## Releases (maintainers)

Publishing is done via **Actions → Release** ([`release.yml`](.github/workflows/release.yml)): manual `workflow_dispatch`, **npm Trusted Publishing (OIDC)** — see [npm docs](https://docs.npmjs.com/trusted-publishers). No publish token in the repo.

---

## Questions

Open a [discussion or issue](https://github.com/JeelVankhede/backend-ai-starter-recipes/issues) on GitHub.

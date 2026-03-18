# Contributing

Thanks for helping improve **backend-ai-starter-recipes**.

## Branching

- **`main`** — release-ready code only.
- **Feature branches:** `feature/short-description` (e.g. `feature/add-preset-hono`).
- **Fix branches:** `fix/issue-or-topic` (e.g. `fix/preset-path-windows`).

Fork the repo, branch from `main`, then open a **Pull Request** against `main`.

## Before you open a PR

1. Run **`npm run build`** and ensure it succeeds.
2. If you change user-facing behavior, update **README.md** as needed.
3. Add or extend **JSDoc** on exported functions and non-obvious logic in `src/`.

## Commit messages

Clear, imperative messages are enough (optional: [Conventional Commits](https://www.conventionalcommits.org/)).

## Protecting `main` (maintainers)

In GitHub: **Settings → Branches → Add rule** for `main`:

- Enable **Block force pushes**.
- Optionally **Require a pull request before merging**.

**Status checks:** skip “require status checks” until CI is added (see repo roadmap).

## Questions

Open a [discussion or issue](https://github.com/JeelVankhede/backend-ai-starter-recipes/issues) on GitHub.

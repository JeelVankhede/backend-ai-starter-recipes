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
- **Require a pull request before merging**.
- **Require status checks to pass** — after the first green CI run on `main`, add the exact job names shown in the Actions run (e.g. **test (20)** and **test (22)** for the Node matrix). Both must pass before merge.
- Optionally require approvals or disallow bypassing the above.

Only people with **Write** (or **Maintain**) access can merge; keep that list small so only owners/maintainers can merge to `main`.

**Checklist (once CI has run at least once on `main`):** In **Settings → Branches →** rule for `main`, under "Require status checks", add **CI Node 20** and **CI Node 22** (or the exact names shown in the latest Actions run).

---

## Releases (maintainers)

Releases are **manual only**: no automatic publish on push or tag.

1. **Run the release workflow:** Actions → **Release** → **Run workflow**. Choose **bump** (`patch` / `minor` / `major`). The workflow will:
   - Run `npm ci`, build, and tests (same as CI).
   - Bump `package.json` version (no tag yet).
   - Commit the version bump to `main`, create an annotated tag `vX.Y.Z`, publish to npm, push commit and tag, then create a GitHub Release with generated notes.

2. **Required secret:** In **Settings → Secrets and variables → Actions**, add **`NPM_TOKEN`**:
   - **npm:** [Access Tokens](https://www.npmjs.com/) → **Generate New Token** → use a **Granular Access Token** with **Read and write** for package `backend-ai-starter-recipes`, or a classic **Automation** token (for 2FA-friendly publish from CI).
   - Paste the token value into the repo secret named `NPM_TOKEN`.

3. **Optional:** Add a GitHub **Environment** (e.g. `production`) for the release job and set required reviewers so only selected people can run the workflow.

## Questions

Open a [discussion or issue](https://github.com/JeelVankhede/backend-ai-starter-recipes/issues) on GitHub.

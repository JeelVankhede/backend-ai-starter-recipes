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

CI publishes with **[npm Trusted Publishing (OIDC)](https://docs.npmjs.com/trusted-publishers)** — **no `NPM_TOKEN`** in GitHub.

### One-time: npm ↔ GitHub

1. **Package must exist on npm** under your account (so it has a **Settings** page). If the name is new, create it once (e.g. `npm publish` from your machine while logged in, or any flow npm documents for claiming the name).
2. Open **[npm](https://www.npmjs.com/)** → **Packages** → **`backend-ai-starter-recipes`** → **Settings** → **Trusted publishing** (or **Trusted Publisher**).
3. Choose **GitHub Actions** and set fields to match **exactly** (case-sensitive):
   - **Repository:** `JeelVankhede/backend-ai-starter-recipes` (or your `owner/repo`).
   - **Workflow filename:** `release.yml` — must match the file under `.github/workflows/` (include `.yml`).
   - **Environment (optional):** only if you use a GitHub [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) for the release job; the name must match what you configure on GitHub **and** on npm.
4. Save on npm. npm does **not** validate the link until a real publish runs.

### What the workflow already does

- `permissions: id-token: write` (GitHub OIDC).
- **GitHub-hosted** `ubuntu-latest` (self-hosted runners are **not** supported for npm OIDC today).
- **Node 24** + **npm ≥ 11.5.1** before `npm publish` (required by [npm docs](https://docs.npmjs.com/trusted-publishers)).
- **`actions/setup-node` without `registry-url`** — if you set `registry-url: https://registry.npmjs.org`, `setup-node` writes a temp `.npmrc` with `_authToken=${NODE_AUTH_TOKEN}` and, when no secret is provided, sets `NODE_AUTH_TOKEN` to the literal placeholder `XXXXX-XXXXX-XXXXX-XXXXX`. npm then **never uses OIDC** and publish fails with **E404**. The default registry is already `registry.npmjs.org`, so omit `registry-url` for OIDC-only publish.
- The publish step **unsets** `NODE_AUTH_TOKEN` / `NPM_CONFIG_USERCONFIG` so no stale auth leaks in.

### How to verify the setup (before relying on it)

| Check | How |
|--------|-----|
| Workflow file name | On GitHub: `.github/workflows/release.yml` exists; on npm trusted publisher the filename is **`release.yml`** (not `release.yaml` unless you rename the file). |
| OIDC permission | In the workflow YAML, the `release` job includes `permissions: id-token: write`. |
| Runner | Workflow uses `runs-on: ubuntu-latest` (hosted). |
| npm / Node versions | In a failing run, expand **Use npm CLI with trusted publishing support** — `npm --version` should be **≥ 11.5.1**. |
| Repository visibility | **Public** repo is required if you want [provenance](https://docs.npmjs.com/generating-provenance-statements) (OIDC publish still works for public packages from a public repo). |
| Optional environment | If npm asks for a GitHub **Environment**, add to the `release` job: `environment: production` (example), create that environment on GitHub, and use the **same** name on npm. |

### After you think it’s configured

1. Run **Actions → Release → Run workflow** (e.g. bump `patch`).
2. If publish fails with **Unable to authenticate** / OIDC errors: re-check the table above; typos in **owner/repo** or **`release.yml`** are the usual cause.
3. **Do not use `npm whoami` in CI to test OIDC** — npm only exchanges the OIDC token during **`npm publish`**; `whoami` does not reflect trusted publishing ([npm docs](https://docs.npmjs.com/trusted-publishers#troubleshooting)).

### Optional hardening

- Add a GitHub **Environment** (e.g. `production`) on the `release` job and require approvers so only maintainers can run the workflow.
- After OIDC works, consider **Settings → Publishing access** on the package to restrict classic token publishing ([npm guidance](https://docs.npmjs.com/trusted-publishers)).

### Private npm dependencies

Trusted publishing only covers **`npm publish`**. If the package ever needs **private** `@scope` dependencies, use a **read-only** granular token **only** for `npm ci` (not for publish). This repo’s dependencies are public, so no token is needed for install.

## Questions

Open a [discussion or issue](https://github.com/JeelVankhede/backend-ai-starter-recipes/issues) on GitHub.

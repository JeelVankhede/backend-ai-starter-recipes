# Releasing & Publishing To npm

Releases use GitHub Actions and npm Trusted Publishing (OIDC). Do not publish from a local machine for normal releases.

## One-Time Setup

1. Configure npm Trusted Publishing for `backend-ai-starter-recipes` and the GitHub release workflow.
2. Ensure the GitHub `production` environment is available for the `release.yml` workflow.
3. If using a custom push token, configure `RELEASE_PUSH_TOKEN`; otherwise the workflow uses `github.token`.

## Pre-Release Verification

Run locally before triggering the workflow:

```bash
npm ci
npm run build
npm run check:dist
npm test
npm run docs:build
npm run test:pack
```

For generated-output changes, also run one preset smoke and inspect `.ai/`, Cursor, Claude Code, Copilot, and Windsurf output.

## Release Workflow

1. Merge the release-ready PR to `main`.
2. Open GitHub Actions -> `Release`.
3. Run the workflow manually and choose the bump:
   - `patch` for fixes.
   - `minor` for compatible generated-output additions.
   - `major` for breaking CLI or output contract changes.
4. The workflow verifies, bumps `package.json` and `package-lock.json`, commits the version, tags `vX.Y.Z`, publishes to npm through OIDC, pushes `main` and the tag, and creates a GitHub Release.

## v1.1 Guidance

Use `minor` for the lifecycle upgrade because it adds `.ai/lifecycle/*` while preserving existing commands, flags, presets, and output paths.

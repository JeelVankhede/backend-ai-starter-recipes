# Releasing & publishing to npm

## One-time setup

1. Create an [npmjs.com](https://www.npmjs.com) account and enable **2FA**.
2. Run **`npm login`** and verify with **`npm whoami`**.

## GitHub remote (first push)

If this folder is not yet on GitHub:

```bash
git init   # if needed
git remote add origin https://github.com/JeelVankhede/backend-ai-starter-recipes.git
git branch -M main
git add .
git commit -m "chore: initial open source release"
git push -u origin main
```

Create the **empty** repository `backend-ai-starter-recipes` under your GitHub user first, if it does not exist.

## Verify package contents

```bash
npm run build
npm pack
tar -tzf backend-ai-starter-recipes-*.tgz | head -40
```

Confirm **`dist/`**, **`templates/`**, and **`presets/`** are inside the tarball.

## Publish

```bash
npm version patch   # or minor / major
npm publish
```

Scoped packages need **`npm publish --access public`** once.

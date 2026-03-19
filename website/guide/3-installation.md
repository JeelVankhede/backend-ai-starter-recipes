# Installation

## Requirements

- **Node.js 20+** (matches the published package engines)
- **npm** (or another client that can run `npx`)

## Install options

::: tip Pick one
Use **npx** for a one-off run, **global install** for the short `bare` command, or **clone** if you are contributing to the generator itself.
:::

::: code-group

```bash [npx]
npx backend-ai-starter-recipes --help
```

```bash [Global bare]
npm install -g backend-ai-starter-recipes
bare --help
```

```bash [Clone / dev]
git clone https://github.com/JeelVankhede/backend-ai-starter-recipes.git
cd backend-ai-starter-recipes
npm ci
npm run build
node dist/cli.js --help
```

:::

## Verify

You should see CLI help with options such as `--output` and `--preset`:

```bash
npx backend-ai-starter-recipes --help
# or, after global install:
bare --help
```

::: details Troubleshooting
- **`command not found: bare`** — Install globally or use `npx backend-ai-starter-recipes` instead.  
- **Node version errors** — Run `node -v`; upgrade to 20+ if needed.  
- **Permission errors on global install** — Use a Node version manager or configure npm’s prefix; prefer `npx` if unsure.  
:::

---

**Next:** run it for real — [Usage](/guide/4-usage).

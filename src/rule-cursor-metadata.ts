/**
 * Per-rule Cursor `.mdc` frontmatter directive map for Bare v1.2.
 * Transcribed from blueprints' "Target Output Path" sections in
 * `engineering-research-repo/05-bare-ready/rules/<rule>.md`. The Cursor
 * adapter consumes this verbatim; rule description comes from the rendered
 * template's own frontmatter (set by WP-D from blueprint Purpose).
 *
 * Update protocol: when a Bare blueprint's Cursor directive changes,
 * update this map and re-run the build verification grep.
 *
 * @module rule-cursor-metadata
 */

export type CursorRuleMeta =
  | { alwaysApply: true }
  | { alwaysApply: false }
  | { globs: string[] };

export const RULE_CURSOR_METADATA: Record<string, CursorRuleMeta> = {
  'architecture-api': { alwaysApply: true },
  'auth-security': { alwaysApply: true },
  'data-layer-migrations': {
    globs: ['prisma/**/*', '**/*.repository.ts', '**/*.entity.ts', 'src/db/**/*'],
  },
  'errors-logging-observability': { alwaysApply: true },
  'integrations-async': {
    globs: ['src/external/**/*.ts'],
  },
  testing: {
    globs: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.test.ts'],
  },
  environment: {
    globs: ['.env*', 'src/config/**/*', '*.config.ts'],
  },
  'git-conventions': { alwaysApply: false },
  'pre-commit': { alwaysApply: false },
};

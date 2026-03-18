/**
 * Maps canonical `.ai/` output into Cursor `.cursor/rules/*.mdc` and skills layout.
 * @module adapters/cursor
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { FileWriter } from '../writer.js';

/**
 * Reads generated `.ai` files and writes Cursor-specific rule files with frontmatter.
 * @param outputDir - Target project root
 * @param writer - Writer scoped to the same project root
 */
export async function generateCursor(outputDir: string, writer: FileWriter) {
  const aiDir = path.join(outputDir, '.ai');

  try {
    const agentContent = await fs.readFile(path.join(aiDir, 'AGENT.md'), 'utf-8');
    await writer.write('.cursor/rules/index.mdc', addFrontmatter(agentContent, 'alwaysApply: true', 'Master Instructions'));

    const rulesDir = path.join(aiDir, 'rules');
    const ruleFiles = await fs.readdir(rulesDir);

    for (const file of ruleFiles) {
      if (!file.endsWith('.md')) continue;
      const content = await fs.readFile(path.join(rulesDir, file), 'utf-8');
      const basename = path.basename(file, '.md');

      let globs = '';
      if (basename === 'data-layer') globs = 'globs: prisma/**/*,**/*.repository.ts,**/*.entity.ts,src/db/**/*';
      else if (basename === 'api-patterns') globs = 'globs: **/*.dto.ts,**/*.controller.ts,**/*.route.ts';
      else if (basename === 'testing') globs = 'globs: **/*.spec.ts,**/*.e2e-spec.ts,**/*.test.ts';
      else if (basename === 'external-integrations') globs = 'globs: src/external/**/*.ts';
      else globs = 'alwaysApply: true';

      await writer.write(`.cursor/rules/${basename}.mdc`, addFrontmatter(content, globs, basename));
    }

    const skillsDir = path.join(aiDir, 'skills');
    try {
      const skills = await fs.readdir(skillsDir);
      for (const skill of skills) {
        const skillPath = path.join(skillsDir, skill);
        const stat = await fs.stat(skillPath);
        if (stat.isDirectory()) {
          const files = await fs.readdir(skillPath);
          for (const file of files) {
            const content = await fs.readFile(path.join(skillPath, file), 'utf-8');
            await writer.write(`.cursor/skills/${skill}/${file}`, content);
          }
        }
      }
    } catch (e) {
      /* no skills */
    }

    console.log(chalk.dim('  ↳ Generated Cursor configuration'));
  } catch (err) {
    console.error(chalk.red('Failed to generate Cursor config:'), err);
  }
}

/**
 * Wraps markdown in Cursor rule frontmatter (`description`, globs or alwaysApply).
 */
function addFrontmatter(content: string, rule: string, description: string) {
  return `---
description: ${description}
${rule}
---

${content.replace(/^---\n[\s\S]*?\n---\n+/, '')}`;
}

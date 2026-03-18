/**
 * Maps `.ai/skills/*/SKILL.md` into Antigravity `.agents/workflows/*.md`.
 * @module adapters/antigravity
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { FileWriter } from '../writer.js';

/**
 * One workflow file per skill directory containing `SKILL.md`.
 * @param outputDir - Target project root
 * @param writer - Writer for the project root
 */
export async function generateAntigravity(outputDir: string, writer: FileWriter) {
  const aiDir = path.join(outputDir, '.ai');
  const skillsDir = path.join(aiDir, 'skills');

  try {
    const skills = await fs.readdir(skillsDir);
    for (const skill of skills) {
      const skillPath = path.join(skillsDir, skill);
      const stat = await fs.stat(skillPath);
      if (stat.isDirectory()) {
        try {
          const content = await fs.readFile(path.join(skillPath, 'SKILL.md'), 'utf-8');
          await writer.write(`.agents/workflows/${skill}.md`, content);
        } catch (e) {
          /* skill without SKILL.md */
        }
      }
    }
    console.log(chalk.dim('  ↳ Generated Antigravity workflows'));
  } catch (err) {
    /* missing skills dir */
  }
}

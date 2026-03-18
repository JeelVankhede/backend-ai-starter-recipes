/**
 * Creates directories and writes generated files under a target project root.
 * @module writer
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

/**
 * Writes paths relative to a single output directory (the user's project folder).
 */
export class FileWriter {
  /**
   * @param outputDir - Absolute path to the project directory receiving `.ai/`, etc.
   */
  constructor(private outputDir: string) {}

  /**
   * Ensures parent dirs exist, then writes UTF-8 text (trimmed + trailing newline).
   * @param relativePath - Path relative to output (e.g. `.ai/AGENT.md`)
   * @param content - File body
   */
  async write(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.outputDir, relativePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content.trim() + '\n', 'utf-8');

    console.log(chalk.green('✓ Created:'), chalk.dim(relativePath));
  }

  /**
   * Removes a subdirectory under output (e.g. before a clean regen). Errors are ignored.
   * @param relativeDir - Directory relative to output root
   */
  async ensureCleanOutputDir(relativeDir: string) {
    const fullPath = path.join(this.outputDir, relativeDir);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
    } catch (e) {
      // Ignore missing path
    }
  }
}

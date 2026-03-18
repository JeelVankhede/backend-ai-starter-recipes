#!/usr/bin/env node
/**
 * CLI entrypoint for backend-ai-starter-recipes / bare.
 * Resolves output directory, loads preset or interactive prompts, renders templates,
 * and runs IDE adapters (Cursor, Claude Code, Copilot, Antigravity, Windsurf).
 * @module cli
 */

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { expandPath } from './path-utils.js';
import { askQuestions } from './prompts.js';
import { buildContext } from './context-builder.js';
import { TemplateEngine } from './engine.js';
import { FileWriter } from './writer.js';
import fs from 'fs/promises';
import { input, confirm } from '@inquirer/prompts';

// Adapters
import { generateCursor } from './adapters/cursor.js';
import { generateClaudeCode } from './adapters/claude-code.js';
import { generateVsCodeCopilot } from './adapters/vscode-copilot.js';
import { generateAntigravity } from './adapters/antigravity.js';
import { generateWindsurf } from './adapters/windsurf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRootDir = path.resolve(__dirname, '..');

const program = new Command();

program
  .name('backend-ai-starter-recipes')
  .description('Generate customized AI agent instructions for your backend project')
  .option('-o, --output <dir>', 'Output directory (skip prompt)')
  .option('-p, --preset <name>', 'Use a preset configuration')
  .parse(process.argv);

/**
 * Main generator flow: output dir → answers → `.ai/` tree → adapters.
 * @returns Promise that resolves on success; process exits on fatal error
 */
async function run() {
  const options = program.opts();

  console.log(chalk.bold.magenta('\n🤖 Backend AI Starter Recipes Component Generator'));
  console.log(chalk.dim('Let\'s customize your AI agent instructions.\n'));

  try {
    // 1. Resolve Output Directory
    let outputDir = '';

    if (options.output) {
      outputDir = path.resolve(process.cwd(), expandPath(options.output));
    } else {
      let validDir = false;
      while (!validDir) {
        const answerDir = await input({
          message: 'Where should we generate the files? (Output directory path)',
          default: './',
        });
        
        outputDir = path.resolve(process.cwd(), expandPath(answerDir));
        
        try {
          const stat = await fs.stat(outputDir);
          if (stat.isDirectory()) {
            const files = await fs.readdir(outputDir);
            // Hide hidden files like .git or .vscode when considering if empty
            const visibleFiles = files.filter(f => !f.startsWith('.'));
            
            if (visibleFiles.length > 0) {
              const proceed = await confirm({
                message: `Directory ${chalk.cyan(outputDir)} is not empty. Proceed anyway? (Files may be overwritten)`,
                default: true,
              });
              if (!proceed) {
                console.log(chalk.yellow('Let\'s choose a different location.'));
                continue;
              }
            }
            validDir = true;
          } else {
            console.log(chalk.red(`Path ${outputDir} exists but is not a directory.`));
          }
        } catch (e: any) {
          if (e.code === 'ENOENT') {
            const create = await confirm({
              message: `Directory ${chalk.cyan(outputDir)} does not exist. Create it?`,
              default: true,
            });
            if (create) {
              validDir = true;
            } else {
              console.log(chalk.yellow('Let\'s choose a different location.'));
            }
          } else {
            console.error(chalk.red(`Error checking path: ${e.message}`));
            process.exit(1);
          }
        }
      }
    }

    console.log(chalk.dim(`\nOutput path set to: ${outputDir}`));

    // 2. Load Preset or Ask Questions
    let answers;
    
    if (options.preset) {
      console.log(chalk.cyan(`\n📦 Loading preset: ${options.preset}...`));
      const presetPath = path.join(packageRootDir, 'presets', `${options.preset}.json`);
      try {
        const presetData = await fs.readFile(presetPath, 'utf-8');
        answers = JSON.parse(presetData);
      } catch (e) {
        console.error(chalk.red(`\n❌ Could not load preset "${options.preset}". Make sure it exists in the presets/ directory.`));
        process.exit(1);
      }
    } else {
      answers = await askQuestions();
    }

    const context = buildContext(answers);

    console.log(chalk.cyan('\n⚙️  Generating Canonical .ai/ Files...'));

    const engine = new TemplateEngine(packageRootDir);
    await engine.initialize();
    const writer = new FileWriter(outputDir);

    // 1. Agent
    await writer.write('.ai/AGENT.md', await engine.render('agent.hbs', context));

    // 2. Rules
    const rules = [
      'architecture',
      'api-patterns',
      'errors-logging-security',
      'external-integrations',
      'testing',
      'pre-commit',
      'async-patterns',
      'environment',
      'git-conventions'
    ];
    for (const rule of rules) {
      await writer.write(`.ai/rules/${rule}.md`, await engine.render(`rules/${rule}.hbs`, context));
    }
    if (context.hasPrisma || context.hasTypeORM || context.hasDrizzle || context.hasMikroORM || context.hasKnex) {
      await writer.write('.ai/rules/data-layer.md', await engine.render('rules/data-layer.hbs', context));
    }

    // 3. Skills
    if (context.skills.includes('plan-review')) {
      await writer.write('.ai/skills/plan-review/SKILL.md', await engine.render('skills/plan-review.hbs', context));
    }
    if (context.skills.includes('code-review')) {
      await writer.write('.ai/skills/code-review/SKILL.md', await engine.render('skills/code-review-skill.hbs', context));
      await writer.write('.ai/skills/code-review/checklist.md', await engine.render('skills/code-review-checklist.hbs', context));
    }
    if (context.skills.includes('qa')) {
      await writer.write('.ai/skills/qa/SKILL.md', await engine.render('skills/qa.hbs', context));
    }
    if (context.skills.includes('ship')) {
      await writer.write('.ai/skills/ship/SKILL.md', await engine.render('skills/ship.hbs', context));
    }
    if (context.skills.includes('document-release')) {
      await writer.write('.ai/skills/document-release/SKILL.md', await engine.render('skills/document-release.hbs', context));
    }
    if (context.skills.includes('retro')) {
      await writer.write('.ai/skills/retro/SKILL.md', await engine.render('skills/retro.hbs', context));
    }
    if (context.skills.includes('db-migration-review')) {
      await writer.write('.ai/skills/db-migration-review/SKILL.md', await engine.render('skills/db-migration-review.hbs', context));
    }
    if (context.skills.includes('api-contract-check')) {
      await writer.write('.ai/skills/api-contract-check/SKILL.md', await engine.render('skills/api-contract-check.hbs', context));
    }
    if (context.skills.includes('dependency-audit')) {
      await writer.write('.ai/skills/dependency-audit/SKILL.md', await engine.render('skills/dependency-audit.hbs', context));
    }

    // 4. Context & Tracking
    await writer.write('.ai/context/domain-map.md', await engine.render('context/domain-map.hbs', context));
    await writer.write('.ai/context/tech-stack.md', await engine.render('context/tech-stack.hbs', context));
    await writer.write('.ai/tracking/efficiency.md', await engine.render('tracking/efficiency.hbs', context));

    console.log(chalk.cyan('\n⚙️  Running IDE Adapters...'));
    if (context.ideTargets.includes('cursor')) await generateCursor(outputDir, writer);
    if (context.ideTargets.includes('claude-code')) await generateClaudeCode(outputDir, writer);
    if (context.ideTargets.includes('vscode-copilot')) await generateVsCodeCopilot(outputDir, writer);
    if (context.ideTargets.includes('antigravity')) await generateAntigravity(outputDir, writer);
    if (context.ideTargets.includes('windsurf')) await generateWindsurf(outputDir, writer);

    console.log(chalk.bold.green(`\n✨ Success! Output saved to: ${outputDir}`));
    
  } catch (err) {
    if (err instanceof Error && err.name === 'ExitPromptError') {
      console.log(chalk.yellow('\nPrompt cancelled by user.'));
      process.exit(0);
    }
    console.error(chalk.red('\n❌ Error generating templates:'), err);
    process.exit(1);
  }
}

run();

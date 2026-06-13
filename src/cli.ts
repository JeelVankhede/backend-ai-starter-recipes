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
import { removeFrontmatter } from './adapters/helpers.js';
import type { RenderedContext, WriteResult } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRootDir = path.resolve(__dirname, '..');

const LIFECYCLE_FILES = ['think', 'plan', 'build', 'review', 'test', 'ship', 'reflect'] as const;

const program = new Command();

program
  .name('backend-ai-starter-recipes')
  .description('Generate customized AI agent instructions for your backend project')
  .option('-o, --output <dir>', 'Output directory (skip prompt)')
  .option('-p, --preset <name>', 'Use a preset configuration')
  .parse(process.argv);

/**
 * Main generator flow: output dir → answers → in-memory RenderedContext → adapters.
 * @returns Promise that resolves on success; process exits on fatal error.
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

    console.log(chalk.cyan('\n⚙️  Rendering templates in memory...'));

    const engine = new TemplateEngine(packageRootDir);
    await engine.initialize();
    const writer = new FileWriter(outputDir);

    const agentBase = await engine.render('agent.hbs', context);
    const domainMap = await engine.render('context/domain-map.hbs', context);
    const techStack = await engine.render('context/tech-stack.hbs', context);

    const agent = [
      agentBase.trimEnd(),
      '',
      '---',
      '',
      '## Project Context',
      '',
      '### Domain Map',
      '',
      removeFrontmatter(domainMap).trim(),
      '',
      '### Tech Stack',
      '',
      removeFrontmatter(techStack).trim(),
      '',
    ].join('\n');

    const ruleNames = [
      'architecture-api',
      'auth-security',
      'errors-logging-observability',
      'integrations-async',
      'testing',
      'pre-commit',
      'environment',
      'git-conventions',
    ];
    const rules: Record<string, string> = {};
    for (const rule of ruleNames) {
      rules[rule] = await engine.render(`rules/${rule}.hbs`, context);
    }
    if (context.hasPrisma || context.hasTypeORM || context.hasDrizzle || context.hasMikroORM || context.hasKnex) {
      rules['data-layer-migrations'] = await engine.render('rules/data-layer-migrations.hbs', context);
    }

    const lifecycle: Record<string, string> = {};
    for (const stage of LIFECYCLE_FILES) {
      lifecycle[stage] = await engine.render(`lifecycle/${stage}.hbs`, context);
    }

    const rendered: RenderedContext = { agent, rules, lifecycle };

    console.log(chalk.cyan('\n⚙️  Running IDE Adapters...'));
    const results: WriteResult[] = [];
    if (context.ideTargets.includes('cursor')) results.push(...(await generateCursor(writer, rendered, context)));
    if (context.ideTargets.includes('claude-code'))
      results.push(...(await generateClaudeCode(writer, rendered, context)));
    if (context.ideTargets.includes('vscode-copilot'))
      results.push(...(await generateVsCodeCopilot(writer, rendered, context)));
    if (context.ideTargets.includes('antigravity'))
      results.push(...(await generateAntigravity(writer, rendered, context)));
    if (context.ideTargets.includes('windsurf'))
      results.push(...(await generateWindsurf(writer, rendered, context)));

    console.log(chalk.bold.green(`\n✨ Success! Output saved to: ${outputDir}`));
    console.log(chalk.dim(`   ${results.length} files written.`));

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

/**
 * Handlebars-based template loading, partials, and rendering for `.ai` artifacts.
 * @module engine
 */
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { TemplateContext } from './types.js';

/**
 * Compiles `.hbs` templates under `templates/` with shared partials and helpers.
 */
export class TemplateEngine {
  private templatesDir: string;
  private partialsDir: string;

  /**
   * @param baseDir - Package root (parent of `templates/`)
   */
  constructor(baseDir: string) {
    this.templatesDir = path.join(baseDir, 'templates');
    this.partialsDir = path.join(this.templatesDir, 'partials');
    this.registerHelpers();
  }

  /**
   * Registers all `templates/partials/*.hbs` with Handlebars.
   */
  async initialize() {
    await this.registerPartials();
  }

  private registerHelpers() {
    Handlebars.registerHelper('eq', (a, b) => a === b);
    Handlebars.registerHelper('neq', (a, b) => a !== b);
    Handlebars.registerHelper('includes', (array: any[], item: any) => array && array.includes(item));
    Handlebars.registerHelper('or', (...args) => {
      const booleanArgs = args.slice(0, -1);
      return booleanArgs.some(Boolean);
    });
    Handlebars.registerHelper('and', (...args) => {
      const booleanArgs = args.slice(0, -1);
      return booleanArgs.every(Boolean);
    });
  }

  private async registerPartials() {
    try {
      const files = await fs.readdir(this.partialsDir);
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const content = await fs.readFile(path.join(this.partialsDir, file), 'utf-8');
          const name = path.basename(file, '.hbs');
          Handlebars.registerPartial(name, content);
        }
      }
    } catch (e) {
      console.warn('Could not load partials:', e);
    }
  }

  /**
   * Renders a template relative to `templates/` (e.g. `agent.hbs`, `rules/architecture.hbs`).
   * @param templatePath - Path under `templates/`
   * @param context - Merged user answers + derived flags for Handlebars
   * @returns Rendered markdown (or other text) without HTML escaping
   */
  async render(templatePath: string, context: TemplateContext): Promise<string> {
    const fullPath = path.join(this.templatesDir, templatePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const template = Handlebars.compile(content, { noEscape: true });
    return template(context);
  }
}

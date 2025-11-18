import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { createTwoFilesPatch } from 'diff';
import Stripe from 'stripe';
import { StackManifest } from '@fillet/core';

export default class Diff extends Command {
  static description = 'Compare the deployed stack with the local definition';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --app ./infra/main.ts',
  ];

  static flags = {
    app: Flags.string({
      char: 'a',
      description: 'Path to the app file that defines your stack',
      default: './fillet.ts',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Diff);

    this.log('Computing diff...');
    this.log('');

    const appPath = path.resolve(process.cwd(), flags.app);

    if (!fs.existsSync(appPath)) {
      this.error(`App file not found: ${appPath}`);
    }

    try {
      // Load and synthesize the stack
      const appModule = require(appPath);
      const stack = appModule.default || appModule.stack || appModule;

      if (!stack || typeof stack.synth !== 'function') {
        this.error('App must export a Stack instance with a synth() method');
      }

      const manifest: StackManifest = stack.synth();

      // Get Stripe API key
      const apiKey = stack.apiKey || process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        this.error('Stripe API key not found. Set STRIPE_SECRET_KEY environment variable.');
      }

      const stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });

      // Fetch current state from Stripe
      this.log(chalk.bold(`Stack: ${manifest.stackId}`));
      this.log('');

      let hasChanges = false;

      for (const resource of manifest.resources) {
        const current = await this.fetchCurrentResource(stripe, resource);

        if (!current) {
          this.log(chalk.green(`[+] ${resource.path} [${resource.type}]`));
          this.log(chalk.gray('    Will be created'));
          this.log('');
          hasChanges = true;
          continue;
        }

        // Compare properties
        const desired = JSON.stringify(resource.properties, null, 2);
        const existing = JSON.stringify(this.normalizeResource(current), null, 2);

        if (desired !== existing) {
          this.log(chalk.yellow(`[~] ${resource.path} [${resource.type}]`));
          const patch = createTwoFilesPatch(
            'current',
            'desired',
            existing,
            desired,
            '',
            ''
          );
          this.log(this.colorDiff(patch));
          this.log('');
          hasChanges = true;
        }
      }

      if (!hasChanges) {
        this.log(chalk.gray('No changes detected'));
      }
    } catch (error: any) {
      this.error(`Diff failed: ${error.message}`);
    }
  }

  private async fetchCurrentResource(stripe: Stripe, resource: any): Promise<any> {
    try {
      switch (resource.type) {
        case 'Stripe::Product': {
          const products = await stripe.products.list({ limit: 100 });
          return products.data.find(p => p.metadata?.fillet_id === resource.id);
        }
        case 'Stripe::Price': {
          const prices = await stripe.prices.list({ limit: 100 });
          return prices.data.find(p => p.metadata?.fillet_id === resource.id);
        }
        case 'Stripe::Coupon': {
          return await stripe.coupons.retrieve(resource.id);
        }
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  private normalizeResource(resource: any): any {
    // Extract only the properties we care about for comparison
    const normalized: any = {};

    if (resource.name) normalized.name = resource.name;
    if (resource.description) normalized.description = resource.description;
    if (resource.active !== undefined) normalized.active = resource.active;
    if (resource.currency) normalized.currency = resource.currency;
    if (resource.unit_amount !== undefined) normalized.unit_amount = resource.unit_amount;
    if (resource.recurring) normalized.recurring = resource.recurring;

    return normalized;
  }

  private colorDiff(patch: string): string {
    return patch.split('\n').map(line => {
      if (line.startsWith('+')) return chalk.green(line);
      if (line.startsWith('-')) return chalk.red(line);
      if (line.startsWith('@@')) return chalk.cyan(line);
      return chalk.gray(line);
    }).join('\n');
  }
}

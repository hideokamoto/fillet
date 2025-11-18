import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { StripeDeployer } from '../engine/deployer';
import { StackManifest } from '@fillet/core';

export default class Destroy extends Command {
  static description = 'Destroy all resources in the stack';

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
    force: Flags.boolean({
      char: 'f',
      description: 'Skip confirmation prompt',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Destroy);

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

      this.log(chalk.bold.yellow(`⚠️  You are about to destroy stack: ${manifest.stackId}`));
      this.log('');
      this.log('The following resources will be deleted:');
      for (const resource of manifest.resources) {
        this.log(chalk.red(`  - ${resource.path} [${resource.type}]`));
      }
      this.log('');

      if (!flags.force) {
        this.log(chalk.bold('This action cannot be undone!'));
        this.log('To proceed, run with --force flag');
        return;
      }

      // Get Stripe API key
      const apiKey = stack.apiKey || process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        this.error('Stripe API key not found. Set STRIPE_SECRET_KEY environment variable.');
      }

      this.log('Destroying resources...');
      this.log('');

      const deployer = new StripeDeployer(apiKey);
      await deployer.destroy(manifest);

      this.log(chalk.bold.green('✓ Stack destroyed'));
    } catch (error: any) {
      this.error(`Destroy failed: ${error.message}`);
    }
  }
}

import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';

export default class Hello extends Command {
  static description = 'Say hello';

  static examples = [
    `$ oex hello --to friend --from oclif
hello friend from oclif!
`,
  ];

  static flags = {
    from: Flags.string({
      char: 'f',
      description: 'Person who is saying hello',
      required: true,
    }),
    to: Flags.string({
      char: 't',
      description: 'Person to say hello to',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Hello);

    this.log(
      `hello ${chalk.yellow(flags.to)} from ${chalk.yellow(flags.from)}!`
    );
  }
}

import { Command, Flags } from '@oclif/core';
import { setConfig } from '../../libs/conf';

export default class Configure extends Command {
  static description = 'configure the s3 cli';

  static examples = [
    's3 configure --accessId 1234 --secretKey jkak11 --bucket mybucket',
    's3 configure --accessId 1234 --secretKey jkak11 --bucket mybucket --profile myprofile',
  ];

  static flags = {
    accessId: Flags.string({
      char: 'i',
      description: 'AWS access key id',
      required: true,
    }),
    secretKey: Flags.string({
      char: 'k',
      description: 'AWS secret access key',
      required: true,
    }),
    bucket: Flags.string({
      char: 'b',
      description: 'AWS secret access key',
      required: true,
    }),
    profile: Flags.string({
      char: 'p',
      description: 'AWS secret access key',
      required: false,
      default: 'default',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Configure);
    const profileConfiguration = {
      accessId: flags.accessId,
      secretKey: flags.secretKey,
      bucket: flags.bucket,
    };

    try {
      setConfig(flags.profile, profileConfiguration);
      this.log(
        `Saved the connection details for the profile ${flags.profile}!`
      );
    } catch (error) {
      this.error('Error while saving the connection details');
    }
  }
}

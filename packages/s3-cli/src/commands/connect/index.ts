import { Command, Flags } from '@oclif/core';
import { getConfig } from '../../libs/conf';
import AwsS3 from '../../libs/s3';

export default class Connect extends Command {
  static description = 'describe the command here';

  static examples = [
    's3 connect',
    's3 connect --bucket myBucket',
    's3 connect --bucket myBucket --profile myProfile',
  ];

  static flags = {
    bucket: Flags.string({
      char: 'b',
      description: 's3 bucket name',
      required: false,
    }),
    profile: Flags.string({
      char: 'p',
      description: 'AWS profile name',
      default: 'default',
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Connect);
    const profileName = flags.profile;
    const profileConfig = getConfig(profileName);

    if (profileConfig) {
      const bucketName = flags.bucket ?? profileConfig.bucket;
      const accessId = profileConfig.accessId;
      const accessKey = profileConfig.secretKey;

      this.log(
        `Checking access to the bucket ${bucketName} for the configured profile`
      );

      try {
        const s3 = new AwsS3(accessId, accessKey);
        const hasAccess = await s3.checkAccess(bucketName);
        this.log(`${JSON.stringify(hasAccess, null, 2)}`);
      } catch (error) {
        this.error(`Error while connecting to the s3 bucket ${bucketName}`);
      }
    } else {
      this.log(
        `No aws profile configured, please run the command s3 configure --help for more details`
      );
    }
  }
}

import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import AwsS3 from '../../libs/s3';
import { getConfig } from '../../libs/conf';

export default class List extends Command {
  static description = 'List object in the s3 bucket';

  static examples = [`$ s3 list --path --recursive`];

  static flags = {
    profile: Flags.string({
      char: 'b',
      description: 's3 profile name',
      required: false,
    }),
    bucket: Flags.string({
      char: 'b',
      description: 's3 bucket to connect',
      required: false,
    }),
    path: Flags.string({
      char: 'p',
      description: 'Path to list objects from',
      required: false,
    }),
    recursive: Flags.boolean({
      char: 'r',
      description: 'Recursively list objects in the subdirectories',
      required: false,
      dependsOn: ['path'],
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(List);
    const { bucket, path = '', recursive } = flags;
    const profileName = flags.profile;
    const profileConfig = getConfig(profileName);

    if (profileConfig) {
      const bucketName = flags.bucket ?? profileConfig.bucket;
      const accessId = profileConfig.accessId;
      const accessKey = profileConfig.secretKey;

      try {
        this.log(
          `Listing all the files matching the path ${
            path ? chalk.yellow(path) : './'
          } from bucket ${chalk.yellow(bucketName)}!`
        );

        const s3 = new AwsS3(accessId, accessKey);

        const listParams = {
          Bucket: bucketName,
          Prefix: path,
        };

        const s3ObjectsList = [];
        for await (const s3Objects of s3.getObjectList(listParams)) {
          s3ObjectsList.push(...s3Objects.Contents);
        }

        s3ObjectsList.forEach((s3Object, index) => {
          const { Key } = s3Object;
          this.log(`${chalk.yellow(index + 1)}. ${Key}`);
        });
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

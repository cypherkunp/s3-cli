import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { getObjectList } from '../../libs/s3';

const BUCKET_NAME = '';

export default class List extends Command {
  static description = 'List object in the s3 bucket';

  static examples = [
    `$ s3 list --path --recursive
    `,
  ];

  static flags = {
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
    const bucketName = bucket || BUCKET_NAME;

    this.log(
      `Listing all the files matching the path ${
        path ? chalk.yellow(path) : './'
      } from bucket ${chalk.yellow(bucketName)}!`
    );
    const listParams = {
      Bucket: bucketName,
      Prefix: path,
    };

    const s3ObjectsList = [];
    for await (const s3Objects of getObjectList(listParams)) {
      s3ObjectsList.push(...s3Objects.Contents);
    }

    s3ObjectsList.forEach((s3Object, index) => {
      const { Key } = s3Object;
      this.log(`${chalk.yellow(index + 1)}. ${Key}`);
    });
  }
}

import S3 from 'aws-sdk/clients/s3';

interface ObjectListType {
  Bucket: string;
  Prefix: string;
  ContinuationToken?: string;
}

class AwsS3 {
  s3: S3;

  constructor(accessId, accessKey) {
    if (!accessId && !accessKey) {
      throw Error('Invalid accessKey or accessId');
    }

    this.s3 = new S3({
      credentials: {
        accessKeyId: accessId,
        secretAccessKey: accessKey,
      },
    });
  }

  async *getObjectList(params: ObjectListType) {
    params = { ...params };
    do {
      const data = await this.s3.listObjectsV2(params).promise();
      params.ContinuationToken = data.NextContinuationToken;
      yield data;
    } while (params.ContinuationToken);
  }

  async checkAccess(bucketName: string) {
    try {
      const params = {
        Bucket: bucketName,
      };
      const headBucketResponse = await this.s3.headBucket(params).promise();
      return headBucketResponse;
    } catch (error) {
      throw error;
    }
  }
}

export default AwsS3;

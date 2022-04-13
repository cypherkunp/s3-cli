import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

interface ObjectListType {
  Bucket: string;
  Prefix: string;
  ContinuationToken?: string;
}

export async function* getObjectList(params: ObjectListType) {
  params = { ...params };
  do {
    const data = await s3.listObjectsV2(params).promise();
    params.ContinuationToken = data.NextContinuationToken;
    yield data;
  } while (params.ContinuationToken);
}

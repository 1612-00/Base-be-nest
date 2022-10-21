import { getConfig } from './../../modules/config/config.provider';
import { s3ProviderForAdmin } from './uploadFiles.provider';
import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import { uploadFileS3ForAdmin } from './uploadFiles.const';

@Injectable()
export class S3UploadFileService {
  private bucket: string;
  constructor(bucketName: string, private configService: ConfigService) {
    this.bucket = bucketName;
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3({
      accessKeyId: this.configService.get('S3_ACCESSKEY'),
      secretAccessKey: this.configService.get('S3_SECRETKEY'),
      region: 'ap-southeast-1',
      endpoint: this.configService.get('S3_HOST'),
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: 'v4',
    });
    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.bucket,
          Body: dataBuffer,
          Key: `${uuid()}`,
        })
        .promise();
      return uploadResult;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deletePublicFile(keyFiles: string) {
    const s3 = new S3({
      accessKeyId: this.configService.get('S3_ACCESSKEY'),
      secretAccessKey: this.configService.get('S3_SECRETKEY'),
      region: 'ap-southeast-1',
      endpoint: this.configService.get('S3_HOST'),
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: 'v4',
    });
    await s3
      .deleteObject({
        Bucket: this.bucket,
        Key: keyFiles,
      })
      .promise();
  }

  getIdPublicFile(urlFile: string) {
    const pathReplace =
      this.configService.get('S3_HOST') +
      '/' +
      this.configService.get('S3_HOST') +
      '/';
    return urlFile.replace(pathReplace, '');
  }
}

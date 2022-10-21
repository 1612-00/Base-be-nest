import { ConfigService } from '@nestjs/config';
import { S3UploadFileService } from 'src/shared/uploadServices/uploadFiles.service';
import { getConfig } from 'src/modules/config/config.provider';
import { uploadFileS3ForAdmin, uploadFileS3ForClient } from './uploadFiles.const';
import { Provider } from '@nestjs/common';

export const s3ProviderForAdmin : Provider = {
  provide: uploadFileS3ForAdmin,
  useFactory: (config:ConfigService) => {
    return new S3UploadFileService(config.get('S3_UP_FOLDER_FOR_ADMIN')!,config);
  },
 inject: [ConfigService],
};


export const s3ProviderForClient : Provider = {
  provide: uploadFileS3ForClient,
  useFactory: (config:ConfigService) => {
    //const s3BucketsName =  <string>getConfig().get('S3_UP_FOLDER_FOR_USER') ;
    return new S3UploadFileService(config.get('S3_UP_FOLDER_FOR_ADMIN')!,config);
  },
 inject: [ConfigService],
};
  
import { s3ProviderForAdmin, s3ProviderForClient, } from './uploadFiles.provider';
import { Module } from "@nestjs/common";
import { S3UploadFileService } from './uploadFiles.service';
import { uploadFileS3ForClient, uploadFileS3ForAdmin } from './uploadFiles.const';
import ConfigsModule from 'src/modules/config/config.module';


@Module({
    imports:[ConfigsModule],
    providers: [s3ProviderForAdmin,s3ProviderForClient],
    exports: [s3ProviderForAdmin,s3ProviderForClient],
  })
export class UploadFileModule{}
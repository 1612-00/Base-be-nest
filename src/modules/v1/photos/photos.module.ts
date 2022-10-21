import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileModule } from '../../../shared/uploadServices/uploadFiles.module';
import { FoldersModule } from '../folders/folders.module';
import { PhotosController } from './photos.controller';
import { PhotosRepository } from './photos.repository';
import { PhotosService } from './photos.service';
import { Photo, PhotoSchema } from './schemas/photos.schema';

@Module({
  controllers: [PhotosController],
  providers: [PhotosService, PhotosRepository],
  imports: [
    FoldersModule,
    UploadFileModule,

    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  exports: [PhotosService, PhotosRepository],
})
export class PhotosModule {}

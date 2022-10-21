import { UploadFileModule } from './../../../shared/uploadServices/uploadFiles.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from '../admin/news/news.module';
import { PhotosModule } from '../photos/photos.module';
import { HomeConfigController } from './home-config.controller';
import { HomeConfigRepository } from './home-config.repository';
import { HomeConfigService } from './home-config.service';
import { HomeConfig, HomeConfigSchema } from './schemas/home-config.schema';
import { FoldersModule } from '../folders/folders.module';

@Module({
  controllers: [HomeConfigController],
  providers: [HomeConfigService, HomeConfigRepository],
  imports: [
    UploadFileModule,
    PhotosModule,
    FoldersModule,
    forwardRef(() => NewsModule),

    MongooseModule.forFeature([
      {
        name: HomeConfig.name,
        schema: HomeConfigSchema,
      },
    ]),
  ],
  exports: [HomeConfigService, HomeConfigRepository],
})
export class HomeConfigModule {}

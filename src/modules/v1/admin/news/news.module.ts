import { forwardRef, Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { NEWS_CONST } from './news.const';
import { UploadFileModule } from 'src/shared/uploadServices/uploadFiles.module';
import { newsSchema } from './schema/news.schema';
import { PhotosModule } from '@v1/photos/photos.module';
import { HomeConfigModule } from '../../home-config/home-config.module';

@Module({
  imports: [
    forwardRef(() => HomeConfigModule),

    MongooseModule.forFeature([
      {
        name: NEWS_CONST.MODEL_NAME,
        schema: newsSchema,
      },
    ]),
    UploadFileModule,
    PhotosModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
  exports: [NewsService, NewsRepository],
})
export class NewsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileModule } from '../../../shared/uploadServices/uploadFiles.module';
import { MembersModule } from '../admin/members/members.module';
import { FoldersModule } from '../folders/folders.module';
import { PhotosModule } from '../photos/photos.module';
import { AboutUsController } from './about-us.controller';
import { AboutUsRepository } from './about-us.repository';
import { AboutUsService } from './about-us.service';
import { AboutUs, AboutUsSchema } from './schemas/about-us.schema';

@Module({
  controllers: [AboutUsController],
  providers: [AboutUsService, AboutUsRepository],
  imports: [
    forwardRef(() => MembersModule),
    PhotosModule,
    FoldersModule,
    UploadFileModule,

    MongooseModule.forFeature([{ name: AboutUs.name, schema: AboutUsSchema }]),
  ],
  exports: [AboutUsService, AboutUsRepository],
})
export class AboutUsModule {}

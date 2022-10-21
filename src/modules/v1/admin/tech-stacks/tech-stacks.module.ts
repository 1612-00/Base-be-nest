import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileModule } from '../../../../shared/uploadServices/uploadFiles.module';
import { FoldersModule } from '../../folders/folders.module';
import { PhotosModule } from '../../photos/photos.module';
import { TechStackGroupModule } from '../techStackGroup/techStackGroup.module';
import { TechStack, TechStackSchema } from './schemas/tech-stacks.schema';
import { TechStacksController } from './tech-stacks.controller';
import { TechStacksRepository } from './tech-stacks.repository';
import { TechStacksService } from './tech-stacks.service';

@Module({
  controllers: [TechStacksController],
  providers: [TechStacksService, TechStacksRepository],
  imports: [
    TechStackGroupModule,
    PhotosModule,
    UploadFileModule,
    FoldersModule,

    MongooseModule.forFeature([
      {
        name: TechStack.name,
        schema: TechStackSchema,
      },
    ]),
  ],
  exports: [TechStacksService, TechStacksRepository],
})
export class TechStacksModule {}

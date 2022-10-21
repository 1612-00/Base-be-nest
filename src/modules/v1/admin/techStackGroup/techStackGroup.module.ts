import { TECH_STACK_GROUP_CONST } from './techStackGroup.const';
import { MongooseModule } from '@nestjs/mongoose';
import { TechStackRepository } from './techStackGroup.repository';
import { Module } from '@nestjs/common';
import { TechStackGroupSchema } from './schemas/techStackGroup.schema';
import { TechStackGroupService } from './techStackGroup.service';
import { TechStackGroupController } from './techStackGroup.controller';
import { UploadFileModule } from 'src/shared/uploadServices/uploadFiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TECH_STACK_GROUP_CONST.MODEL_NAME,
        schema: TechStackGroupSchema,
      },
    ]),
    UploadFileModule,
  ],
  providers: [TechStackRepository, TechStackGroupService],
  controllers: [TechStackGroupController],
  exports: [TechStackRepository, TechStackGroupService],
})
export class TechStackGroupModule {}

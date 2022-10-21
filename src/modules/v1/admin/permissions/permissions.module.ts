import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PERMISSIONS_CONST } from './permissions.const';
import { PermissionsController } from './permissions.controller';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';
import { PermissionsSchema } from './schemas/permissions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PERMISSIONS_CONST.MODEL_NAME,
        schema: PermissionsSchema,
      },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}

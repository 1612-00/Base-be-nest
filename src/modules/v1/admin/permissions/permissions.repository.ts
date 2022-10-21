import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from 'src/modules/base/base.repository';
import { PERMISSIONS_CONST } from './permissions.const';
import { PermissionsDocument } from './schemas/permissions.schema';

@Injectable()
export class PermissionsRepository extends Repository<PermissionsDocument> {
  constructor(
    @InjectModel(PERMISSIONS_CONST.MODEL_NAME)
    private permissionModel: SoftDeleteModel<PermissionsDocument>,
  ) {
    super(permissionModel);
  }
}

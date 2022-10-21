import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { DefineRoute, DefineRouteDocument } from './schema/define-route.schema';

@Injectable()
export class DefineRouteRepository extends Repository<DefineRouteDocument> {
  constructor(
    @InjectModel(DefineRoute.name)
    private defineRouteModel: SoftDeleteModel<DefineRouteDocument>,
  ) {
    super(defineRouteModel);
  }
}

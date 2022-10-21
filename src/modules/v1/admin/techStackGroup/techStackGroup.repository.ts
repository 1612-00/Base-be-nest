import { TECH_STACK_GROUP_CONST } from './techStackGroup.const';
import { Repository } from './../../../base/base.repository';
import { InjectModel } from "@nestjs/mongoose";
import { TechStackGroupDocument } from './schemas/techStackGroup.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export class TechStackRepository extends Repository<TechStackGroupDocument>{
    constructor(@InjectModel(TECH_STACK_GROUP_CONST.MODEL_NAME) private readonly techStackGroupModel: SoftDeleteModel<TechStackGroupDocument>) {
        super(techStackGroupModel);      
    }
}
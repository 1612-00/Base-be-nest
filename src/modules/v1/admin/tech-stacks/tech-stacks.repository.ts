import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { TechStack, TechStackDocument } from './schemas/tech-stacks.schema';

@Injectable()
export class TechStacksRepository extends Repository<TechStackDocument> {
  constructor(
    @InjectModel(TechStack.name)
    private techStackModel: SoftDeleteModel<TechStackDocument>,
  ) {
    super(techStackModel);
  }

  async getAllTechStack() {
    return this.techStackModel
      .find({ isDeleted: false })
      .populate('group', 'name')
      .populate('photo', 'link');
  }

  async getTechStackById(id: string | Types.ObjectId) {
    return this.techStackModel
      .findById(id)
      .populate('group', 'name')
      .populate('photo', 'link');
  }
}

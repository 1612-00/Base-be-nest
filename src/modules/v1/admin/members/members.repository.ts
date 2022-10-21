import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { Member, MemberDocument } from './schemas/members.schema';

@Injectable()
export class MembersRepository extends Repository<MemberDocument> {
  constructor(
    @InjectModel(Member.name)
    private memberModel: SoftDeleteModel<MemberDocument>,
  ) {
    super(memberModel);
  }

  async getAllMembers() {
    return this.memberModel
      .find({ isDeleted: false })
      .populate('team', 'name')
      .populate('photo', 'link');
  }

  async getMemberById(id: string | Types.ObjectId) {
    return this.memberModel
      .findOne({ _id: id, isDeleted: false })
      .populate('team', 'name')
      .populate('photo', 'link');
  }

  async getNoMembers() {
    return this.memberModel.countDocuments({ isDeleted: false });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { Project, ProjectDocument } from './schemas/projects.schema';

@Injectable()
export class ProjectsRepository extends Repository<ProjectDocument> {
  constructor(
    @InjectModel(Project.name)
    private projectModel: SoftDeleteModel<ProjectDocument>,
  ) {
    super(projectModel);
  }

  async getAllProjects() {
    return (
      this.projectModel
        .find({ isDeleted: false })
        .populate('photo', 'link')
        // .populate('memberList', { name: 1, photo: 1 })
        .populate({
          path: 'memberList',
          select: ['name', 'photo'],
          populate: {
            path: 'photo',
            select: 'link',
          },
        })
    );
  }

  async getProjectById(projectId: string | Types.ObjectId) {
    return this.projectModel
      .findOne({ _id: projectId, isDeleted: false })
      .lean()
      .populate('photo', 'link')
      .populate({
        path: 'memberList',
        select: ['name', 'photo'],
        populate: {
          path: 'photo',
          select: 'link',
        },
      });
  }

  async getProjectByName(name: string) {
    return this.projectModel.find({ name: name, isDeleted: false });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../base/base.repository';
import { FolderDocument, Folder } from './schemas/folders.schema';

@Injectable()
export class FolderRepository extends Repository<FolderDocument> {
  constructor(
    @InjectModel(Folder.name)
    private folderModel: SoftDeleteModel<FolderDocument>,
  ) {
    super(folderModel);
  }

  async getAllFolders() {
    return this.folderModel
      .find({ isDeleted: false })
      .populate('parentId', 'name');
  }

  async getFolderById(id: string | Types.ObjectId) {
    return this.folderModel
      .findOne({ _id: id, isDeleted: false })
      .populate('parentId', 'name');
  }

  async getOneFolderByName(name: string) {
    return this.folderModel.findOne({ name: name, isDeleted: false });
  }
}

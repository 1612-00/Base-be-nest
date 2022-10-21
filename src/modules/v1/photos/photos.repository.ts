import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { MessageClientCode } from '../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../common/response';
import HttpStatusCode from '../../../shared/statusCode.enum';
import { Repository } from '../../base/base.repository';
import { Photo, PhotoDocument } from './schemas/photos.schema';

@Injectable()
export class PhotosRepository extends Repository<PhotoDocument> {
  constructor(
    @InjectModel(Photo.name) private photoModel: SoftDeleteModel<PhotoDocument>,
  ) {
    super(photoModel);
  }

  async getAllPhotos() {
    return this.photoModel
      .find({ isDeleted: false })
      .populate('folder', 'name')
      .populate('comments', 'content');
  }

  async getPhotoById(id: string | Types.ObjectId) {
    return this.photoModel
      .findOne({ _id: id, isDeleted: false })
      .populate('folder', 'name')
      .populate('comments', ['level', 'parentId', 'content']);
  }

  async updateByConditions(id: string | Types.ObjectId, conditions: object) {
    return this.photoModel.updateOne({ _id: id }, { $set: conditions });
  }

  async getPhotosQuantity(photoArray: string[]) {
    return this.photoModel.countDocuments({ _id: { $in: photoArray } });
  }

  async getPhotosInFolder(folderId: string | Types.ObjectId) {
    return this.photoModel.find({ folder: folderId });
  }
}

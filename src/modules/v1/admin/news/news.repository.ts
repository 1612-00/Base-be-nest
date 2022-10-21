import { Photo } from './../../photos/schemas/photos.schema';
import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { NEWS_CONST } from './news.const';
import { newsDocument } from './schema/news.schema';

@Injectable()
export class NewsRepository extends Repository<newsDocument> {
  constructor(
    @InjectModel(NEWS_CONST.MODEL_NAME)
    private newsModel: SoftDeleteModel<newsDocument>,
  ) {
    super(newsModel);
  }
  async getByIdDetails(id: string) {
    return await this.newsModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate('mainImg')
      .populate('img')
      .populate('parentId')
      .populate('children.parentId');
  }
  async getAllDetails() {
    return await this.newsModel
      .find()
      .populate('mainImg')
      .populate('img')
      .populate('parentId')
      .populate('children.parentId').sort({createdAt : -1}).exec();
  }

  async countNews() {
    return this.newsModel.countDocuments({ isDeleted: false });
  }
}

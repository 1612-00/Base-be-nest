import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../base/base.repository';
import { HomeConfig, HomeConfigDocument } from './schemas/home-config.schema';

@Injectable()
export class HomeConfigRepository extends Repository<HomeConfigDocument> {
  constructor(
    @InjectModel(HomeConfig.name)
    private homeConfigModel: SoftDeleteModel<HomeConfigDocument>,
  ) {
    super(homeConfigModel);
  }

  async getHomeConfig() {
    return this.homeConfigModel
      .findOne({ isDeleted: false })
      .populate('logo', 'link')
      .populate('logoMobile', 'link')
      .populate('banner', 'link')
      .populate('content1.banner2.photo', 'link')
      .populate('content1.banner2.video', 'link')
      .populate('infoBox.box1.photo.photo', 'link')
      .populate('infoBox.box2.photo.photo', 'link')
      .populate('infoBox.box1.photo.video', 'link')
      .populate('infoBox.box2.photo.video', 'link');
  }

  async updateNoNews(id: string | Types.ObjectId, quantity: number) {
    return this.homeConfigModel.updateOne({ _id: id }, { noNews: quantity });
  }
}

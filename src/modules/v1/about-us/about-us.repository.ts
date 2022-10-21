import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../base/base.repository';
import { AboutUsDocument, AboutUs } from './schemas/about-us.schema';

@Injectable()
export class AboutUsRepository extends Repository<AboutUsDocument> {
  constructor(
    @InjectModel(AboutUs.name)
    private aboutUsModel: SoftDeleteModel<AboutUsDocument>,
  ) {
    super(aboutUsModel);
  }

  async getAboutUs() {
    return this.aboutUsModel
      .findOne({ isDeleted: false })
      .populate('ourStory.duPhoto', 'link');
  }
}

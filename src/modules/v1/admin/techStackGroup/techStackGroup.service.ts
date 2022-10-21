import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { uploadFileS3ForClient } from './../../../../shared/uploadServices/uploadFiles.const';

import { Types } from 'mongoose';
import { MessageClientCode } from 'src/common/messRespon/messageResponse.respon';
import responseS5M from 'src/common/response';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import HttpStatusCode from 'src/shared/statusCode.enum';
import { S3UploadFileService } from 'src/shared/uploadServices/uploadFiles.service';
import techStackGroupDto, {
  techStackGroupUpdateDto,
} from './dto/techStackGroup.dto';
import { TechStackGroupDocument } from './schemas/techStackGroup.schema';
import { TechStackRepository } from './techStackGroup.repository';

@Injectable()
export class TechStackGroupService {
  constructor(
    private _techStackGroupRepo: TechStackRepository,
    @Inject(uploadFileS3ForClient) private _testfile: S3UploadFileService,
  ) {}

  async getTechStackGroupById(id: Types.ObjectId) {
    try {
      const techStackGroup = await this._techStackGroupRepo.getById(id);
      console.log(techStackGroup);

      if (!techStackGroup) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      }
      return responseS5M(
        HttpStatusCode.OK,
        techStackGroup,
        MessageClientCode.GET_ITEM_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async createTechStackGroup(item: techStackGroupDto) {
    try {
      const techStackGroup = await this._techStackGroupRepo.store(<
        TechStackGroupDocument
      >{ ...item });
      return responseS5M(
        HttpStatusCode.CREATED,
        techStackGroup,
        MessageClientCode.ADD_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllTechStackGroup() {
    try {
      const listTechStackGroup = await this._techStackGroupRepo.getAll();
      return responseS5M(
        HttpStatusCode.OK,
        listTechStackGroup,
        MessageClientCode.GET_ALL_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllTechStackGroupPaginate(paginate: PaginateQuery) {
    try {
      const listTechStackGroup = await this._techStackGroupRepo.get({
        paginate,
      });
      return responseS5M(
        HttpStatusCode.OK,
        listTechStackGroup,
        MessageClientCode.GET_ALL_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async UpdateTechStackGroupById(
    id: Types.ObjectId,
    item: techStackGroupUpdateDto,
  ) {
    try {
      const isSuceessUpdate = await this._techStackGroupRepo.update(id, item);
      if (isSuceessUpdate) {
        return responseS5M(
          HttpStatusCode.NO_CONTENT,
          undefined,
          MessageClientCode.UPDATE_SUCCESS,
        );
      }
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async DeleteTechStackGroupById(id: Types.ObjectId) {
    try {
      const result = await this._techStackGroupRepo.remove(id);
      // console.log(result);

      if (result.deleted === 0) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      }

      return responseS5M(
        HttpStatusCode.NO_CONTENT,
        undefined,
        MessageClientCode.REMOVE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  async RestoreTechStackGroupById(id: Types.ObjectId) {
    try {
      const techStackGroup = await this._techStackGroupRepo.restore(id);
      return responseS5M(
        HttpStatusCode.OK,
        techStackGroup,
        MessageClientCode.RESTORE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // async testfile(file: Express.Multer.File[]) {
  //   try {
  //     console.log(file);
  //     let result: any = {};

  //     for (let index = 0; index < file.length; index++) {
  //       let { filename, buffer } = file[index];
  //       let map = await this._testfile.uploadPublicFile(buffer, filename);
  //       console.log(map);

  //       result[map.Key] = { location: map.Location };
  //       console.log(result);
  //     }

  //     // file.forEach(async (item)=>{

  //     // })
  //     //console.log(result);

  //     return result;
  //   } catch (error: any) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
}

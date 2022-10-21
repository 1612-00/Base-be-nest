import { PhotosService } from './../photos/photos.service';
import { StatusType } from './../../../enums/statuses.enum';
import { uploadFileS3ForAdmin } from './../../../shared/uploadServices/uploadFiles.const';
import { S3UploadFileService } from './../../../shared/uploadServices/uploadFiles.service';
import mongoose, { Types } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AboutUsRepository } from './about-us.repository';
import { CreateAboutUsDto } from './dtos/create-about-us.dto';
import { AboutUsDocument } from './schemas/about-us.schema';
import responseS5M from '../../../common/response';
import HttpStatusCode from '../../../shared/statusCode.enum';
import { MessageClientCode } from '../../../common/messRespon/messageResponse.respon';
import { PhotosRepository } from '../photos/photos.repository';
import { MembersService } from '../admin/members/members.service';
import { UpdateAboutUsDto } from './dtos/update-about-us.dto';
import { FoldersService } from '../folders/folders.service';
import { AboutUsConstant } from './about-us.const';
import filterObject from '../../../common/utils/filter-object';

@Injectable()
export class AboutUsService {
  constructor(
    private _aboutUsRepository: AboutUsRepository,
    private _photosService: PhotosService,
    @Inject(forwardRef(() => MembersService))
    private _membersService: MembersService,
    private _foldersService: FoldersService,
    @Inject(uploadFileS3ForAdmin) private _uploadService: S3UploadFileService,
  ) {}

  async getAboutUs() {
    const result = await this._aboutUsRepository.getAboutUs();
    if (!result)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );
    return responseS5M(
      HttpStatusCode.OK,
      result,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async create(createAboutUsDto: CreateAboutUsDto, file: Express.Multer.File) {
    const { content } = createAboutUsDto;
    const fileMetaData = file;
    let newAboutUs: any = {};
    //console.log(content,noMember,fileMetaData) ;
    if (file) {
      const metaData = await this._uploadService.uploadPublicFile(
        file.buffer,
        file.fieldname,
      );

      let folderId;

      const aboutUsFolder = await this._foldersService.getOneFolderByName(
        AboutUsConstant.MODEL_NAME,
      );

      if (aboutUsFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: AboutUsConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = aboutUsFolder.META_DATA._id;
      }

      const photo = await this._photosService.add({
        link: metaData.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });
      const idPhoto = photo.META_DATA._id;

      newAboutUs = {
        ourStory: {
          duPhoto: idPhoto,
          content,
        },
      };
    } else {
      newAboutUs = {
        ourStory: {
          content,
        },
      };
    }

    const noMember = await this._membersService.getNoMembers();
    newAboutUs['noMember'] = noMember;

    const checkAboutUs = await this._aboutUsRepository.getAboutUs();
    let result: AboutUsDocument;
    if (checkAboutUs) {
      result = await this._aboutUsRepository.update(
        checkAboutUs._id,
        newAboutUs,
      );
    } else {
      result = await this._aboutUsRepository.store(
        <AboutUsDocument>(<unknown>newAboutUs),
      );
    }

    return responseS5M(
      HttpStatusCode.CREATED,
      result,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async update(updateAboutUsDto: UpdateAboutUsDto, file?: Express.Multer.File) {
    const checkAboutUs = await this._aboutUsRepository.getAboutUs();
    if (!checkAboutUs)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const { content } = updateAboutUsDto;
    let idPhoto: Types.ObjectId | undefined;
    let updateObject: any = {
      required: true,
    };

    if (file) {
      const metaData = await this._uploadService.uploadPublicFile(
        file.buffer,
        file.fieldname,
      );

      let folderId;

      const aboutUsFolder = await this._foldersService.getOneFolderByName(
        AboutUsConstant.MODEL_NAME,
      );

      if (aboutUsFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: AboutUsConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = aboutUsFolder.META_DATA._id;
      }

      const photo = await this._photosService.add({
        link: metaData.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });
      idPhoto = photo.META_DATA._id;
    }

    let ourStory: any = {
      content,
      duPhoto: idPhoto,
    };

    ourStory = filterObject(ourStory);

    for (const element in ourStory) {
      updateObject[`ourStory.${element}`] = ourStory[element];
    }

    delete updateObject['required'];

    const updatedAboutUs = await this._aboutUsRepository.update(
      checkAboutUs._id,
      updateObject,
    );

    return responseS5M(
      HttpStatusCode.OK,
      updatedAboutUs,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async updateNoMembers(noMembers: number) {
    const curAboutUs = await this._aboutUsRepository.getAboutUs();
    if (!curAboutUs)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: About Us`,
      );

    return this._aboutUsRepository.update(curAboutUs._id, {
      noMember: noMembers,
    });
  }

  async delete() {
    const curAboutUs = await this._aboutUsRepository.getAboutUs();
    if (!curAboutUs)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const result = await this._aboutUsRepository.remove(curAboutUs._id);
    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      result,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async restore(id: string | Types.ObjectId) {
    const checkAboutUs = await this._aboutUsRepository.getAboutUs();
    if (checkAboutUs)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        undefined,
        MessageClientCode.REMOVE_ERROR,
      );

    const result = await this._aboutUsRepository.restore(id);
    if (result.restored == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      result,
      MessageClientCode.RESTORE_SUCCESS,
    );
  }
}

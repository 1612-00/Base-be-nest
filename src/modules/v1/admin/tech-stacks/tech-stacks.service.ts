import { Inject, Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { MessageClientCode } from '../../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../../common/response';
import filterObject from '../../../../common/utils/filter-object';
import { MessageTemplate } from '../../../../constants/message.constants';
import { StatusType } from '../../../../enums/statuses.enum';
import HttpStatusCode from '../../../../shared/statusCode.enum';
import { S3UploadFileService } from '../../../../shared/uploadServices/uploadFiles.service';
import { FoldersService } from '../../folders/folders.service';
import { PhotosService } from '../../photos/photos.service';
import { TechStackGroupService } from '../techStackGroup/techStackGroup.service';
import { CreateTechStackDto } from './dtos/create-tech-stack.dto';
import { UpdateTechStackDto } from './dtos/update-tech-stack.dto';
import {
  TechStackDocument,
  TechStackSchema,
} from './schemas/tech-stacks.schema';
import { TechStacksConstant } from './tech-stacks.constant';
import { TechStacksRepository } from './tech-stacks.repository';

@Injectable()
export class TechStacksService {
  constructor(
    private techStacksRepository: TechStacksRepository,
    private photosService: PhotosService,
    private techStackGroupService: TechStackGroupService,
    private _foldersService: FoldersService,
    @Inject('uploadFileS3ForAdmin')
    private readonly _serviceUploadFiles: S3UploadFileService,
  ) {}

  async add(
    createTechStackDto: CreateTechStackDto,
    photo: Express.Multer.File,
  ) {
    const { name, order, status, group } = createTechStackDto;

    const nameAdd = createTechStackDto.name;
    const checkName = await this.techStacksRepository.findByCodition({
      name: nameAdd,
      isDeleted: false,
    });
    if (checkName.length > 0)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        nameAdd,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    if (createTechStackDto.group) {
      const groupAdd = createTechStackDto.group;
      const checkGroup = await this.techStackGroupService.getTechStackGroupById(
        groupAdd,
      );
      if (!checkGroup || checkGroup['STATUS_CODE'] == 404)
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          `${MessageClientCode.NOT_FOUND}: Group`,
        );
    }

    let techStackProperties;

    if (photo) {
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photo.buffer,
          photo.fieldname,
        );

      let folderId;

      const techStackFolder = await this._foldersService.getOneFolderByName(
        TechStacksConstant.FOLDER_NAME,
      );

      if (techStackFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: TechStacksConstant.FOLDER_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = techStackFolder.META_DATA._id;
      }

      const photoDb = await this.photosService.add({
        link: uploadedPhoto.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });

      const idPhoto = photoDb.META_DATA._id;

      techStackProperties = {
        name,
        photo: idPhoto,
        order,
        status,
        group,
      };
    } else {
      techStackProperties = {
        name,
        order,
        status,
        group,
      };
    }

    const newTechStack = await this.techStacksRepository.store(
      <TechStackDocument>techStackProperties,
    );

    return responseS5M(
      HttpStatusCode.CREATED,
      newTechStack,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async getAll() {
    const techStacks = await this.techStacksRepository.getAllTechStack();

    return responseS5M(
      HttpStatusCode.OK,
      techStacks,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const techStacks = await this.techStacksRepository.get({
      paginate,
      options: {
        populate: [
          { path: 'group', select: 'name' },
          { path: 'photo', select: 'link' },
        ],
      },
    });

    return responseS5M(
      HttpStatusCode.OK,
      techStacks,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getById(id: string | Types.ObjectId) {
    const techStack = await this.techStacksRepository.getTechStackById(id);

    if (!techStack)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      techStack,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async update(
    id: string | Types.ObjectId,
    updateTechStackDto: UpdateTechStackDto,
    photo?: Express.Multer.File,
  ) {
    const { name, order, status, group } = updateTechStackDto;

    const checkTechStack = await this.techStacksRepository.getById(id);
    if (!checkTechStack)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const nameUpdate = updateTechStackDto.name;
    const checkName = await this.techStacksRepository.findByCodition({
      name: nameUpdate,
      isDeleted: false,
    });
    if (checkName.length > 0) {
      for (const techStack of checkName) {
        if (techStack._id != id)
          return responseS5M(
            HttpStatusCode.BAD_REQUEST,
            nameUpdate,
            MessageTemplate.ITEM_ALREADY_EXIST,
          );
      }
    }

    let techStackProperties;

    if (photo) {
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photo.buffer,
          photo.fieldname,
        );

      let folderId;

      const techStackFolder = await this._foldersService.getOneFolderByName(
        TechStacksConstant.FOLDER_NAME,
      );

      if (techStackFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: TechStacksConstant.FOLDER_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = techStackFolder.META_DATA._id;
      }

      const photoDb = await this.photosService.add({
        link: uploadedPhoto.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });

      const idPhoto = photoDb.META_DATA._id;

      techStackProperties = {
        name,
        photo: idPhoto,
        order,
        status,
        group,
      };
    } else {
      techStackProperties = {
        name,
        order,
        status,
        group,
      };
    }

    techStackProperties = filterObject(techStackProperties);

    console.log(techStackProperties);

    const updatedTechStack = await this.techStacksRepository.update(
      id,
      techStackProperties,
    );

    return responseS5M(
      HttpStatusCode.OK,
      updatedTechStack,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async softDelete(id: string | Types.ObjectId) {
    const checkTechStack = await this.techStacksRepository.getById(id);
    if (!checkTechStack)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const result = await this.techStacksRepository.remove(id);

    if (result.deleted == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async hardDelete(id: string | Types.ObjectId) {
    const checkTechStack = await this.techStacksRepository.getById(id);
    if (!checkTechStack)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    await this.techStacksRepository.hardDelete(id);

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async restore(id: string | Types.ObjectId) {
    const result = await this.techStacksRepository.restore(id);

    if (result.restored == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.RESTORE_SUCCESS,
    );
  }
}

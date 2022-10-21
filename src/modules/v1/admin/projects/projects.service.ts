import { Inject, Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import mongoose, { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { MessageClientCode } from '../../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../../common/response';
import { convertObjectId } from '../../../../common/utils/array-object-id.convert';
import filterObject from '../../../../common/utils/filter-object';
import { MessageTemplate } from '../../../../constants/message.constants';
import { StatusType } from '../../../../enums/statuses.enum';
import HttpStatusCode from '../../../../shared/statusCode.enum';
import { S3UploadFileService } from '../../../../shared/uploadServices/uploadFiles.service';
import { FoldersService } from '../../folders/folders.service';
import { PhotosService } from '../../photos/photos.service';
import { PhotoDocument } from '../../photos/schemas/photos.schema';
import { MembersRepository } from '../members/members.repository';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectConstant } from './projects.constant';
import { ProjectsRepository } from './projects.repository';
import { ProjectDocument } from './schemas/projects.schema';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private photosService: PhotosService,
    private membersRepository: MembersRepository,
    private _foldersService: FoldersService,
    @Inject('uploadFileS3ForAdmin')
    private readonly _serviceUploadFiles: S3UploadFileService,
  ) {}

  async getAll() {
    const projects = await this.projectsRepository.getAllProjects();

    return responseS5M(
      HttpStatusCode.OK,
      projects,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const projects = await this.projectsRepository.get({
      paginate,
      options: {
        populate: [
          { path: 'photo', select: 'link' },
          {
            path: 'memberList',
            select: ['name', 'photo'],
            populate: {
              path: 'photo',
              select: 'link',
            },
          },
        ],
      },
    });

    return responseS5M(
      HttpStatusCode.OK,
      projects,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getById(id: string | Types.ObjectId) {
    const project = await this.projectsRepository.getProjectById(id);

    if (!project)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      project,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async create(
    createProjectDto: CreateProjectDto,
    memberListArray: string[],
    photo: Express.Multer.File,
  ) {
    let { name, description, order, status } = createProjectDto;
    if (!status) status = StatusType.PUBLISHED;
    let projectProperties;

    const checkName = await this.projectsRepository.getProjectByName(name);
    if (checkName.length > 0)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        undefined,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    memberListArray = [...new Set(memberListArray)];

    for (const member of memberListArray) {
      const checkMember = await this.membersRepository.getById(member);
      if (!checkMember)
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          `${MessageClientCode.NOT_FOUND}: Member`,
        );
    }

    const idMembers = convertObjectId(memberListArray);

    if (photo) {
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photo.buffer,
          photo.fieldname,
        );

      let folderId;

      const projectFolder = await this._foldersService.getOneFolderByName(
        ProjectConstant.MODEL_NAME,
      );

      if (projectFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: ProjectConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = projectFolder.META_DATA._id;
      }

      const photoDb = await this.photosService.add({
        link: uploadedPhoto.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });

      const idPhoto = photoDb.META_DATA._id;

      projectProperties = {
        name,
        photo: idPhoto,
        description,
        order,
        memberList: idMembers,
        status,
        isDeleted: false,
      };
    } else {
      projectProperties = {
        name,
        description,
        order,
        memberList: idMembers,
        status,
        isDeleted: false,
      };
    }

    const newProject = await this.projectsRepository.store(
      <ProjectDocument>(<unknown>projectProperties),
    );

    return responseS5M(
      HttpStatusCode.CREATED,
      newProject,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async update(
    projectId: string | Types.ObjectId,
    updateProjectDto: UpdateProjectDto,
    memberListArray: string[],
    photo?: Express.Multer.File,
  ) {
    let { name, description, order } = updateProjectDto;
    console.log(order);
    let projectProperties;

    const checkName = await this.projectsRepository.getProjectByName(name!);
    if (checkName) {
      for (const project of checkName) {
        if (project._id.toString() != projectId)
          return responseS5M(
            HttpStatusCode.BAD_REQUEST,
            name,
            MessageTemplate.ITEM_ALREADY_EXIST,
          );
      }
    }

    memberListArray = [...new Set(memberListArray)];
    for (const member of memberListArray) {
      const checkMember = await this.membersRepository.getById(member);
      if (!checkMember)
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          `${MessageClientCode.NOT_FOUND}: Member`,
        );
    }

    const idMembers = convertObjectId(memberListArray);

    if (photo) {
      console.log('photo');
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photo.buffer,
          photo.fieldname,
        );

      let folderId;

      const projectFolder = await this._foldersService.getOneFolderByName(
        ProjectConstant.MODEL_NAME,
      );

      if (projectFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: ProjectConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = projectFolder.META_DATA._id;
      }

      const photoDb = await this.photosService.add({
        link: uploadedPhoto.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });

      const idPhoto = photoDb.META_DATA._id;

      projectProperties = {
        name,
        photo: idPhoto,
        description,
        order,
        memberList: idMembers,
      };
    } else {
      projectProperties = {
        name,
        description,
        order,
        memberList: idMembers,
      };
    }

    projectProperties = filterObject(projectProperties);

    const updateProject = await this.projectsRepository.update(
      projectId,
      projectProperties,
    );

    return responseS5M(
      HttpStatusCode.OK,
      updateProject,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async delete(projectId: string | Types.ObjectId) {
    const result = await this.projectsRepository.remove(projectId);
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

  async restore(projectId: string | Types.ObjectId) {
    const result = await this.projectsRepository.restore(projectId);
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

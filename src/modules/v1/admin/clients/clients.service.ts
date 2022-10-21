import { Inject, Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import mongoose, { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { MessageClientCode } from '../../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../../common/response';
import filterObject from '../../../../common/utils/filter-object';
import { MessageTemplate } from '../../../../constants/message.constants';
import { StatusType } from '../../../../enums/statuses.enum';
import HttpStatusCode from '../../../../shared/statusCode.enum';
import { S3UploadFileService } from '../../../../shared/uploadServices/uploadFiles.service';
import { FoldersService } from '../../folders/folders.service';
import { PhotosRepository } from '../../photos/photos.repository';
import { PhotosService } from '../../photos/photos.service';
import { ClientConstant } from './clients.constant';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { ClientDocument } from './schemas/clients.schema';

@Injectable()
export class ClientsService {
  constructor(
    private clientsRepository: ClientsRepository,
    private photosRepository: PhotosRepository,
    private photosService: PhotosService,
    private _foldersService: FoldersService,
    @Inject('uploadFileS3ForAdmin')
    private readonly _serviceUploadFiles: S3UploadFileService,
  ) {}

  async getAll() {
    const clients = await this.clientsRepository.getAllClients();

    return responseS5M(
      HttpStatusCode.OK,
      clients,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const clients = await this.clientsRepository.get({
      paginate,
      options: {
        populate: [{ path: 'photo', select: 'link' }],
      },
    });

    return responseS5M(
      HttpStatusCode.OK,
      clients,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getById(clientId: string | Types.ObjectId) {
    const client = await this.clientsRepository.getClientById(clientId);
    if (!client)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        client,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      client,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async create(createClientDto: CreateClientDto, photo: Express.Multer.File) {
    let { name, order, status } = createClientDto;
    if (!status) status = StatusType.PUBLISHED;
    let addClient;

    const checkName = await this.clientsRepository.getClientByName(name);
    if (checkName)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        name,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    if (photo) {
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photo.buffer,
          photo.fieldname,
        );

      let folderId;

      const clientFolder = await this._foldersService.getOneFolderByName(
        ClientConstant.MODEL_NAME,
      );

      if (clientFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: ClientConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = clientFolder.META_DATA._id;
      }

      const photoDb = await this.photosService.add({
        link: uploadedPhoto.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });

      const idPhoto = photoDb.META_DATA._id;
      addClient = {
        name,
        photo: idPhoto,
        order,
        status,
        isDeleted: false,
      };
    } else {
      addClient = {
        name,
        order,
        status,
        isDeleted: false,
      };
    }

    const newClient = await this.clientsRepository.store(
      <ClientDocument>(<unknown>addClient),
    );

    return responseS5M(
      HttpStatusCode.CREATED,
      newClient,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async update(
    clientId: string | Types.ObjectId,
    updateClientDto: UpdateClientDto,
    photo?: Express.Multer.File,
  ) {
    const checkClient = await this.clientsRepository.getById(clientId);
    if (!checkClient)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Client`,
      );

    const { name, order, status } = updateClientDto;
    let updateClientProperties;

    if (name) {
      const checkName = await this.clientsRepository.getClientByName(name);
      if (checkName && checkName._id.toString() != clientId)
        return responseS5M(
          HttpStatusCode.BAD_REQUEST,
          name,
          MessageTemplate.ITEM_ALREADY_EXIST,
        );
    }

    if (photo) {
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photo.buffer,
          photo.fieldname,
        );

      let folderId;

      const clientFolder = await this._foldersService.getOneFolderByName(
        ClientConstant.MODEL_NAME,
      );

      if (clientFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: ClientConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = clientFolder.META_DATA._id;
      }

      const photoDb = await this.photosService.add({
        link: uploadedPhoto.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });
      const idPhoto = photoDb.META_DATA._id;

      updateClientProperties = { name, photo: idPhoto, order, status };
    } else {
      updateClientProperties = { name, order, status };
    }

    updateClientProperties = filterObject(updateClientProperties);

    const updatedClient = await this.clientsRepository.update(
      clientId,
      updateClientProperties,
    );

    return responseS5M(
      HttpStatusCode.OK,
      updatedClient,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async delete(clientId: string | Types.ObjectId) {
    const result = await this.clientsRepository.remove(clientId);
    if (result.deleted == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Client`,
      );

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async restore(clientId: string | Types.ObjectId) {
    const result = await this.clientsRepository.restore(clientId);

    if (result.restored == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Client`,
      );

    return responseS5M(
      HttpStatusCode.OK,
      undefined,
      MessageClientCode.RESTORE_SUCCESS,
    );
  }
}

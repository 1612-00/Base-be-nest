import { MessageTemplate } from '@constants/message.constants';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { MessageClientCode } from 'src/common/messRespon/messageResponse.respon';
import responseS5M from 'src/common/response';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import HttpStatusCode from 'src/shared/statusCode.enum';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissonDto } from './dto/updatePermisson.dto';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsDocument } from './schemas/permissions.schema';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepo: PermissionsRepository) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { title, constName, accessUrl } = createPermissionDto;

    const constNameExisted = await this.permissionsRepo.existed({ constName });
    if (constNameExisted)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        constName,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    const permissionCreated = await this.permissionsRepo.store(
      <PermissionsDocument>createPermissionDto,
    );

    return responseS5M(
      HttpStatusCode.CREATED,
      permissionCreated,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async getById(id: Types.ObjectId) {
    const permissionFound = await this.permissionsRepo.getById(id);

    if (!permissionFound)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        permissionFound,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      permissionFound,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async getAll() {
    const permissionsFound = await this.permissionsRepo.getAll();

    return responseS5M(
      HttpStatusCode.OK,
      permissionsFound,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async delete(id: Types.ObjectId) {
    const result = await this.permissionsRepo.remove(id);
    if (result.deleted == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Permission`,
      );

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async update(id: Types.ObjectId, updatePermissonDto: UpdatePermissonDto) {
    const { accessUrl, constName, title } = updatePermissonDto;

    const permissionFound = await this.permissionsRepo.getById(id);
    if (!permissionFound)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        permissionFound,
        MessageClientCode.NOT_FOUND,
      );

    const constNameExisted = await this.permissionsRepo.existed({
      constName,
      isDeleted: false,
      _id: { $ne: id },
    });
    if (constNameExisted)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        constName,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    const permissionUpdated = await this.permissionsRepo.updateOptionsv2(
      id,
      {
        title,
        constName,
        accessUrl,
      },
      { omitUndefined: true },
    );

    return responseS5M(
      HttpStatusCode.OK,
      permissionUpdated,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const permissionsFound = await this.permissionsRepo.get({ paginate });

    return responseS5M(
      HttpStatusCode.OK,
      permissionsFound,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }
}

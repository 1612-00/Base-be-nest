import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { MessageClientCode } from '../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../common/response';
import { MessageTemplate } from '../../../constants/message.constants';
import HttpStatusCode from '../../../shared/statusCode.enum';
import { PhotosService } from '../photos/photos.service';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { FolderRepository } from './folder.repository';
import { FolderDocument } from './schemas/folders.schema';

@Injectable()
export class FoldersService {
  constructor(private folderRepository: FolderRepository) {}

  async getAll() {
    const folders = await this.folderRepository.getAllFolders();

    return responseS5M(
      HttpStatusCode.OK,
      folders,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const folders = await this.folderRepository.get({
      paginate,
      options: {
        populate: [{ path: 'parentId', select: 'name' }],
      },
    });

    return responseS5M(
      HttpStatusCode.OK,
      folders,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getById(id: string | Types.ObjectId) {
    const folder = await this.folderRepository.getFolderById(id);

    if (!folder)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      folder,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async getOneFolderByName(name: string) {
    const folder = await this.folderRepository.getOneFolderByName(name);

    if (!folder)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Folder`,
      );

    return responseS5M(
      HttpStatusCode.OK,
      folder,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async add(createFolderDto: CreateFolderDto) {
    const nameAdd = createFolderDto.name;
    const checkName = await this.folderRepository.findByCodition({
      name: nameAdd,
      isDeleted: false,
    });
    if (checkName.length > 0)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        undefined,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    const newFolder = await this.folderRepository.store(
      <FolderDocument>createFolderDto,
    );

    return responseS5M(
      HttpStatusCode.CREATED,
      newFolder,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async update(id: string | Types.ObjectId, updateFolderDto: UpdateFolderDto) {
    const checkFolder = await this.folderRepository.getById(id);
    if (!checkFolder)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const nameUpdate = updateFolderDto.name;
    const checkName = await this.folderRepository.findByCodition({
      name: nameUpdate,
      isDeleted: false,
    });
    if (checkName.length > 0) {
      for (const folder of checkName) {
        if (folder._id.toString() != id.toString())
          return responseS5M(
            HttpStatusCode.BAD_REQUEST,
            undefined,
            MessageTemplate.ITEM_ALREADY_EXIST,
          );
      }
    }

    const updateFolder = await this.folderRepository.update(
      id,
      updateFolderDto,
    );
    return responseS5M(
      HttpStatusCode.OK,
      updateFolder,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async softDelete(id: string | Types.ObjectId) {
    const result = await this.folderRepository.remove(id);

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

  async restore(id: string | Types.ObjectId) {
    const restoreFolder = await this.folderRepository.restore(id);

    if (restoreFolder.restored == 0)
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

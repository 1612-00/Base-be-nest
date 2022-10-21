import { Inject, Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import mongoose, { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { MessageClientCode } from '../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../common/response';
import { NUMBER_REGEX } from '../../../constants/regex.constants';
import { Orientation } from '../../../enums/orientation.enum';
import { StatusType } from '../../../enums/statuses.enum';
import HttpStatusCode from '../../../shared/statusCode.enum';
import { S3UploadFileService } from '../../../shared/uploadServices/uploadFiles.service';
import { FoldersService } from '../folders/folders.service';
import { CreatePhotoDto } from './dtos/create-photo.dto';
import { CreatePhotosArrayDto } from './dtos/create-photos-array.dto';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { PhotosRepository } from './photos.repository';
import { PhotoDocument } from './schemas/photos.schema';

@Injectable()
export class PhotosService {
  constructor(
    private photosRepository: PhotosRepository,
    private _foldersService: FoldersService,
    @Inject('uploadFileS3ForAdmin')
    private readonly _serviceUploadFiles: S3UploadFileService,
  ) {}

  async getAll() {
    const photos = await this.photosRepository.getAllPhotos();

    return responseS5M(
      HttpStatusCode.OK,
      photos,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const photos = await this.photosRepository.get({
      paginate,
      options: {
        populate: [
          { path: 'folder', select: 'name' },
          { path: 'comments', select: 'content' },
        ],
      },
    });

    return responseS5M(
      HttpStatusCode.OK,
      photos,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getById(id: string | Types.ObjectId) {
    const photo = await this.photosRepository.getPhotoById(id);

    if (!photo)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      photo,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async add(createPhotoDto: CreatePhotoDto) {
    const addPhoto = { ...createPhotoDto, likes: 0 };

    const newPhoto = await this.photosRepository.store(<PhotoDocument>addPhoto);

    return responseS5M(
      HttpStatusCode.CREATED,
      newPhoto,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async addPhotosArray(
    createPhotosArrayDto: CreatePhotosArrayDto,
    heightsString: string[],
    widthsString: string[],
    photos: Express.Multer.File[],
  ) {
    console.log('Height: ', heightsString, ' Width: ', widthsString);
    const { folder, status } = createPhotosArrayDto;
    let photosIdArray: string[] = [];
    let heights: number[] = [];
    let widths: number[] = [];

    if (
      heightsString &&
      widthsString &&
      (heightsString?.length != photos.length ||
        widthsString?.length != photos.length)
    )
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        undefined,
        'Heights length or widths length do not match photos length',
      );

    for (let i = 0; i < heightsString?.length; i++) {
      if (
        !heightsString[i].match(NUMBER_REGEX) ||
        !widthsString[i].match(NUMBER_REGEX)
      ) {
        return responseS5M(
          HttpStatusCode.BAD_REQUEST,
          undefined,
          'Height or width is not a number',
        );
      } else if (
        parseFloat(heightsString[i]) <= 0 ||
        parseFloat(widthsString[i]) <= 0
      ) {
        return responseS5M(
          HttpStatusCode.BAD_REQUEST,
          undefined,
          'Height or width cannot be lower than 0',
        );
      }

      heights.push(parseFloat(heightsString[i]));
      widths.push(parseFloat(widthsString[i]));
    }

    const checkFolder = await this._foldersService.getById(folder!);
    if (checkFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Folder`,
      );

    for (let i = 0; i < photos.length; i++) {
      const uploadedPhoto: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          photos[i].buffer,
          photos[i].fieldname,
        );

      let photoProperties: any = {
        link: uploadedPhoto.Location,
        folder,
        status,
      };

      if (heights.length > 0) {
        const aspectRatio: number = widths[i] / heights[i];
        photoProperties['aspectRatio'] = aspectRatio;
      }

      console.log(photoProperties);

      const photoDb = await this.photosRepository.store(
        <PhotoDocument>photoProperties,
      );
      photosIdArray.push(photoDb._id);
    }

    return responseS5M(
      HttpStatusCode.CREATED,
      photosIdArray,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async update(id: string | Types.ObjectId, updatePhotoDto: UpdatePhotoDto) {
    const checkPhoto = await this.photosRepository.getById(id);

    if (!checkPhoto)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const updatePhoto = await this.photosRepository.update(id, updatePhotoDto);

    return responseS5M(
      HttpStatusCode.OK,
      updatePhoto,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async softDelete(id: string | Types.ObjectId) {
    const result = await this.photosRepository.remove(id);

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
    const restorePhoto = await this.photosRepository.restore(id);

    if (restorePhoto.restored == 0)
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

  async addLike(id: string | Types.ObjectId) {
    const checkPhoto = await this.photosRepository.getById(id);
    if (!checkPhoto)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const newLikes: number = checkPhoto.likes + 1;
    const updateLike = await this.photosRepository.updateByConditions(id, {
      likes: newLikes,
    });

    return responseS5M(
      HttpStatusCode.OK,
      newLikes,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async unLike(id: string | Types.ObjectId) {
    const checkPhoto = await this.photosRepository.getById(id);
    if (!checkPhoto)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    if (checkPhoto.likes > 0) {
      const newLikes: number = checkPhoto.likes - 1;
      const updateLike = await this.photosRepository.updateByConditions(id, {
        likes: newLikes,
      });

      return responseS5M(
        HttpStatusCode.OK,
        newLikes,
        MessageClientCode.UPDATE_SUCCESS,
      );
    } else {
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        undefined,
        MessageClientCode.UPDATE_ERROR,
      );
    }
  }

  async getPhotosQuantity(photoArray: string[]) {
    return this.photosRepository.getPhotosQuantity(photoArray);
  }

  async getPhotosInFolder(folderId: string | Types.ObjectId) {
    const checkFolder = await this._foldersService.getById(folderId);
    if (checkFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: Folder`,
      );

    const photos = await this.photosRepository.getPhotosInFolder(folderId);

    const result = {
      folder: checkFolder.META_DATA.name,
      photos,
    };

    return responseS5M(
      HttpStatusCode.OK,
      result,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }
}

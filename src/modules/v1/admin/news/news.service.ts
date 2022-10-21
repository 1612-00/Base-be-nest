import * as mongoose from 'mongoose';
import { PhotosService } from './../../photos/photos.service';
import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageClientCode } from 'src/common/messRespon/messageResponse.respon';
import responseS5M from 'src/common/response';
import HttpStatusCode from 'src/shared/statusCode.enum';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsRepository } from './news.repository';
import { newsDocument, News } from './schema/news.schema';
import { S3UploadFileService } from 'src/shared/uploadServices/uploadFiles.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { StatusType } from 'src/enums/statuses.enum';
import { HomeConfigService } from '../../home-config/home-config.service';
import filterObject from '../../../../common/utils/filter-object';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly _newsRepo: NewsRepository,
    @Inject('uploadFileS3ForAdmin')
    private readonly _serviceUploadFiles: S3UploadFileService,
    private readonly _photosService: PhotosService,
    @Inject(forwardRef(() => HomeConfigService))
    private _homeConfigService: HomeConfigService,
  ) {}

  async create(
    textFieldNewsDto: CreateNewsDto,
    filesFieldsDto: Express.Multer.File[],
  ) {
    try {
      const { title, publishedDate, status, content, homeDisplay } =
        textFieldNewsDto;
      let linkImg,
        linkMainImg = undefined;
      let linkPhotoList = [];
      const filesMetadata: any = {};
      filesMetadata['photoLits'] = [];
      if (filesFieldsDto) {
        filesFieldsDto.find((item) => {
          item.fieldname == 'photoLits'
            ? filesMetadata['photoLits'].push(item)
            : item.fieldname == 'img'
            ? (filesMetadata['img'] = item)
            : (filesMetadata['mainImg'] = item);
        });
      }
      if (filesMetadata['mainImg']) {
        console.log(filesMetadata['mainImg']);
        const medataDataFile: ManagedUpload.SendData =
          await this._serviceUploadFiles.uploadPublicFile(
            filesMetadata['mainImg'].buffer,
            filesMetadata['mainImg'].fieldname,
          );
        const mainImgPhoto = await this._photosService.add({
          link: medataDataFile.Location,
          folder: '634294465a82b8c4534bb92c',
          status: StatusType.PUBLISHED,
        });
        linkMainImg = mainImgPhoto.META_DATA._id;
      }
      if (filesMetadata['img']) {
        const medataDataFile: ManagedUpload.SendData =
          await this._serviceUploadFiles.uploadPublicFile(
            filesMetadata['img'].buffer,
            filesMetadata['img'].fieldname,
          );
        const imgPhoto = await this._photosService.add({
          link: medataDataFile.Location,
          folder: '634294465a82b8c4534bb92c',
          status: StatusType.PUBLISHED,
        });
        linkImg = imgPhoto.META_DATA._id;
      }
      if (filesMetadata['photoLits'].length > 0) {
        for (
          let index = 0;
          index < filesMetadata['photoLits'].length;
          index++
        ) {
          const medataDataFile: ManagedUpload.SendData =
            await this._serviceUploadFiles.uploadPublicFile(
              filesMetadata['photoLits'][index].buffer,
              filesMetadata['photoLits'][index].fieldname,
            );
          const imgPhotoList = await this._photosService.add({
            link: medataDataFile.Location,
            folder: '634294465a82b8c4534bb92c',
            status: StatusType.PUBLISHED,
          });
          linkPhotoList.push(imgPhotoList.META_DATA._id);
        }
      }

      const news = await this._newsRepo.store(<newsDocument>(<unknown>{
        title,
        publishedDate,
        status,
        content,
        homeDisplay,
        mainImg: linkMainImg,
        img: linkImg,
        photoList: linkPhotoList,
      }));

      const checkHomeConfig = await this._homeConfigService.get();
      console.log(checkHomeConfig);

      if (checkHomeConfig.META_DATA) {
        const quantity: number = await this._newsRepo.countNews();
        await this._homeConfigService.updateNoNews(quantity);
      }

      return responseS5M(
        HttpStatusCode.CREATED,
        news,
        MessageClientCode.ADD_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const news = await this._newsRepo.getAllDetails();
      return responseS5M(
        HttpStatusCode.OK,
        news,
        MessageClientCode.GET_ALL_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllPaginate(paginate: PaginateQuery) {
    try {
      const news = await this._newsRepo.get({
        paginate,
        options: {
          populate: [
            { path: 'mainImg' },
            { path: 'img' },
            { path: 'parentId' },
            { path: 'children.parentId' },
          ],
        },
      });
      return responseS5M(
        HttpStatusCode.OK,
        news,
        MessageClientCode.GET_ALL_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(MessageClientCode.OBJECT_ID_NOT_CORRECT);
    }
    try {
      const news = await this._newsRepo.getByIdDetails(id);
      if (!news) {
        throw new NotFoundException(MessageClientCode.NOT_FOUND);
      }
      return responseS5M(
        HttpStatusCode.OK,
        news,
        MessageClientCode.GET_ITEM_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    filesFieldsDto: Express.Multer.File[],
  ) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(MessageClientCode.OBJECT_ID_NOT_CORRECT);
    }
    try {
      const { title, publishedDate, status, content, homeDisplay } =
        updateNewsDto;
      let linkImg,
        linkMainImg = undefined;
      let linkPhotoList = [];
      const filesMetadata: any = {};
      filesMetadata['photoLits'] = [];
      filesFieldsDto.find((item) => {
        item.fieldname == 'photoLits'
          ? filesMetadata['photoLits'].push(item)
          : item.fieldname == 'img'
          ? (filesMetadata['img'] = item)
          : (filesMetadata['mainImg'] = item);
      });
      if (filesMetadata['mainImg']) {
        const medataDataFile: ManagedUpload.SendData =
          await this._serviceUploadFiles.uploadPublicFile(
            filesMetadata['mainImg'].buffer,
            filesMetadata['mainImg'].fieldname,
          );
        const mainImgPhoto = await this._photosService.add({
          link: medataDataFile.Location,
          folder: '634294465a82b8c4534bb92c',
          status: StatusType.PUBLISHED,
        });
        linkMainImg = mainImgPhoto.META_DATA._id;
      }
      if (filesMetadata['img']) {
        const medataDataFile: ManagedUpload.SendData =
          await this._serviceUploadFiles.uploadPublicFile(
            filesMetadata['img'].buffer,
            filesMetadata['img'].fieldname,
          );
        const imgPhoto = await this._photosService.add({
          link: medataDataFile.Location,
          folder: '634294465a82b8c4534bb92c',
          status: StatusType.PUBLISHED,
        });
        linkImg = imgPhoto.META_DATA._id;
      }
      if (filesMetadata['photoLits'].length > 0) {
        for (
          let index = 0;
          index < filesMetadata['photoLits'].length;
          index++
        ) {
          const medataDataFile: ManagedUpload.SendData =
            await this._serviceUploadFiles.uploadPublicFile(
              filesMetadata['photoLits'][index].buffer,
              filesMetadata['photoLits'][index].fieldname,
            );
          const imgPhotoList = await this._photosService.add({
            link: medataDataFile.Location,
            folder: '634294465a82b8c4534bb92c',
            status: StatusType.PUBLISHED,
          });
          linkPhotoList.push(imgPhotoList.META_DATA._id);
        }
      }

      let dataNews: any = {};
      dataNews = {
        title,
        publishedDate,
        status,
        content,
        homeDisplay,
        mainImg: linkMainImg,
        img: linkImg,
        photoList: linkPhotoList,
      };

      dataNews = filterObject(dataNews);

      await this._newsRepo.update(id, <newsDocument>(<unknown>dataNews));
      return responseS5M(
        HttpStatusCode.NO_CONTENT,
        undefined,
        MessageClientCode.UPDATE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(MessageClientCode.OBJECT_ID_NOT_CORRECT);
    }
    try {
      const news = await this._newsRepo.getById({ _id: id });
      if (!news) {
        throw new NotFoundException(MessageClientCode.NOT_FOUND);
      }
      await this._newsRepo.softDelete(id);

      const checkHomeConfig = await this._homeConfigService.get();
      if (checkHomeConfig.META_DATA) {
        const quantity: number = await this._newsRepo.countNews();
        await this._homeConfigService.updateNoNews(quantity);
      }

      return responseS5M(
        HttpStatusCode.OK,
        undefined,
        MessageClientCode.REMOVE_SUCCESS,
      );
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async countNews() {
    return this._newsRepo.countNews();
  }
}

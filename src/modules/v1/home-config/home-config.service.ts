import { StatusType } from './../../../enums/statuses.enum';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Content1 } from './../content1/schemas/content1.schema';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { MessageClientCode } from '../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../common/response';
import HttpStatusCode from '../../../shared/statusCode.enum';
import { NewsService } from '../admin/news/news.service';
import { PhotosService } from '../photos/photos.service';
import { CreateHomeConfigDto } from './dtos/create-home-config.dto';
import { HomeConfigRepository } from './home-config.repository';
import { HomeConfigDocument } from './schemas/home-config.schema';
import { S3UploadFileService } from 'src/shared/uploadServices/uploadFiles.service';
import { HomeConfigConstant } from './home-config.const';
import { FoldersService } from '../folders/folders.service';
import { UpdateHomeConfigDto } from './dtos/update-home-config.dto';

@Injectable()
export class HomeConfigService {
  constructor(
    private homeConfigRepository: HomeConfigRepository,
    @Inject(forwardRef(() => NewsService)) private newsService: NewsService,
    @Inject('uploadFileS3ForAdmin')
    private readonly _serviceUploadFiles: S3UploadFileService,
    private readonly _photosService: PhotosService,
    private readonly _foldersService: FoldersService,
  ) {}

  async get() {
    const homeConfig = await this.homeConfigRepository.getHomeConfig();

    if (!homeConfig)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      homeConfig,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async modify(
    createHomeConfigDto: CreateHomeConfigDto,
    files: Express.Multer.File[],
  ) {
    const {
      url,
      infoBox2Title,
      infoBox1Title,
      infoBox2Content,
      infoBox1Content,
      blackBoxContent2,
      blackBoxTitle2,
      blackBoxTitle,
      blackBoxContent,
      content1WhoWeAreTitle,
      content1WhoWeAreSubTitle,
      content1GreenBoxTitle,
      content1GreenBoxSubTitle,
      subSlogan,
      slogan,
    } = createHomeConfigDto;

    const idFilesArray = await this.uploadPhotos(files);
    const {
      idLogo,
      idLogoMobile,
      idBanner,
      idBanner2Photo,
      idBanner2Video,
      idInfoBox1Photo,
      idInfoBox1Video,
      idInfoBox2Photo,
      idInfoBox2Video,
    } = idFilesArray;

    const checkHomeConfig = await this.homeConfigRepository.getHomeConfig();
    const noNews = await this.newsService.countNews();

    const dataUpdate = {
      url,
      logo: idLogo,
      logoMobile: idLogoMobile,
      banner: idBanner,
      slogan: { slogan: slogan, subSlogan: subSlogan },
      content1: {
        whoWeAreTitle: content1WhoWeAreTitle,
        whoWeAreSubtitle: content1WhoWeAreSubTitle,
        greenBoxTitle: content1GreenBoxTitle,
        greenBoxSubtitle: content1GreenBoxSubTitle,
        banner2: { photo: idBanner2Photo, video: idBanner2Video },
      },
      infoBox: {
        box1: {
          photo: { photo: idInfoBox1Photo, video: idInfoBox1Video },
          title: infoBox1Title,
          content: infoBox1Content,
        },
        box2: {
          photo: { photo: idInfoBox2Photo, video: idInfoBox2Video },
          title: infoBox2Title,
          content: infoBox2Content,
        },
      },
      blackBox: {
        title: blackBoxTitle,
        content: blackBoxContent,
        title2: blackBoxTitle2,
        content2: blackBoxContent2,
      },
      noNews,
    };

    if (checkHomeConfig) {
      await this.homeConfigRepository.updateOptions(
        checkHomeConfig._id,
        dataUpdate,
      );
      return responseS5M(
        HttpStatusCode.OK,
        dataUpdate,
        MessageClientCode.UPDATE_SUCCESS,
      );
    } else {
      await this.homeConfigRepository.store(
        <HomeConfigDocument>(<unknown>dataUpdate),
      );
      return responseS5M(
        HttpStatusCode.OK,
        dataUpdate,
        MessageClientCode.UPDATE_SUCCESS,
      );
    }
  }

  async update(
    updateHomeConfigDto: UpdateHomeConfigDto,
    files: Express.Multer.File[],
  ) {
    const {
      url,
      infoBox2Title,
      infoBox1Title,
      infoBox2Content,
      infoBox1Content,
      blackBoxContent2,
      blackBoxTitle2,
      blackBoxTitle,
      blackBoxContent,
      content1WhoWeAreTitle,
      content1WhoWeAreSubTitle,
      content1GreenBoxTitle,
      content1GreenBoxSubTitle,
      subSlogan,
      slogan,
    } = updateHomeConfigDto;

    let fileIDs: any = {};

    let folderId;

    const homeConfigFolder = await this._foldersService.getOneFolderByName(
      HomeConfigConstant.MODEL_NAME,
    );

    if (homeConfigFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
      const newFolder = await this._foldersService.add({
        name: HomeConfigConstant.MODEL_NAME,
        parentId: undefined,
      });

      folderId = newFolder.META_DATA._id;
    } else {
      folderId = homeConfigFolder.META_DATA._id;
    }

    for await (const file of files) {
      const uploadFile = await this._serviceUploadFiles.uploadPublicFile(
        file.buffer,
        file.fieldname,
      );

      const addFile = await this._photosService.add({
        link: uploadFile.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });
      fileIDs[`${file.fieldname}`] = addFile.META_DATA._id;
    }

    const checkHomeConfig = await this.homeConfigRepository.getHomeConfig();
    const noNews = await this.newsService.countNews();

    const homeConfigData = {
      url,
      logo: fileIDs.logo,
      logoMobile: fileIDs.logoMobile,
      banner: fileIDs.banner,
      slogan: { slogan: slogan, subSlogan: subSlogan },
      content1: {
        whoWeAreTitle: content1WhoWeAreTitle,
        whoWeAreSubtitle: content1WhoWeAreSubTitle,
        greenBoxTitle: content1GreenBoxTitle,
        greenBoxSubtitle: content1GreenBoxSubTitle,
        banner2: { photo: fileIDs.banner2Photo, video: fileIDs.banner2Video },
      },
      infoBox: {
        box1: {
          photo: { photo: fileIDs.infoBox1Photo, video: fileIDs.infoBox1Video },
          title: infoBox1Title,
          content: infoBox1Content,
        },
        box2: {
          photo: { photo: fileIDs.infoBox2Photo, video: fileIDs.infoBox2Video },
          title: infoBox2Title,
          content: infoBox2Content,
        },
      },
      blackBox: {
        title: blackBoxTitle,
        content: blackBoxContent,
        title2: blackBoxTitle2,
        content2: blackBoxContent2,
      },
      noNews,
    };

    if (!checkHomeConfig) {
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        `${MessageClientCode.NOT_FOUND}: HomeConfig`,
      );
    }

    const homeConfigDataUpdate = {
      url: url ? url : checkHomeConfig.url,
      logo: fileIDs.logo ? fileIDs.logo : checkHomeConfig.logo,
      logoMobile: fileIDs.logoMobile ? fileIDs.logoMobile : checkHomeConfig.logoMobile,
      banner: fileIDs.banner ? fileIDs.banner : checkHomeConfig.banner,
      slogan: {
        slogan: slogan ? slogan : checkHomeConfig.slogan?.slogan,
        subSlogan: subSlogan ? subSlogan : checkHomeConfig.slogan?.subSlogan,
      },
      content1: {
        whoWeAreTitle: content1WhoWeAreTitle
          ? content1WhoWeAreTitle
          : checkHomeConfig.content1?.whoWeAreTitle,
        whoWeAreSubtitle: content1WhoWeAreSubTitle
          ? content1WhoWeAreSubTitle
          : checkHomeConfig.content1?.whoWeAreSubtitle,
        greenBoxTitle: content1GreenBoxTitle
          ? content1GreenBoxTitle
          : checkHomeConfig.content1?.greenBoxTitle,
        greenBoxSubtitle: content1GreenBoxSubTitle
          ? content1GreenBoxSubTitle
          : checkHomeConfig.content1?.greenBoxSubtitle,
        banner2: {
          photo: fileIDs.banner2Photo
            ? fileIDs.banner2Photo
            : checkHomeConfig.content1?.banner2?.photo,
          video: fileIDs.banner2Video
            ? fileIDs.banner2Video
            : checkHomeConfig.content1?.banner2?.video,
        },
      },
      infoBox: {
        box1: {
          photo: {
            photo: fileIDs.infoBox1Photo
              ? fileIDs.infoBox1Photo
              : checkHomeConfig.infoBox?.box1?.photo?.photo,
            video: fileIDs.infoBox1Video
              ? fileIDs.infoBox1Video
              : checkHomeConfig.infoBox?.box1?.photo?.video,
          },
          title: infoBox1Title
            ? infoBox1Title
            : checkHomeConfig.infoBox?.box1?.title,
          content: infoBox1Content
            ? infoBox1Content
            : checkHomeConfig.infoBox?.box1?.content,
        },
        box2: {
          photo: {
            photo: fileIDs.infoBox2Photo
              ? fileIDs.infoBox2Photo
              : checkHomeConfig.infoBox?.box2?.photo?.photo,
            video: fileIDs.infoBox2Video
              ? fileIDs.infoBox2Video
              : checkHomeConfig.infoBox?.box2?.photo?.video,
          },
          title: infoBox2Title
            ? infoBox2Title
            : checkHomeConfig.infoBox?.box2?.title,
          content: infoBox2Content
            ? infoBox2Content
            : checkHomeConfig.infoBox?.box2?.content,
        },
      },
      blackBox: {
        title: blackBoxTitle ? blackBoxTitle : checkHomeConfig.blackBox?.title,
        content: blackBoxContent
          ? blackBoxContent
          : checkHomeConfig.blackBox?.content,
        title2: blackBoxTitle2
          ? blackBoxTitle2
          : checkHomeConfig.blackBox?.title2,
        content2: blackBoxContent2
          ? blackBoxContent2
          : checkHomeConfig.blackBox?.content2,
      },
      noNews: noNews ? noNews : checkHomeConfig.noNews,
    };

    await this.homeConfigRepository.updateOptions(
      checkHomeConfig._id,
      homeConfigDataUpdate,
      { omitUndefined: true },
    );

    return responseS5M(
      HttpStatusCode.OK,
      homeConfigDataUpdate,
      MessageClientCode.UPDATE_SUCCESS,
    );

    // await this.homeConfigRepository.store(
    //   <HomeConfigDocument>(<unknown>homeConfigData),
    // );

    // return responseS5M(
    //   HttpStatusCode.OK,
    //   homeConfigData,
    //   MessageClientCode.UPDATE_SUCCESS,
    // );
  }

  async uploadPhotos(files: Express.Multer.File[]) {
    const medataFiles: any = {};

    files.find((item: Express.Multer.File) => {
      item.fieldname == 'logo'
        ? (medataFiles['logo'] = item)
        : item.fieldname == 'logoMobile'
        ? (medataFiles['logoMobile'] = item)
        : item.fieldname == 'banner'
        ? (medataFiles['banner'] = item)
        : item.fieldname == 'infoBox2Photo'
        ? (medataFiles['infoBox2Photo'] = item)
        : item.fieldname == 'infoBox1Photo'
        ? (medataFiles['infoBox1Photo'] = item)
        : item.fieldname == 'infoBox2Video'
        ? (medataFiles['infoBox2Video'] = item)
        : item.fieldname == 'infoBox1Video'
        ? (medataFiles['infoBox1Video'] = item)
        : item.fieldname == 'banner2Video'
        ? (medataFiles['banner2Video'] = item)
        : (medataFiles['banner2Photo'] = item);
    });

    let folderId;
    let idArray: any = {};

    const homeConfigFolder = await this._foldersService.getOneFolderByName(
      HomeConfigConstant.MODEL_NAME,
    );

    if (homeConfigFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
      const newFolder = await this._foldersService.add({
        name: HomeConfigConstant.MODEL_NAME,
        parentId: undefined,
      });

      folderId = newFolder.META_DATA._id;
    } else {
      folderId = homeConfigFolder.META_DATA._id;
    }

    for (const photoName in medataFiles) {
      const upload: ManagedUpload.SendData =
        await this._serviceUploadFiles.uploadPublicFile(
          medataFiles[photoName].buffer,
          medataFiles[photoName].fieldname,
        );

      const photoDb = await this._photosService.add({
        link: upload.Location,
        folder: folderId,
        status: StatusType.PUBLISHED,
      });

      const fieldIdName: string =
        'id' + photoName[0].toUpperCase() + photoName.slice(1);

      idArray[fieldIdName] = photoDb.META_DATA._id;
    }

    return idArray;
  }

  async updateNoNews(quantity: number) {
    const checkHomeConfig = await this.homeConfigRepository.getHomeConfig();
    if (checkHomeConfig) {
      return this.homeConfigRepository.updateNoNews(
        checkHomeConfig._id,
        quantity,
      );
    }
  }

  async delete() {
    const checkHomeConfig = await this.homeConfigRepository.getHomeConfig();
    if (!checkHomeConfig)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const result = await this.homeConfigRepository.remove(checkHomeConfig._id);
    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      result,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async restore(id: string | Types.ObjectId) {
    const checkHomeConfig = await this.homeConfigRepository.getHomeConfig();
    if (checkHomeConfig)
      return responseS5M(
        HttpStatusCode.BAD_REQUEST,
        undefined,
        'Restore record failed',
      );

    const result = await this.homeConfigRepository.restore(id);
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

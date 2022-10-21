import { StatusType } from 'src/enums/statuses.enum';
import { PhotosService } from './../../photos/photos.service';
import { uploadFileS3ForAdmin } from './../../../../shared/uploadServices/uploadFiles.const';
import { S3UploadFileService } from 'src/shared/uploadServices/uploadFiles.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MessageClientCode } from '../../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../../common/response';
import { MessageTemplate } from '../../../../constants/message.constants';
import HttpStatusCode from '../../../../shared/statusCode.enum';
import { AboutUsService } from '../../about-us/about-us.service';
import { PhotosRepository } from '../../photos/photos.repository';
import { CreateMemberDto } from './dtos/create-member.dto';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { MembersRepository } from './members.repository';
import { MemberDocument } from './schemas/members.schema';
import filterObject from '../../../../common/utils/filter-object';
import { FoldersService } from '../../folders/folders.service';
import { MemberConstant } from './members.constant';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@Injectable()
export class MembersService {
  constructor(
    private membersRepository: MembersRepository,
    private _photosService: PhotosService,
    private _foldersService: FoldersService,
    @Inject(forwardRef(() => AboutUsService))
    private aboutUsService: AboutUsService,
    @Inject(uploadFileS3ForAdmin) private _uploadService: S3UploadFileService,
  ) {}

  async add(createMemberDto: CreateMemberDto, file: Express.Multer.File) {
    const { name, position, team, order, status, parentId } = createMemberDto;
    let idPhoto;
    let dataMember;
    if (file) {
      const metaData = await this._uploadService.uploadPublicFile(
        file.buffer,
        file.fieldname,
      );
      // console.log(metaData)

      let folderId;

      const memberFolder = await this._foldersService.getOneFolderByName(
        MemberConstant.MODEL_NAME,
      );

      if (memberFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: MemberConstant.MODEL_NAME,
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = memberFolder.META_DATA._id;
      }

      const photo = await this._photosService.add({
        link: metaData.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });
      idPhoto = photo.META_DATA._id;
    }

    dataMember = {
      name,
      position,
      team,
      order,
      status,
      photo: idPhoto,
      parentId,
    };

    dataMember = filterObject(dataMember);

    const newMember = await this.membersRepository.store(
      <MemberDocument>(<unknown>dataMember),
    );

    const aboutUs = await this.aboutUsService.getAboutUs();
    const noMembers = await this.membersRepository.getNoMembers();
    if (aboutUs.STATUS_CODE == HttpStatusCode.OK) {
      await this.aboutUsService.updateNoMembers(noMembers);
    }

    return responseS5M(
      HttpStatusCode.CREATED,
      newMember,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async getAll() {
    const members: any = await this.membersRepository.getAllMembers();
    // let result = [];
    // for (let index = 0; index < members.length; index++) {
    //   const getChildren = await this.dataTree(members, members[index]!._id);
    //   result.push({ ...members[index]._doc, children: getChildren });
    // }
    return responseS5M(
      HttpStatusCode.OK,
      members,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllPaginate(paginate: PaginateQuery) {
    const members: any = await this.membersRepository.get({
      paginate,
      options: {
        populate: [
          { path: 'team', select: 'name' },
          { path: 'photo', select: 'link' },
        ],
      },
    });
    // let result = [];
    // for (let index = 0; index < members.length; index++) {
    //   const getChildren = await this.dataTree(members, members[index]!._id);
    //   result.push({ ...members[index]._doc, children: getChildren });
    // }
    return responseS5M(
      HttpStatusCode.OK,
      members,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getById(id: string | Types.ObjectId) {
    const member: any = await this.membersRepository.getMemberById(id);

    if (!member) {
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );
    }

    const members = await this.membersRepository.getAllMembers();
    const getChildren = await this.dataTree(members, member!._id);

    console.log(member);
    return responseS5M(
      HttpStatusCode.OK,
      member,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async getNoMembers() {
    return this.membersRepository.getNoMembers();
  }

  async update(
    id: string | Types.ObjectId,
    updateMemberDto: UpdateMemberDto,
    file?: Express.Multer.File,
  ) {
    const { name, position, team, order, status } = updateMemberDto;

    let idPhoto;
    let memberProperties;

    const memberFound = await this.membersRepository.getMemberById(id);
    if (!memberFound)
      responseS5M(HttpStatusCode.NOT_FOUND, id, MessageClientCode.NOT_FOUND);

    if (file) {
      const metaData = await this._uploadService.uploadPublicFile(
        file.buffer,
        file.fieldname,
      );

      let folderId;

      const memberFolder = await this._foldersService.getOneFolderByName(
        MemberConstant.MODEL_NAME,
      );

      if (memberFolder.STATUS_CODE == HttpStatusCode.NOT_FOUND) {
        const newFolder = await this._foldersService.add({
          name: 'Member',
          parentId: undefined,
        });

        folderId = newFolder.META_DATA._id;
      } else {
        folderId = memberFolder.META_DATA._id;
      }

      const photo = await this._photosService.add({
        link: metaData.Location,
        folder: folderId.toString(),
        status: StatusType.PUBLISHED,
      });

      // delete old photo
      await this._photosService.softDelete(memberFound?.photo!);
      idPhoto = photo.META_DATA._id;

      memberProperties = {
        ...updateMemberDto,
        photo: idPhoto,
      };
    } else {
      memberProperties = { ...updateMemberDto };
    }

    memberProperties = filterObject(memberProperties);

    const newMember = await this.membersRepository.update(id, memberProperties);

    return responseS5M(
      HttpStatusCode.OK,
      newMember,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async delete(id: string | Types.ObjectId) {
    const checkMember = await this.membersRepository.getById(id);
    if (!checkMember)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const result = await this.membersRepository.remove(id);
    if (result.deleted == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const aboutUs = await this.aboutUsService.getAboutUs();
    if (aboutUs.STATUS_CODE == HttpStatusCode.OK) {
      const newNoMembers = await this.membersRepository.getNoMembers();
      await this.aboutUsService.updateNoMembers(newNoMembers);
    }

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async hardDelete(id: string | Types.ObjectId) {
    const checkMember = await this.membersRepository.getById(id);
    if (!checkMember)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );
    await this.membersRepository.hardDelete(id);

    const aboutUs = await this.aboutUsService.getAboutUs();
    if (aboutUs.STATUS_CODE == HttpStatusCode.OK) {
      const newNoMembers = await this.membersRepository.getNoMembers();
      await this.aboutUsService.updateNoMembers(newNoMembers);
    }

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async restore(id: string | Types.ObjectId) {
    const result = await this.membersRepository.restore(id);

    if (result.restored == 0)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    const aboutUs = await this.aboutUsService.getAboutUs();
    let oldNoMembers: number;
    if (aboutUs.STATUS_CODE == HttpStatusCode.OK) {
      const newNoMembers = await this.membersRepository.getNoMembers();
      await this.aboutUsService.updateNoMembers(newNoMembers);
    }

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.RESTORE_SUCCESS,
    );
  }

  async dataTree(data: any, id: string) {
    const result = [];
    for (let index = 0; index < data.length; index++) {
      if (data[index].parentId == id.toString()) {
        result.push(data[index]);
      }
    }
    return result;
  }
}

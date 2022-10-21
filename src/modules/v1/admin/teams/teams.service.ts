import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { IListParams } from 'src/modules/base/Pagination/IPaginate';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { MessageClientCode } from '../../../../common/messRespon/messageResponse.respon';
import responseS5M from '../../../../common/response';
import { MessageTemplate } from '../../../../constants/message.constants';
import HttpStatusCode from '../../../../shared/statusCode.enum';
import CreateTeamDto from './dtos/create-team.dto';
import UpdateTeamDto from './dtos/update-team.dto';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(private teamsRepository: TeamsRepository) {}

  async getAllTeams() {
    const teams = await this.teamsRepository.getAll();
    return responseS5M(
      HttpStatusCode.OK,
      teams,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getAllTeamsPaginate(paginate: PaginateQuery) {
    const teams = await this.teamsRepository.get({ paginate });
    return responseS5M(
      HttpStatusCode.OK,
      teams,
      MessageClientCode.GET_ALL_SUCCESS,
    );
  }

  async getTeamById(id: string | Types.ObjectId) {
    const team = await this.teamsRepository.getById(id);

    if (!team)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    return responseS5M(
      HttpStatusCode.OK,
      team,
      MessageClientCode.GET_ITEM_SUCCESS,
    );
  }

  async add(createTeamDto: CreateTeamDto) {
    const nameAdd = createTeamDto.name;
    const checkName = await this.teamsRepository.findByCodition({
      name: nameAdd,
      isDeleted: false,
    });
    if (checkName.length > 0)
      return responseS5M(
        HttpStatusCode.BAD_GATEWAY,
        undefined,
        MessageTemplate.ITEM_ALREADY_EXIST,
      );

    const newTeam = await this.teamsRepository.add(createTeamDto);

    return responseS5M(
      HttpStatusCode.CREATED,
      newTeam,
      MessageClientCode.ADD_SUCCESS,
    );
  }

  async updateTeam(id: Types.ObjectId, updateTeamDto: UpdateTeamDto) {
    const { name, order, status } = updateTeamDto;
    const checkTeam = await this.teamsRepository.getById(id);
    console.log(updateTeamDto);

    if (!checkTeam)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    if (name) {
      const teamNameExisted = await this.teamsRepository.existed({
        name: name,
        isDeleted: false,
        _id: { $ne: id },
      });

      if (teamNameExisted)
        return responseS5M(
          HttpStatusCode.BAD_REQUEST,
          name,
          MessageTemplate.ITEM_ALREADY_EXIST,
        );
    }

    const updatedTeam = await this.teamsRepository.updateById(
      id,
      updateTeamDto,
    );

    return responseS5M(
      HttpStatusCode.OK,
      updatedTeam,
      MessageClientCode.UPDATE_SUCCESS,
    );
  }

  async softDelete(id: string | Types.ObjectId) {
    const result = await this.teamsRepository.softDelete(id);

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
    const checkTeam = await this.teamsRepository.getById(id);
    if (!checkTeam)
      return responseS5M(
        HttpStatusCode.NOT_FOUND,
        undefined,
        MessageClientCode.NOT_FOUND,
      );

    await this.teamsRepository.hardDelete(id);

    return responseS5M(
      HttpStatusCode.NO_CONTENT,
      undefined,
      MessageClientCode.REMOVE_SUCCESS,
    );
  }

  async restoreTeam(id: string | Types.ObjectId) {
    const result = await this.teamsRepository.restore(id);

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

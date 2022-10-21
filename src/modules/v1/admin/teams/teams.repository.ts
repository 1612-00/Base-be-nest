import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { StatusType } from '../../../../enums/statuses.enum';
import CreateTeamDto from './dtos/create-team.dto';
import UpdateTeamDto from './dtos/update-team.dto';
import { Team, TeamDocument } from './schemas/teams.schema';

@Injectable()
export class TeamsRepository extends Repository<TeamDocument> {
  constructor(
    @InjectModel(Team.name) private teamsModel: SoftDeleteModel<TeamDocument>,
  ) {
    super(teamsModel);
  }

  async add(createTeamDto: CreateTeamDto) {
    let newTeam: TeamDocument;

    newTeam = await this.teamsModel.create(<TeamDocument>createTeamDto);

    return newTeam.toJSON();
  }

  async updateById(id: string | Types.ObjectId, updateTeamDto: UpdateTeamDto) {
    return this.teamsModel
      .findByIdAndUpdate(id, { $set: updateTeamDto }, { new: true })
      .exec();
  }
}

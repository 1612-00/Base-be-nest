import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import AdminService from '@v1/admin/admin.service';
import UsersModule from '@v1/users/users.module';
import { Team, TeamSchema } from './teams/schemas/teams.schema';
import { TeamsModule } from './teams/teams.module';
import { TeamsRepository } from './teams/teams.repository';
import { TeamsService } from './teams/teams.service';

@Module({
  imports: [
    UsersModule,
    TeamsModule,
    MongooseModule.forFeature([
      {
        name: Team.name,
        schema: TeamSchema,
      },
    ]),
  ],
  providers: [AdminService, TeamsService, TeamsRepository],
  exports: [AdminService, TeamsService, TeamsRepository],
})
export default class AdminModule {}

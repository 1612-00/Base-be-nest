import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import WrapResponseInterceptor from '../../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../../pipes/parse-object-id.pipe';
import CreateTeamDto from './dtos/create-team.dto';
import UpdateTeamDto from './dtos/update-team.dto';
import { Team } from './schemas/teams.schema';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@ApiExtraModels(Team)
@ApiBearerAuth()
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all teams',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Team),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Get()
  async getAllTeams() {
    const allTeams = await this.teamsService.getAllTeams();

    return allTeams;
  }

  @Get('/paginate')
  async getAllTeamsPaginate(@Query() paginate: PaginateQuery) {
    const allTeams = await this.teamsService.getAllTeamsPaginate(paginate);

    return allTeams;
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Team),
        },
      },
    },
    description: '200. Success. Returns a Team',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Team was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.teamsService.getTeamById(id);
  }

  @Post()
  // @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
  async add(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.add(createTeamDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  // @Auth()
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(id, updateTeamDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  // @Auth()
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.teamsService.softDelete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('hard-delete/:id')
  async hardDelete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.teamsService.hardDelete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.teamsService.restoreTeam(id);
  }
}

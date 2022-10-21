import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Teams')
@Controller()
export class PublicTeamsController {
  constructor(private readonly publicService: PublicService) {}

  //#region Teams
  @Get('/teams')
  async getTeams() {
    return await this.publicService.getTeams();
  }

  @Get('/teams/paginate')
  async getTeamsPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getTeamsPaginate(paginate);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('/teams/:id')
  async getTeamById(@Param('id') id: string) {
    return await this.publicService.getTeamById(id);
  }
  //#endregion Teams
}

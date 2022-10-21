import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Projects')
@Controller()
export class PublicProjectsController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region Projects
  @Get('/projects')
  async getProjects() {
    return await this.publicService.getProjects();
  }

  @Get('/projects/paginate')
  async getProjectsPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getProjectsPaginate(paginate);
  }

  @Get('/projects/:id')
  async getProjectById(@Param('id') id: string) {
    return await this.publicService.getProjectById(id);
  }
  //#endregion Projects
}

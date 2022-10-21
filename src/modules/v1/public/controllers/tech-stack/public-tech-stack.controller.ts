import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Tech Stack')
@Controller()
export class PublicTechStackController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region TechStacks
  @Get('/tech-stack')
  async getTechStacks() {
    return await this.publicService.getTechStacks();
  }

  @Get('/tech-stack/paginate')
  async getTechStacksPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getTechStacksPaginate(paginate);
  }

  @Get('/tech-stack/:id')
  async getTechStackById(@Param('id') id: string) {
    return await this.publicService.getTechStackById(id);
  }
  //#endregion TechStacks
}

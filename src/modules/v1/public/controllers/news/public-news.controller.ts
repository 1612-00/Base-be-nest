import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public News')
@Controller()
export class PublicNewsController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region News
  @Get('/news')
  async getNews() {
    return await this.publicService.getNews();
  }

  @Get('/news/paginate')
  async getNewsPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getNewsPaginate(paginate);
  }

  @Get('/news/:id')
  async getNewById(@Param('id') id: string) {
    return await this.publicService.getNewById(id);
  }
  //#endregion News
}

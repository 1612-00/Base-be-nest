import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Folders')
@Controller()
export class PublicFoldersController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region Folders
  @Get('/folders')
  async getFolders() {
    return await this.publicService.getFolders();
  }

  @Get('/folders/paginate')
  async getFoldersPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getFoldersPaginate(paginate);
  }

  @Get('/folders/:id')
  async getFolderById(@Param('id') id: string) {
    return await this.publicService.getFolderById(id);
  }
  //#endregion Folders
}

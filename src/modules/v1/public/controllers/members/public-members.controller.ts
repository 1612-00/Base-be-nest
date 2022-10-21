import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Members')
@Controller()
export class PublicMembersController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region Members
  @Get('/members')
  async getMembers() {
    return await this.publicService.getMembers();
  }

  @Get('/members/paginate')
  async getMembersPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getMembersPaginate(paginate);
  }

  @Get('/members/:id')
  async getMemberById(@Param('id') id: string) {
    return await this.publicService.getMemberById(id);
  }
  //#endregion Members
}

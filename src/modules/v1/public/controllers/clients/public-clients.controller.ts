import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Clients')
@Controller()
export class PublicClientsController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region Clients
  @Get('/clients')
  async getClients() {
    return await this.publicService.getClients();
  }

  @Get('/clients/paginate')
  async getClientsPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getClientsPaginate(paginate);
  }

  @Get('/clients/:id')
  async getClientById(@Param('id') id: string) {
    return await this.publicService.getClientById(id);
  }
  //#endregion Clients
}

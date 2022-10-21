import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Public Photos')
@Controller()
export class PublicPhotosController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region Photos
  @Get('/photos')
  async getPhotos() {
    return await this.publicService.getPhotos();
  }

  @Get('/photos/paginate')
  async getPhotosPaginate(@Query() paginate: PaginateQuery) {
    return await this.publicService.getPhotosPaginate(paginate);
  }

  @Get('/photos/:id')
  async getPhotoById(@Param('id') id: string) {
    return await this.publicService.getPhotoById(id);
  }
  //#endregion Photos
}

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';

@ApiTags('Public Home Config')
@Controller()
export class PublicHomeConfigController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region Home Config
  @Get('/home-config')
  async getHomeConfig() {
    return await this.publicService.getHomeConfig();
  }
  //#endregion Home Config
}

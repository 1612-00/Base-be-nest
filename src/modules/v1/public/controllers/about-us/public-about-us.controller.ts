import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';

@ApiTags('Public About Us')
@Controller()
export class PublicAboutUsController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region AboutUs
  @Get('/about-us')
  async getAboutUs() {
    return await this.publicService.getAboutUs();
  }
  //#endregion AboutUs
}

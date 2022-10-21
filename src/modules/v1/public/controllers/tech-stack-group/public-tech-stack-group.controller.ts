import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicService } from '@v1/public/public.service';

@ApiTags('Public Tech Stack Group')
@Controller()
export class PublicTechStackGroupController {
  constructor(private readonly publicService: PublicService) {}
  
  //#region TechStackGroup
  @Get('/tech-stack-group')
  async getTechStackGroup() {
    return await this.publicService.getTechStackGroup();
  }

  @Get('/tech-stack-group/:id')
  async getTechStackGroupById(@Param('id') id: string) {
    return await this.publicService.getTechStackGroupById(id);
  }
  //#endregion TechStackGroup
}

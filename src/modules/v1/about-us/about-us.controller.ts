import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import WrapResponseInterceptor from '../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../pipes/parse-object-id.pipe';
import { ParseFile } from '../../../shared/uploadServices/uploadFiles.pipe';
import { OurStory } from '../our-story/schemas/our-story.schema';
import { AboutUsService } from './about-us.service';
import { CreateAboutUsDto } from './dtos/create-about-us.dto';
import { UpdateAboutUsDto } from './dtos/update-about-us.dto';
import { AboutUs } from './schemas/about-us.schema';

@ApiTags('About Us')
@ApiBearerAuth()
@ApiExtraModels(AboutUs, OurStory)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  async getAboutUs() {
    return this.aboutUsService.getAboutUs();
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'content about us',
        },
        duPhoto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('duPhoto'))
  @ApiConsumes('multipart/form-data')
  @Post()
  async add(
    @Body() createAboutUsDto: CreateAboutUsDto,
    @UploadedFile(ParseFile) duPhoto: Express.Multer.File,
  ) {
    return this.aboutUsService.create(createAboutUsDto, duPhoto);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'content about us',
        },
        duPhoto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('duPhoto'))
  @ApiConsumes('multipart/form-data')
  @Patch('update')
  async update(
    @Body() updateAboutUsDto: UpdateAboutUsDto,
    @UploadedFile(ParseFile) duPhoto?: Express.Multer.File,
  ) {
    return this.aboutUsService.update(updateAboutUsDto, duPhoto);
  }

  @Delete('delete')
  async delete() {
    return this.aboutUsService.delete();
  }

  @Post('restore/:id')
  @ApiParam({ name: 'id', type: String })
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.aboutUsService.restore(id);
  }
}

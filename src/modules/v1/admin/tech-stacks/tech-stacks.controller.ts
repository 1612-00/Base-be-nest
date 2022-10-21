import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import WrapResponseInterceptor from '../../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../../pipes/parse-object-id.pipe';
import { ParseFile } from '../../../../shared/uploadServices/uploadFiles.pipe';
import { TechStackGroup } from '../techStackGroup/schemas/techStackGroup.schema';
import { CreateTechStackDto } from './dtos/create-tech-stack.dto';
import { UpdateTechStackDto } from './dtos/update-tech-stack.dto';
import { TechStack } from './schemas/tech-stacks.schema';
import { TechStacksService } from './tech-stacks.service';

@ApiTags('Tech Stacks')
@ApiBearerAuth()
@ApiExtraModels(TechStack)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class TechStacksController {
  constructor(private readonly techStacksService: TechStacksService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all teams',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(TechStack),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Get()
  async getAll() {
    return this.techStacksService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.techStacksService.getAllPaginate(paginate);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(TechStack),
        },
      },
    },
    description: '200. Success. Returns a Team',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Team was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.techStacksService.getById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateTechStackDto,
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  async add(
    @Body() createTechStackDto: CreateTechStackDto,
    @UploadedFile(ParseFile) photo: Express.Multer.File,
  ) {
    return this.techStacksService.add(createTechStackDto, photo);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateTechStackDto,
  })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateTechStackDto: UpdateTechStackDto,
    @UploadedFile(ParseFile) photo?: Express.Multer.File,
  ) {
    return this.techStacksService.update(id, updateTechStackDto, photo);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.techStacksService.softDelete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('hard-delete/:id')
  async hardDelete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.techStacksService.hardDelete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.techStacksService.restore(id);
  }
}

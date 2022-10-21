import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
import WrapResponseInterceptor from '../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../pipes/parse-object-id.pipe';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { FoldersService } from './folders.service';
import { Folder } from './schemas/folders.schema';

@ApiBearerAuth()
@ApiTags('Folders')
@ApiExtraModels(Folder)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all folders',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Folder),
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
    return this.foldersService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.foldersService.getAllPaginate(paginate);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Folder),
        },
      },
    },
    description: '200. Success. Returns a Folder',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Folder was not found',
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
    return this.foldersService.getById(id);
  }

  @Post()
  @ApiBody({ type: CreateFolderDto })
  async add(@Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.add(createFolderDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.foldersService.update(id, updateFolderDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.foldersService.softDelete(id);
  }

  @Post('restore/:id')
  @ApiParam({ name: 'id', type: String })
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.foldersService.restore(id);
  }
}

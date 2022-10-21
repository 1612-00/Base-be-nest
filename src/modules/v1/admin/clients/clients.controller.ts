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
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Client } from './schemas/clients.schema';

@ApiTags('Clients')
@ApiExtraModels(Client)
@ApiBearerAuth()
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all Clients',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Client),
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
    return this.clientsService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.clientsService.getAllPaginate(paginate);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Client),
        },
      },
    },
    description: '200. Success. Returns a Client',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Client was not found',
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
  async get(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.clientsService.getById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateClientDto,
    schema: {
      type: 'object',
      properties: { photo: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  async add(
    @Body() createClientDto: CreateClientDto,
    @UploadedFile(ParseFile) photo: Express.Multer.File,
  ) {
    return this.clientsService.create(createClientDto, photo);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateClientDto,
    schema: {
      type: 'object',
      properties: { photo: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFile(ParseFile) photo?: Express.Multer.File,
  ) {
    return this.clientsService.update(id, updateClientDto, photo);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.clientsService.delete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.clientsService.restore(id);
  }
}

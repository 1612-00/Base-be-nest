import { StatusType } from 'src/enums/statuses.enum';
import { FileInterceptor } from '@nestjs/platform-express';
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
import {
  ApiOkResponse,
  getSchemaPath,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiExtraModels,
  ApiConsumes,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import WrapResponseInterceptor from '../../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../../pipes/parse-object-id.pipe';
import { CreateMemberDto } from './dtos/create-member.dto';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { MembersService } from './members.service';
import { Member } from './schemas/members.schema';
import { ParseFile } from '../../../../shared/uploadServices/uploadFiles.pipe';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('Members')
@ApiBearerAuth()
@ApiExtraModels(Member)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all members',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Member),
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
    return this.membersService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.membersService.getAllPaginate(paginate);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Member),
        },
      },
    },
    description: '200. Success. Returns a Member',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Member was not found',
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
    return this.membersService.getById(id);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'name of the member',
          example: 'Le Van A',
        },
        photo: {
          type: 'string',
          format: 'binary',
        },
        position: {
          type: 'string',
          description: 'posittion of the member',
          example: 'CEO',
        },
        team: {
          type: 'string',
          description: 'team of the member',
          example: '6343be07e5cb522b5db9b089',
        },
        parentId: {
          type: 'string',
          description: 'manager id of the member',
          example: '6343be07e5cb522b5db9b089',
        },
        order: {
          type: 'integer',
          description: 'order of the member',
          example: '1',
        },
        status: {
          type: 'array',
          items: {
            enum: [StatusType.ARCHIVED, StatusType.DRAFT, StatusType.PUBLISHED],
          },
          description: 'status of the member',
          example: 'true',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @Post()
  async add(
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFile(ParseFile) photo: Express.Multer.File,
  ) {
    return this.membersService.add(createMemberDto, photo);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'name of the member',
          example: 'Le Van A',
        },
        photo: {
          type: 'string',
          format: 'binary',
        },
        position: {
          type: 'string',
          description: 'posittion of the member',
          example: 'CEO',
        },
        team: {
          type: 'string',
          description: 'team of the member',
          example: '6343be07e5cb522b5db9b089',
        },
        order: {
          type: 'integer',
          description: 'order of the member',
          example: '1',
        },
        status: {
          type: 'array',
          items: {
            enum: [StatusType.ARCHIVED, StatusType.DRAFT, StatusType.PUBLISHED],
          },
          description: 'status of the member',
          example: 'true',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile(ParseFile) photo?: Express.Multer.File,
  ) {
    return this.membersService.update(id, updateMemberDto, photo);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.membersService.delete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('hard-delete/:id')
  async hardDelete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.membersService.hardDelete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.membersService.restore(id);
  }
}

import { FilesInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { TechStackGroupService } from './techStackGroup.service';
import ParseObjectIdPipe from '@pipes/parse-object-id.pipe';
import { TechStackGroup } from './schemas/techStackGroup.schema';
import techStackGroupCreateDto, {
  techStackGroupUpdateDto,
} from './dto/techStackGroup.dto';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';

@ApiTags('TechStackGroup')
@ApiBearerAuth()
@ApiExtraModels(TechStackGroup)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class TechStackGroupController {
  constructor(
    private readonly techStackGroupServiceteamsService: TechStackGroupService,
  ) {}

  @ApiOkResponse({
    description: '200. Success. Returns all teams',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(TechStackGroup),
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
  async getAllTeams() {
    return this.techStackGroupServiceteamsService.getAllTechStackGroup();
  }

  @Get()
  async getAllTeamsPaginate(@Query() paginate: PaginateQuery) {
    return this.techStackGroupServiceteamsService.getAllTechStackGroupPaginate(
      paginate,
    );
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(TechStackGroup),
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
    return this.techStackGroupServiceteamsService.getTechStackGroupById(id);
  }

  @Post()
  // @Auth()
  async add(@Body() createTechStackGroupDto: techStackGroupCreateDto) {
    return this.techStackGroupServiceteamsService.createTechStackGroup(
      createTechStackGroupDto,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  // @Auth()
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateTechStackGroupDto: techStackGroupUpdateDto,
  ) {
    return this.techStackGroupServiceteamsService.UpdateTechStackGroupById(
      id,
      updateTechStackGroupDto,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  // @Auth()
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.techStackGroupServiceteamsService.DeleteTechStackGroupById(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.techStackGroupServiceteamsService.RestoreTechStackGroupById(id);
  }

  // @ApiBody({
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           files: {
  //             type: 'string',
  //             format: 'binary',
  //           },
  //         },
  //       },
  //     })
  // @UseInterceptors(FilesInterceptor('files'))
  // @Post('files')
  // @ApiConsumes('multipart/form-data')
  // async uploadFile(
  //   @UploadedFiles(ParseFile) files: Array<Express.Multer.File>,
  // ) {
  //   const result = await this.techStackGroupServiceteamsService.testfile(files) ;
  //   return result
  // }
}

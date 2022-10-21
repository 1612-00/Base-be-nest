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
  UseFilters,
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
import { ConvertToObjectIdArray } from '../../../../decorators/convert-to-objectid-array.decorator';
import WrapResponseInterceptor from '../../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../../pipes/parse-object-id.pipe';
import { ParseFile } from '../../../../shared/uploadServices/uploadFiles.pipe';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/projects.schema';

@ApiTags('Projects')
@ApiExtraModels(Project)
@ApiBearerAuth()
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all Projects',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Project),
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
    return this.projectsService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.projectsService.getAllPaginate(paginate);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Project),
        },
      },
    },
    description: '200. Success. Returns a Project',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Project was not found',
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
    return this.projectsService.getById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProjectDto,
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  async add(
    @Body() createProjectDto: CreateProjectDto,
    @ConvertToObjectIdArray('memberList') memberListArray: string[],
    @UploadedFile(ParseFile) photo: Express.Multer.File,
  ) {
    return this.projectsService.create(
      createProjectDto,
      memberListArray,
      photo,
    );
  }

  @ApiBody({ type: UpdateProjectDto })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateProjectDto: UpdateProjectDto,
    @ConvertToObjectIdArray('memberList') memberListArray: string[],
    @UploadedFile(ParseFile) photo?: Express.Multer.File,
  ) {
    return this.projectsService.update(
      id,
      updateProjectDto,
      memberListArray,
      photo,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.projectsService.delete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.projectsService.restore(id);
  }
}

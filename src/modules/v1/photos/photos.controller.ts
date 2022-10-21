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
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { ConvertToArray } from '../../../decorators/convert-to-array.decorator.';
import WrapResponseInterceptor from '../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../pipes/parse-object-id.pipe';
import { ParseArrayFile } from '../../../shared/uploadServices/uploadArrayFiles.pipe';
import { CreatePhotosArrayDto } from './dtos/create-photos-array.dto';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { PhotosService } from './photos.service';
import { Photo } from './schemas/photos.schema';

@ApiBearerAuth()
@ApiTags('Photos')
@ApiExtraModels(Photo)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all photos',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Photo),
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
    return this.photosService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.photosService.getAllPaginate(paginate);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(Photo),
        },
      },
    },
    description: '200. Success. Returns a Photo',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Photo was not found',
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
    return this.photosService.getById(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('folder/:id')
  async getPhotosInFolder(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.photosService.getPhotosInFolder(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePhotosArrayDto })
  @UseInterceptors(FilesInterceptor('photos'))
  @Post()
  async add(
    @Body() createPhotosArrayDto: CreatePhotosArrayDto,
    @ConvertToArray('heights') heights: string[],
    @ConvertToArray('widths') widths: string[],
    @UploadedFiles(ParseArrayFile) photos: Express.Multer.File[],
  ) {
    return this.photosService.addPhotosArray(
      createPhotosArrayDto,
      heights,
      widths,
      photos,
    );
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.photosService.softDelete(id);
  }

  @Post('restore/:id')
  @ApiParam({ name: 'id', type: String })
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.photosService.restore(id);
  }

  @Post('like/:id')
  @ApiParam({ name: 'id', type: String })
  async addLike(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.photosService.addLike(id);
  }

  @Post('unlike/:id')
  @ApiParam({ name: 'id', type: String })
  async unLike(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.photosService.unLike(id);
  }
}

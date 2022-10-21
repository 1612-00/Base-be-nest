import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
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
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import ParseObjectIdPipe from '@pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissonDto } from './dto/updatePermisson.dto';
import { PermissionsService } from './permissions.service';
import { Permissions } from './schemas/permissions.schema';

@ApiTags('Permissions')
@ApiBearerAuth()
@ApiExtraModels(Permissions)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  async getAll() {
    return this.permissionsService.getAll();
  }

  @Get('/paginate')
  async getAllPaginate(@Query() paginate: PaginateQuery) {
    return this.permissionsService.getAllPaginate(paginate);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.permissionsService.getById(id);
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updatePermissonDto: UpdatePermissonDto,
  ) {
    return this.permissionsService.update(id, updatePermissonDto);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.permissionsService.delete(id);
  }
}

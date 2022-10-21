import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { DefineRouteService } from './define-route.service';
import { CreateDefineRouteDto } from './dto/create-define-route.dto';
import { UpdateDefineRouteDto } from './dto/update-define-route';
import { DefineRoute } from './schema/define-route.schema';

@ApiTags('Define Route')
@ApiBearerAuth()
@ApiExtraModels(DefineRoute)
@UseInterceptors(WrapResponseInterceptor)
@Controller('define-route')
export class DefineRouteController {
  constructor(private readonly defineRouteService: DefineRouteService) {}

  @ApiOkResponse({
    description: '200. Success. Returns all members',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(DefineRoute),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '401. UnauthorizedException.',
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
  })
  @Get()
  async getAll() {
    return this.defineRouteService.getAll();
  }

  @ApiOkResponse({
    description: '200. Success. Returns all members',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(DefineRoute),
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Define route was not found',
  })
  @ApiUnauthorizedResponse({
    description: '401. UnauthorizedException.',
  })
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.defineRouteService.getById(id);
  }

  @ApiCreatedResponse({
    description: '201. Created record',
  })
  @Post()
  async add(@Body() createDefineRouteDto: CreateDefineRouteDto) {
    return this.defineRouteService.add(createDefineRouteDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateDefineRouteDto: UpdateDefineRouteDto) {
    return this.defineRouteService.update(id, updateDefineRouteDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.defineRouteService.delete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('hard-delete/:id')
  async hardDelete(@Param('id') id: string) {
    return this.defineRouteService.hardDelete(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post('restore/:id')
  async restore(@Param('id') id: string) {
    return this.defineRouteService.restore(id);
  }
}

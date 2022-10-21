import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { MessageClientCode } from 'src/common/messRespon/messageResponse.respon';
import responseS5M from 'src/common/response';
import ConfigsModule from 'src/modules/config/config.module';
import HttpStatusCode from 'src/shared/statusCode.enum';
import { DefineRouteRepository } from './define-route.repository';
import { CreateDefineRouteDto } from './dto/create-define-route.dto';
import { UpdateDefineRouteDto } from './dto/update-define-route';
import { DefineRouteDocument } from './schema/define-route.schema';

@Injectable()
export class DefineRouteService {
  constructor(private readonly defineRouteRepository: DefineRouteRepository) {}

  async getAll() {
    try {
      const dataGot = await this.defineRouteRepository.getAll();
      return responseS5M(
        HttpStatusCode.OK,
        dataGot,
        MessageClientCode.GET_ALL_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string) {
    try {
      const defineRoute: any = await this.defineRouteRepository.getById(id);
      if (!defineRoute) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      }
      return responseS5M(
        HttpStatusCode.OK,
        defineRoute,
        MessageClientCode.GET_ITEM_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async add(createDefineRouteDto: CreateDefineRouteDto) {
    try {
      const { routeConstName, routeURL, routeTitle } = createDefineRouteDto;

      // Find exists route with name
      const routeFound = await this.defineRouteRepository.findByCodition({
        routeConstName,
        isDeleted: false,
      });
      if (routeFound.length > 0) {
        return responseS5M(
          HttpStatusCode.CONFLICT,
          undefined,
          MessageClientCode.ADD_ERROR,
        );
      }

      // Create route
      const data = { routeConstName, routeURL, routeTitle };
      const defineRoute = await this.defineRouteRepository.store(
        <DefineRouteDocument>(<unknown>data),
      );
      return responseS5M(
        HttpStatusCode.CREATED,
        defineRoute,
        MessageClientCode.ADD_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateDefineRouteDto: UpdateDefineRouteDto) {
    try {
      const { routeConstName, routeURL, routeTitle } = updateDefineRouteDto;

      // Find route by id
      const routeFoundById: any = await this.defineRouteRepository.getById(id);
      if (!routeFoundById) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.UPDATE_ERROR,
        );
      }

      // Route's name update already exists in other route
      const routeFoundByConstName =
        await this.defineRouteRepository.findByCodition({
          _id: { $ne: id },
          routeConstName,
          isDeleted: false,
        });

      if (routeFoundByConstName.length > 0) {
        return responseS5M(
          HttpStatusCode.CONFLICT,
          undefined,
          MessageClientCode.UPDATE_ERROR,
        );
      }

      // Update route
      const dataUpdate = {
        routeConstName: routeConstName
          ? routeConstName
          : routeFoundById.routeConstName,
        routeURL: routeURL ? routeURL : routeFoundById.routeURL,
        routeTitle: routeTitle ? routeTitle : routeFoundById.routeTitle,
      };

      const routeUpdated = await this.defineRouteRepository.update(
        id,
        dataUpdate,
      );
      return responseS5M(
        HttpStatusCode.OK,
        routeUpdated,
        MessageClientCode.UPDATE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const routeFound = await this.defineRouteRepository.getById(id);
      if (!routeFound) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      }
      const result = await this.defineRouteRepository.remove(id);
      if (result.deleted == 0)
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      return responseS5M(
        HttpStatusCode.NO_CONTENT,
        undefined,
        MessageClientCode.REMOVE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async hardDelete(id: string) {
    try {
      const routeFound = await this.defineRouteRepository.getById(id);
      if (!routeFound) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      }
      await this.defineRouteRepository.hardDelete(id);

      return responseS5M(
        HttpStatusCode.NO_CONTENT,
        undefined,
        MessageClientCode.REMOVE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async restore(id: string) {
    try {
      const result = await this.defineRouteRepository.restore(id);
      if (result.restored == 0) {
        return responseS5M(
          HttpStatusCode.NOT_FOUND,
          undefined,
          MessageClientCode.NOT_FOUND,
        );
      }
      return responseS5M(
        HttpStatusCode.NO_CONTENT,
        undefined,
        MessageClientCode.RESTORE_SUCCESS,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}

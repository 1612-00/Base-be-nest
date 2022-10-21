import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DefineRouteController } from './define-route.controller';
import { DefineRouteRepository } from './define-route.repository';
import { DefineRouteService } from './define-route.service';
import { DefineRoute, DefineRouteSchema } from './schema/define-route.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DefineRoute.name,
        schema: DefineRouteSchema,
      },
    ]),
  ],
  controllers: [DefineRouteController],
  providers: [DefineRouteService, DefineRouteRepository],
  exports: [DefineRouteService, DefineRouteRepository],
})
export class DefineRouteModule {}

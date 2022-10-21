import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ collection: 'defineRoute', timestamps: true })
export class DefineRoute {
  @Prop({ required: true})
  routeConstName: string = '';
  
  @Prop({ required: true})
  routeURL: string = '';
 
  @Prop({ required: true})
  routeTitle?: string = '';

  @Prop({ required: Boolean})
  isDeleted: boolean = false;
}

export type DefineRouteDocument = DefineRoute & Document;

export const DefineRouteSchema =
  SchemaFactory.createForClass(DefineRoute).plugin(softDeletePlugin);

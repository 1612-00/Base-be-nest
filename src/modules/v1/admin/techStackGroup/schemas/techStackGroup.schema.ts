import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RolesEnum } from '@decorators/roles.decorator';

import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { IsNotEmpty } from 'class-validator';

@Schema({ collection: 'Tech-Stack-Group', timestamps: true })
export class TechStackGroup {
  @Prop({ unique: true })
  name: string = '';

  @Prop({ required: false })
  order: number = 99;
}

export type TechStackGroupDocument = TechStackGroup & Document;

export const TechStackGroupSchema =
  SchemaFactory.createForClass(TechStackGroup).plugin(softDeletePlugin);

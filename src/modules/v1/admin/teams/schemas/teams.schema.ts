import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { StatusType } from '../../../../../enums/statuses.enum';

@Schema({ collection: 'teams', timestamps: true })
export class Team {
  @Prop({})
  name: string = '';

  @Prop({})
  order: number = 100;

  @Prop({})
  status: StatusType = StatusType.PUBLISHED;

  @Prop()
  isDeleted: boolean = false;
}

export type TeamDocument = Team & Document;

export const TeamSchema =
  SchemaFactory.createForClass(Team).plugin(softDeletePlugin);

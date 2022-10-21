import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { StatusType } from '../../../../../enums/statuses.enum';

@Schema({ collection: 'tech_stacks', timestamps: true })
export class TechStack {
  @Prop({ unique: true })
  name: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  photo: Types.ObjectId | undefined;

  @Prop({ type: Number })
  order: number | undefined;

  @Prop({})
  status: StatusType = StatusType.PUBLISHED;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TechStackGroup' })
  group: Types.ObjectId | undefined;

  @Prop()
  isDeleted: boolean = false;
}

export type TechStackDocument = TechStack & Document;

export const TechStackSchema =
  SchemaFactory.createForClass(TechStack).plugin(softDeletePlugin);

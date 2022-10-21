import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { StatusType } from '../../../../../enums/statuses.enum';

@Schema({ collection: 'clients', timestamps: true })
export class Client {
  @Prop({ type: String })
  readonly name: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly photo: Types.ObjectId | undefined;

  @Prop({ type: Number })
  readonly order: number = 100;

  @Prop({ enum: StatusType, default: StatusType.PUBLISHED })
  readonly status: StatusType = StatusType.PUBLISHED;

  @Prop({ type: Boolean })
  readonly isDeleted = false;
}

export type ClientDocument = Client & Document;
export const ClientSchema =
  SchemaFactory.createForClass(Client).plugin(softDeletePlugin);

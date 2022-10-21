import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Orientation } from '../../../../enums/orientation.enum';
import { StatusType } from '../../../../enums/statuses.enum';

@Schema({ collection: 'photos', timestamps: true })
export class Photo {
  @Prop({ type: String })
  readonly link: string = '';

  @Prop({ type: Number, required: false })
  readonly aspectRatio: number | undefined;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' })
  readonly folder: Types.ObjectId | undefined;

  @Prop({})
  readonly status: StatusType = StatusType.PUBLISHED;

  @Prop({ type: Number })
  readonly likes: number = 0;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  readonly comments: Types.ObjectId[] = [];

  @Prop({ type: Boolean })
  readonly isDeleted: boolean = false;
}

export type PhotoDocument = Photo & Document;
export const PhotoSchema =
  SchemaFactory.createForClass(Photo).plugin(softDeletePlugin);

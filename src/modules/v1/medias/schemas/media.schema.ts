import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema()
export class Media {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly photo: Types.ObjectId | undefined;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly video: Types.ObjectId | undefined;
}

export type MediaDocument = Media & Document;
export const MediaSchema =
  SchemaFactory.createForClass(Media).plugin(softDeletePlugin);

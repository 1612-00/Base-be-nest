import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Media, MediaSchema } from '@v1/medias/schemas/media.schema';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema()
export class Box {
  @Prop({ type: MediaSchema })
  readonly photo: Media | undefined;
 
  @Prop({ type: String })
  readonly title: string = '';

  @Prop({ type: String })
  readonly content: string = '';
}

export type BoxDocument = Box & Document;
export const BoxSchema =
  SchemaFactory.createForClass(Box).plugin(softDeletePlugin);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Media, MediaSchema } from '@v1/medias/schemas/media.schema';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema()
export class Content1 {
  @Prop({ type: String })
  readonly whoWeAreTitle: string = '';

  @Prop({ type: String })
  readonly whoWeAreSubtitle: string = '';

  @Prop({ type: String })
  readonly greenBoxTitle: string = '';

  @Prop({ type: String })
  readonly greenBoxSubtitle: string = '';

  @Prop({ type: MediaSchema })
  readonly banner2: Media | undefined;
}

export type Content1Document = Content1 & Document;
export const Content1Schema =
  SchemaFactory.createForClass(Content1).plugin(softDeletePlugin);

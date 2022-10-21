import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ timestamps: true })
export class OurStory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly duPhoto: Types.ObjectId | undefined;

  @Prop({ type: String })
  readonly content: string = '';
}

export type OurStoryDocument = OurStory & Document;
export const OurStorySchema =
  SchemaFactory.createForClass(OurStory).plugin(softDeletePlugin);

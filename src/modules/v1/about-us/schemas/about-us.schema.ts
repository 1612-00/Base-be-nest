import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import {
  OurStory,
  OurStorySchema,
} from '../../our-story/schemas/our-story.schema';

@Schema({ collection: 'about_us', timestamps: true })
export class AboutUs {
  @Prop({ type: OurStorySchema })
  readonly ourStory!: OurStory;

  @Prop({ type: Number })
  readonly noMember: number | undefined;

  @Prop({ type: Boolean })
  readonly isDeleted: boolean = false;
}

export type AboutUsDocument = AboutUs & Document;
export const AboutUsSchema =
  SchemaFactory.createForClass(AboutUs).plugin(softDeletePlugin);

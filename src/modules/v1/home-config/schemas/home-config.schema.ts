import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import {
  BlackBox,
  BlackBoxSchema,
} from '../../black-box/schemas/black-box.schema';
import {
  Content1,
  Content1Schema,
} from '../../content1/schemas/content1.schema';
import { InfoBox, InfoBoxSchema } from '../../info-box/schemas/info-box.schema';
import { Slogan, SloganSchema } from '../../slogan/schemas/slogan.schema';

@Schema({ collection: 'home_config', timestamps: true })
export class HomeConfig {
  @Prop({ type: String })
  readonly url: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly logo: Types.ObjectId | undefined;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly logoMobile: Types.ObjectId | undefined;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly banner: Types.ObjectId | undefined;

  @Prop({ type: SloganSchema })
  readonly slogan: Slogan | undefined;

  @Prop({ type: Content1Schema })
  readonly content1: Content1 | undefined;

  @Prop({ type: InfoBoxSchema })
  readonly infoBox: InfoBox | undefined;

  @Prop({ type: BlackBoxSchema })
  readonly blackBox: BlackBox | undefined;

  @Prop({ type: Number })
  readonly noNews: number = 0;

  @Prop({ type: Boolean })
  readonly isDeleted: boolean = false;
}

export type HomeConfigDocument = HomeConfig & Document;
export const HomeConfigSchema =
  SchemaFactory.createForClass(HomeConfig).plugin(softDeletePlugin);

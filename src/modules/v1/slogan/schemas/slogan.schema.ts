import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema()
export class Slogan {
  @Prop({ type: String })
  readonly slogan: string = '';

  @Prop({ type: String })
  readonly subSlogan: string = '';
}

export type SloganDocument = Slogan & Document;
export const SloganSchema =
  SchemaFactory.createForClass(Slogan).plugin(softDeletePlugin);

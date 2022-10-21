import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema()
export class BlackBox {
  @Prop({ type: String })
  readonly title: string = '';

  @Prop({ type: String })
  readonly content: string = '';

  @Prop({ type: String })
  readonly title2: string = '';

  @Prop({ type: String })
  readonly content2: string = '';
}

export type BlackBoxDocument = BlackBox & Document;
export const BlackBoxSchema =
  SchemaFactory.createForClass(BlackBox).plugin(softDeletePlugin);

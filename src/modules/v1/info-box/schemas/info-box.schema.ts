import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Box, BoxSchema } from '../../box/schemas/box.schema';

@Schema()
export class InfoBox {
  @Prop({ type: BoxSchema })
  readonly box1: Box | undefined;

  @Prop({ type: BoxSchema })
  readonly box2: Box | undefined;
}

export type InfoBoxDocument = InfoBox & Document;
export const InfoBoxSchema =
  SchemaFactory.createForClass(InfoBox).plugin(softDeletePlugin);

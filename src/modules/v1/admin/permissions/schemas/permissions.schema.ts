import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ collection: 'permissions', timestamps: true })
export class Permissions {
  @Prop({ type: String })
  readonly title: string | undefined;

  @Prop({ type: String, unique: true })
  readonly constName: string | undefined;

  @Prop({ type: [String] })
  accessUrl: [string] | undefined;
}

export type PermissionsDocument = Permissions & Document;

export const PermissionsSchema =
  SchemaFactory.createForClass(Permissions).plugin(softDeletePlugin);

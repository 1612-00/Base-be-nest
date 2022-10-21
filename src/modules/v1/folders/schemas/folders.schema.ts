import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ collection: 'folders', timestamps: true })
export class Folder {
  @Prop({ type: String, unique: true })
  name: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' })
  parentId: Types.ObjectId | undefined;

  @Prop({ type: Boolean })
  isDeleted: boolean = false;
}

export type FolderDocument = Folder & Document;

export const FolderSchema =
  SchemaFactory.createForClass(Folder).plugin(softDeletePlugin);

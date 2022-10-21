import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { StatusType } from '../../../../../enums/statuses.enum';

@Schema({ collection: 'projects', timestamps: true })
export class Project {
  @Prop({ type: String })
  readonly name: string | undefined;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  readonly photo: Types.ObjectId | undefined;

  @Prop({ type: String })
  readonly description: string = '';

  @Prop({ type: Number })
  readonly order: number = 100;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }])
  readonly memberList: Types.ObjectId[] = [];

  @Prop({ enum: StatusType })
  readonly status: StatusType = StatusType.PUBLISHED;

  @Prop()
  readonly isDeleted: boolean = false;
}

export type ProjectDocument = Project & Document;

export const ProjectSchema =
  SchemaFactory.createForClass(Project).plugin(softDeletePlugin);

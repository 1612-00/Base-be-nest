import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { StatusType } from '../../../../../enums/statuses.enum';

@Schema({ collection: 'members', timestamps: true })
export class Member {
  @Prop({})
  name: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' })
  photo: Types.ObjectId | undefined;

  @Prop({})
  position: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team' })
  team: Types.ObjectId | undefined;

  @Prop({ type: Number })
  order: number | undefined;

  @Prop({ default: StatusType.PUBLISHED })
  status: StatusType = StatusType.PUBLISHED;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  parentId: string |undefined;

  @Prop()
  isDeleted: boolean = false;


}

export type MemberDocument = Member & Document;

export const MemberSchema =
  SchemaFactory.createForClass(Member).plugin(softDeletePlugin);

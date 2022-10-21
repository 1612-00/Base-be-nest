import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ collection: 'comments', timestamps: true })
export class Comment {
  @Prop({ type: String })
  readonly content: string = '';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  readonly parentId: Types.ObjectId | undefined;

  @Prop({ type: Number })
  readonly level: number = 1;

  @Prop({ type: Boolean })
  readonly isDeleted: boolean = false;
}

export type CommentDocument = Comment & Document;

export const CommentSchema =
  SchemaFactory.createForClass(Comment).plugin(softDeletePlugin);

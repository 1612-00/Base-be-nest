import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Photo } from '@v1/photos/schemas/photos.schema';
import mongoose, { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ collection: 'news', timestamps: true })
export class News {
  @Prop({ required: true})
  title: string = '';

  @Prop({ type: Date })
  publishedDate: Date | undefined;

  @Prop({ type: Boolean })
  status: boolean | undefined;

  @Prop({ type: String })
  content: string | undefined;


  @Prop({ type: Boolean})
  homeDisplay: boolean | undefined;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Photo.name })
  mainImg: Types.ObjectId | undefined;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Photo.name })
  img: Types.ObjectId | undefined;

  @Prop({ type: Array<mongoose.Schema.Types.ObjectId>, ref: Photo.name })
  photoList: Array<Types.ObjectId> | undefined;

}

export type newsDocument = News & Document;

export const newsSchema =
  SchemaFactory.createForClass(News).plugin(softDeletePlugin);

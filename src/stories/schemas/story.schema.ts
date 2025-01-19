import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StoryDocument = HydratedDocument<Story>;

@Schema({ timestamps: true })
export class Story {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  summary: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ default: false })
  is_voice_input: boolean;

  @Prop({ default: false })
  is_public: boolean;

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop({ default: 0 })
  view_count: number;
}

export const StorySchema = SchemaFactory.createForClass(Story);

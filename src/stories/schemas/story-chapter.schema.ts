import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Story } from './story.schema';

export type StoryChapterDocument = HydratedDocument<StoryChapter>;

@Schema({ timestamps: true })
export class StoryChapter {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Story', required: true })
  story_id: Story;

  @Prop({ required: true })
  chapter_number: number;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  is_voice_input: boolean;
}

export const StoryChapterSchema = SchemaFactory.createForClass(StoryChapter);

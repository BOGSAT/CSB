import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Story } from './story.schema';

export type StoryTagDocument = HydratedDocument<StoryTag>;

@Schema({ timestamps: true })
export class StoryTag {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Story', required: true })
  story_id: Story;

  @Prop({ required: true })
  tag_name: string;
}

export const StoryTagSchema = SchemaFactory.createForClass(StoryTag);

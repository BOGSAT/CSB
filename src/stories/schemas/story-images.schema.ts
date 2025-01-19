import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Story } from './story.schema';

export type StoryImageDocument = HydratedDocument<StoryImage>;

@Schema({ timestamps: true })
export class StoryImage {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Story', required: true })
  story_id: Story;

  @Prop({ required: true })
  image_url: string;

  @Prop()
  caption: string;
}

export const StoryImageSchema = SchemaFactory.createForClass(StoryImage);

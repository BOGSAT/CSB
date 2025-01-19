import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Story } from './story.schema';
import { User } from 'src/users/schemas/user.schema';

export type StoryInteractionDocument = HydratedDocument<StoryInteraction>;

@Schema({ timestamps: true })
export class StoryInteraction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userid: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Story', required: true })
  story_id: Story;

  @Prop({ enum: ['like', 'comment', 'rating'], required: true })
  interaction_type: string;

  @Prop()
  comment: string;

  @Prop({ min: 1, max: 5 })
  rating: number;
}

export const StoryInteractionSchema =
  SchemaFactory.createForClass(StoryInteraction);

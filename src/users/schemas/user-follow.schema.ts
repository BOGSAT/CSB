import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type UserFollowDocument = HydratedDocument<UserFollow>;

@Schema({ timestamps: true })
export class UserFollow {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  follower_id: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  following_id: User;
}

export const UserFollowSchema = SchemaFactory.createForClass(UserFollow);

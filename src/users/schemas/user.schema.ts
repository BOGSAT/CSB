import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  userId?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['local', 'google'], default: 'local' })
  provider: string;

  @Prop({ default: false })
  isVerified: Boolean;

  @Prop({ enum: ['free', 'BookSmart', 'BookSmart pro'], default: 'free' })
  subscription: string;

  @Prop()
  profilePicture: string;

  @Prop()
  GoogleId: string;

  @Prop()
  lastLogin: Date;

  @Prop()
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

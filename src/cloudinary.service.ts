import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadApiResponse, v2 } from 'cloudinary';
import { User } from './users/schemas/user.schema';
import { UpdateProfileDto } from './users/dto/update.profile.dto';

@Injectable()
export class CloudinaryService {
  constructor(@InjectModel('User') private userModel: Model<User>) {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(filepath: any): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(filepath, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
  async updateProfile(updateProfileDto: UpdateProfileDto) {
    // Update user profile in your database
    const updatedUser = await this.userModel.findByIdAndUpdate(
      updateProfileDto.userId,
      { profilePicture: updateProfileDto.profilePicture },
      { new: true },
    );
    return updatedUser;
  }
}

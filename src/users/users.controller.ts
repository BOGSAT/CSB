import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    try {
      const user = await this.usersService.findById(userId);
      return {
        userName: user.userName,
        bio: user.bio,
        profilePicture: user.profilePicture,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new NotFoundException('User not found');
    }
  }

  @Put('profile')
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    console.log('Updating profile with:', updateProfileDto);
    try {
      const updatedUser = await this.usersService.update(
        updateProfileDto.userId,
        updateProfileDto,
      );

      return {
        userName: updatedUser.userName,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
      };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  @Post('profile/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    try {
      const result = await this.cloudinaryService.uploadImage(file.path);
      const updateDto = {
        userId,
        profilePicture: result.secure_url,
      };
      return this.usersService.update(userId, updateDto);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

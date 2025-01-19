import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  profilePicture?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(['free', 'BookSmart', 'BookSmart pro'])
  @IsOptional()
  subscription?: string;
}

import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateStoryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsBoolean()
  @IsOptional()
  is_voice_input?: boolean;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @IsOptional()
  userId?: string;
}

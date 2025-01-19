import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsString()
  genre: string;

  @IsBoolean()
  @IsOptional()
  is_voice_input?: boolean;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @IsOptional()
  userId?: string;
}

import { IsEnum, IsString } from 'class-validator';

export enum StoryLength {
  FLASH = 'flash fiction (under 1000 words)',
  SHORT = 'short story (1000-7500 words)',
  NOVELLA = 'novella (7500-20000 words)',
  NOVEL = 'novel (over 40000 words)',
}

export enum StorySetting {
  URBAN = 'urban city',
  RURAL = 'rural countryside',
  SPACE = 'outer space',
  UNDERWATER = 'underwater civilization',
  DESERT = 'desert wasteland',
  FOREST = 'mystical forest',
  MOUNTAINS = 'mountain range',
  FUTURE = 'futuristic metropolis',
  MEDIEVAL = 'medieval kingdom',
  MODERN = 'modern day',
  POST_APOCALYPTIC = 'post-apocalyptic world',
  ALTERNATE_HISTORY = 'alternate history',
}

export class GenerateStoryDto {
  @IsString()
  genre: string;

  @IsString()
  mood: string;

  @IsEnum(StoryLength)
  length: StoryLength;

  @IsEnum(StorySetting)
  setting: StorySetting;
}

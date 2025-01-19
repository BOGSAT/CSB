import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { OpenaiService } from '../openai/openai.service';
import { Story, StorySchema } from './schemas/story.schema';
import {
  StoryChapter,
  StoryChapterSchema,
} from './schemas/story-chapter.schema';
import { StoryTag, StoryTagSchema } from './schemas/story-tag.schema';
import { StoryImage, StoryImageSchema } from './schemas/story-images.schema';
import {
  StoryInteraction,
  StoryInteractionSchema,
} from './schemas/story-interactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: StoryChapter.name, schema: StoryChapterSchema },
      { name: StoryTag.name, schema: StoryTagSchema },
      { name: StoryImage.name, schema: StoryImageSchema },
      { name: StoryInteraction.name, schema: StoryInteractionSchema },
    ]),
  ],
  controllers: [StoriesController],
  providers: [StoriesService, OpenaiService],
  exports: [StoriesService, OpenaiService],
})
export class StoriesModule {}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { OpenaiService } from '../openai/openai.service';

interface DevelopStoryDto {
  idea: string;
  selectedTopic?: 'plot' | 'characters' | 'scenes' | 'chapters';
  isNewScenario?: boolean;
}

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(
    private storiesService: StoriesService,
    private openaiService: OpenaiService,
  ) {}

  // AI Story Generation
  @Post('generate-structured-idea')
  async generateStructuredStoryIdea(
    @Body() body: { genre: string; mood: string; setting?: string },
  ) {
    return this.openaiService.generateStructuredStoryIdea(body);
  }

  @Post('develop-story')
  async developStoryIdea(@Body() body: DevelopStoryDto) {
    return this.openaiService.developStoryIdea(
      body.idea,
      body.selectedTopic,
      body.isNewScenario,
    );
  }

  // CRUD Operations
  @Post()
  createStory(@Request() req, @Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create({
      ...createStoryDto,
      userId: req.user.userId.toString(),
    });
  }
  @Get()
  getAllStories(@Request() req) {
    return this.storiesService.findAllByUser(req.user.userId);
  }

  @Put(':id')
  updateStory(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @Request() req,
  ) {
    return this.storiesService.update(id, updateStoryDto, req.user.userId);
  }

  @Delete(':id')
  deleteStory(@Param('id') id: string, @Request() req) {
    return this.storiesService.remove(id, req.user.userId);
  }

  @Put(':id/publish')
  async publishStory(@Param('id') id: string, @Request() req) {
    return this.storiesService.updateStatus(id, req.user.userId, 'published');
  }

  @Get('published')
  async getPublishedStories(
    @Request() req,
    @Query('genre') genre?: string,
    @Query('authorId') authorId?: string,
    @Query('title') title?: string,
    @Query('userId') userId?: string,
  ) {
    if (!genre && !authorId && !title && !userId) {
      return this.storiesService.findPublishedByUser(req.user.userId);
    }
    return this.storiesService.findPublishedStories({
      genre,
      authorId,
      title,
      userId: userId || req.user.userId,
    });
  }

  @Get('drafts')
  getMyDrafts(@Request() req) {
    return this.storiesService.findDraftsByUser(req.user.userId);
  }

  @Get(':id')
  getStoryById(@Param('id') id: string, @Request() req) {
    return this.storiesService.findOne(id, req.user.userId);
  }
}

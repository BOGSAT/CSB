import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story, StoryDocument } from './schemas/story.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
  ) {}

  // CREATE
  async create(createStoryDto: CreateStoryDto) {
    try {
      console.log('Service received data:', createStoryDto);
      const createdStory = new this.storyModel(createStoryDto);
      console.log('Created story model:', createdStory);

      const savedStory = await createdStory.save();
      console.log('Saved story:', savedStory);
      return savedStory;
    } catch (error) {
      console.error('Error in create service:', error);
      throw error;
    }
  }

  // READ
  async findAllByUser(userId: string) {
    return this.storyModel.find({ userId });
  }

  async findDraftsByUser(userId: string) {
    return this.storyModel.find({
      userId,
      status: 'draft',
    });
  }

  async findPublishedByUser(userId: string) {
    return this.storyModel.find({
      userId,
      status: 'published',
    });
  }

  async findOne(id: string, userId: string) {
    const story = await this.storyModel.findById(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId.toString() !== userId) {
      throw new ForbiddenException('You can only access your own stories');
    }

    return story;
  }

  // UPDATE
  async update(id: string, updateStoryDto: UpdateStoryDto, userId: string) {
    const story = await this.storyModel.findById(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own stories');
    }

    return this.storyModel.findByIdAndUpdate(id, updateStoryDto, { new: true });
  }

  async updateStatus(
    id: string,
    userId: string,
    status: 'draft' | 'published' | 'archived',
  ) {
    const story = await this.storyModel.findById(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own stories');
    }

    story.status = status;
    return story.save();
  }

  async findPublishedStories(filters?: {
    genre?: string;
    authorId?: string;
    title?: string;
    userId?: string;
  }) {
    const query = { status: 'published', ...filters };
    return this.storyModel.find(query);
  }

  // DELETE
  async remove(id: string, userId: string) {
    const story = await this.storyModel.findById(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own stories');
    }

    await this.storyModel.findByIdAndDelete(id);
    return { message: 'Story deleted successfully' };
  }
}

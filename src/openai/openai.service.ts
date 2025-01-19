import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateStructuredStoryIdea(params: {
    genre: string;
    mood: string;
    length?: string;
    setting?: string;
  }) {
    try {
      const prompt = `Generate a ${params.mood} story idea for a ${params.genre} story.
        ${params.setting ? `The story should be set in ${params.setting}.` : ''}
        ${params.length ? `Make it a ${params.length} story.` : ''}`;

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 150,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async developStoryIdea(
    idea: string,
    selectedTopic?: string,
    isNewScenario?: boolean,
  ) {
    try {
      let prompt;

      if (selectedTopic) {
        // Different prompts for different topics
        const topicPrompts = {
          plot: `Based on this story: "${idea}", let's develop the plot further. Please provide:
            - Major plot points
            - Potential conflicts
            - Plot twists
            - Resolution possibilities`,

          characters: `Based on this story: "${idea}", let's develop the characters. Please provide:
            - Main character details
            - Supporting character descriptions
            - Character relationships
            - Character arcs`,

          scenes: `Based on this story: "${idea}", let's develop key scenes. Please provide:
            - Opening scene
            - Major conflict scenes
            - Emotional moments
            - Climactic scenes`,

          chapters: `Based on this story: "${idea}", let's develop a chapter outline. Please provide:
            - Chapter breakdown
            - Key events per chapter
            - Chapter flow
            - Pacing suggestions`,
        };

        prompt = topicPrompts[selectedTopic] || idea;
      } else if (isNewScenario) {
        prompt = `Based on this story: "${idea}", generate 4 alternative scenarios or directions this story could take.`;
      } else {
        prompt = `I have this story idea: "${idea}". 
          Can you help develop this by suggesting:
          1. Potential plot developments
          2. Character arcs
          3. Key scenes
          4. Possible chapter breakdowns`;
      }

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }
}

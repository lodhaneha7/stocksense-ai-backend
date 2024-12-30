import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAI } from 'openai';
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from 'openai/resources/index';

@Injectable()
export class AzureOpenAiService {
  private readonly client: AzureOpenAI;
  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('AZURE_OPENAI_ENDPOINT');
    const apiKey = this.configService.get<string>('AZURE_OPENAI_API_KEY');
    const deployment = this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT_ID') || 'gpt-4o';
    const apiVersion = this.configService.get<string>('OPENAI_API_VERSION') || '24-02-01';

    this.client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment,
    });
  }

  /**
   * Returns the content of the first choice.
   */
  public async generateChatCompletion(
    params: ChatCompletionCreateParamsNonStreaming,
  ): Promise<string> {
    try {
      const result: ChatCompletion = await this.client.chat.completions.create(params);
      return result.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      console.error('Error calling AzureOpenAI chat completion:', error);
      return 'Answer generation is temporarily unavailable. Please try again later.';
    }
  }
  
}
    
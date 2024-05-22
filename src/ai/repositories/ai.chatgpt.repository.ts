import { ConfigService } from '@nestjs/config';
import { OpenAI } from './../../../node_modules/openai/src/index';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiChatGPTRepository {
  OpenAI: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.OpenAI = new OpenAI({
      apiKey: this.configService.get<string>('CHAT_GPT_API_KEY'),
    });
  }

  async generateCompletion(prompt: string, isOrder?: boolean) {
    try {
      const content = isOrder
        ? `fill array of this object :{Symbol: '',Market: '',Position: '',Leverage: '',EntryTargets: [],TakeProfitTargets: [],StopLoss: ''}; with extracted values from this prompt:${prompt};follow this rules for response:1-do not use object keys as find parameter;2-if market is FUTURES return Buy as value else return Sell as value;3-remove all strings from leverage an just return number as string for leverage;4-remove # from symbol;5-add copixStart[i] before start object 1 and for other objects i++ and for end of each object do like start with this text copixEnd[i] and for value between this copixis is json`
        : prompt;

      const completion = await this.OpenAI.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful trading assistant.' },
          {
            role: 'user',
            content: "What is currency name in this message: 'Symbol: #BTC' ",
          },
          {
            role: 'assistant',
            content: 'This is bitcoin.',
          },
          {
            role: 'user',
            content,
          },
        ],
        model: 'GPT-4o',
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating completion:', error);
      return null;
    }
  }
}

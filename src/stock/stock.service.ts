import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AzureOpenAiService } from '../azure/azure-openai.service';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { BSECompany } from './schemas/bse-company.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class StockService {
  constructor(
    private readonly azureOpenAiService: AzureOpenAiService,
    @InjectModel('bsecompany') private bseCompany: Model<BSECompany>,
  ) {}

  async searchCompany(keyword: string): Promise<BSECompany[]> {
    try {
      const regex = new RegExp(keyword, 'i');
      return await this.bseCompany
        .find({
          $or: [
            { issuerName: { $regex: regex } },
            { securityName: { $regex: regex } },
            { securityId: { $regex: regex } },
          ],
        })
        .select({
          issuerName: 1,
          securityId: 1,
          _id: 1,
        })
        .limit(10)
        .exec();
    } catch (error) {
      console.error('Error searching for companies:', error);
      throw new HttpException(
        'Failed to search for companies. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  


  async analyzeStock(data:{latestNewsUrls: string,companyName:string}): Promise<{aiInsight: string}> {
    try {

      const prompt = `Analyze the stock data for "${data.companyName}".
            1.Identify risks (e.g., high debt, external challenges) and opportunities (e.g., strong growth or profitability). Provide new and valuable insights for investors.
            2.Rate sentiment as bearish, neutral, or bullish based on the stock's overall performance, market conditions, and long-term potential.
            3.Provide a recommendation: "Buy," "Hold," or "Sell," with reasoning to guide investor decisions.
            4.Summarize recent news and its impact on the stock's future prospects.
            5.Deliver 4-5 actionable insights that provide new value for investors beyond basic data.
            give with highlighting response in bold in 5 lines,  
            News:${data.latestNewsUrls}`

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'You are a stock market analyzer. Be thorough but concise.',
        },
        {
          role: 'user',
          content: prompt.replace(/\n/g, '')
        },
      ];
      const params = {
        messages,
        model: '',
      };
      const response = await this.azureOpenAiService.generateChatCompletion(params);
      return {
        aiInsight : response
      };
    } catch (error) {
      console.error('Error analyzing stock data:', error);
      throw new HttpException(
        'Failed to analyze stock data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
}
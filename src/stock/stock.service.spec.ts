import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BSECompany } from './schemas/bse-company.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AzureOpenAiService } from '../azure/azure-openai.service';

describe('StockService', () => {
  let stockService: StockService;
  let azureOpenAiService: jest.Mocked<AzureOpenAiService>;
  let bseCompanyModel: jest.Mocked<Model<BSECompany>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: AzureOpenAiService,
          useValue: {
            generateChatCompletion: jest.fn(),
          },
        },
        {
          provide: getModelToken('bsecompany'),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    stockService = module.get<StockService>(StockService);
    azureOpenAiService = module.get<AzureOpenAiService>(
      AzureOpenAiService,
    ) as jest.Mocked<AzureOpenAiService>;
    bseCompanyModel = module.get<Model<BSECompany>>(
      getModelToken('bsecompany'),
    ) as jest.Mocked<Model<BSECompany>>;
  });

  describe('searchCompany', () => {
    it('should return a list of companies based on the keyword', async () => {
      const keyword = 'Reliance';
      const mockCompanies = [
        { _id: '1', issuerName: 'Reliance Industries', securityId: 'RELIANCE' },
        { _id: '2', issuerName: 'Reliance Power', securityId: 'RPOWER' },
      ];
      bseCompanyModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCompanies),
          }),
        }),
      } as any);

      const result = await stockService.searchCompany(keyword);
      expect(result).toEqual(mockCompanies);
      expect(bseCompanyModel.find).toHaveBeenCalledWith({
        $or: [
          { issuerName: { $regex: new RegExp(keyword, 'i') } },
          { securityName: { $regex: new RegExp(keyword, 'i') } },
          { securityId: { $regex: new RegExp(keyword, 'i') } },
        ],
      });
    });

    it('should throw an HttpException when an error occurs', async () => {
      const keyword = 'Reliance';
      bseCompanyModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error')),
          }),
        }),
      } as any);

      await expect(stockService.searchCompany(keyword)).rejects.toThrowError(
        new HttpException(
          'Failed to search for companies. Please try again later.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('analyzeStock', () => {
    it('should return AI insight for the given company', async () => {
      const payload = {
        latestNewsUrls: 'https://news.example.com',
        companyName: 'Reliance Industries',
      };
      const mockAiInsight = 'This is an AI-generated analysis of Reliance Industries.';
      azureOpenAiService.generateChatCompletion.mockResolvedValue(mockAiInsight);

      const result = await stockService.analyzeStock(payload);

      expect(result).toEqual({ aiInsight: mockAiInsight });
      expect(azureOpenAiService.generateChatCompletion).toHaveBeenCalledWith({
        messages: [
          {
            role: 'system',
            content: 'You are a stock market analyzer. Be thorough but concise.',
          },
          {
            role: 'user',
            content: expect.any(String), 
          },
        ],
        model: '',
      });
    });

    it('should throw an HttpException when AI service fails', async () => {
      const payload = {
        latestNewsUrls: 'https://news.example.com',
        companyName: 'Reliance Industries',
      };
      azureOpenAiService.generateChatCompletion.mockRejectedValue(
        new Error('Azure OpenAI error'),
      );

      await expect(stockService.analyzeStock(payload)).rejects.toThrowError(
        new HttpException(
          'Failed to analyze stock data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});

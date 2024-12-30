import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAiService } from './azure-openai.service';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';

// Mock AzureOpenAI class and its methods
const mockCreateMethod = jest.fn();
const mockAzureOpenAI = {
  chat: {
    completions: {
      create: mockCreateMethod,
    },
  },
};

jest.mock('openai', () => ({
  AzureOpenAI: jest.fn().mockImplementation(() => mockAzureOpenAI),
}));

describe('AzureOpenAiService', () => {
  let service: AzureOpenAiService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureOpenAiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'AZURE_OPENAI_ENDPOINT':
                  return 'https://mock-endpoint.azure.com';
                case 'AZURE_OPENAI_API_KEY':
                  return 'mock-api-key';
                case 'AZURE_OPENAI_DEPLOYMENT_ID':
                  return 'mock-deployment-id';
                case 'OPENAI_API_VERSION':
                  return '2024-02-01';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AzureOpenAiService>(AzureOpenAiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate chat completion', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Hello, this is a mock response!',
          },
        },
      ],
    };

    // Mock the `create` method to return a successful response
    mockCreateMethod.mockResolvedValueOnce(mockResponse);

    const params:ChatCompletionCreateParamsNonStreaming = {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: 'Hello!',
        },
      ],
    };

    const result = await service.generateChatCompletion(params);

    expect(result).toBe('Hello, this is a mock response!');
    expect(mockCreateMethod).toHaveBeenCalledTimes(1);
    expect(mockCreateMethod).toHaveBeenCalledWith(params);
  });

  it('should return a friendly message if AzureOpenAI fails', async () => {
    const mockError = new Error('Mock AzureOpenAI error');
    mockCreateMethod.mockRejectedValueOnce(mockError);
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const params: ChatCompletionCreateParamsNonStreaming = {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: 'Hello!',
        },
      ],
    };
  
    const response = await service.generateChatCompletion(params);
    expect(response).toBe('Answer generation is temporarily unavailable. Please try again later.');
  
    expect(mockCreateMethod).toHaveBeenCalledTimes(1);
  
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error calling AzureOpenAI chat completion:',
      mockError,
    );
  
    consoleErrorSpy.mockRestore();
  });
  
});

import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

describe('StockController', () => {
  let stockController: StockController;
  let stockService: StockService;

  const mockStockService = {
    analyzeStock: jest.fn(),
    searchCompany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      imports:[],
      providers: [
        {
          provide: StockService,
          useValue: mockStockService,
        },
      ],
    }).compile();

    stockController = module.get<StockController>(StockController);
    stockService = module.get<StockService>(StockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeStock', () => {
    it('should return AI insights when payload is valid', async () => {
      const payload = {
        companyName: 'Test Company',
        latestNewsUrls: 'https://example.com/news1, https://example.com/news2',
      };

      const aiInsightResponse = { aiInsight: 'Stock is bullish based on recent news.' };

      mockStockService.analyzeStock.mockResolvedValue(aiInsightResponse);

      const result = await stockController.analyzeStock(payload);

      expect(result).toEqual(aiInsightResponse);
      expect(mockStockService.analyzeStock).toHaveBeenCalledTimes(1);
      expect(mockStockService.analyzeStock).toHaveBeenCalledWith(payload);
    });

    it('should throw an error when the service throws an error', async () => {
      const payload = {
        companyName: 'Test Company',
        latestNewsUrls: 'https://example.com/news1, https://example.com/news2',
      };

      mockStockService.analyzeStock.mockRejectedValue(new Error('Service error'));

      await expect(stockController.analyzeStock(payload)).rejects.toThrow('Service error');
      expect(mockStockService.analyzeStock).toHaveBeenCalledTimes(1);
      expect(mockStockService.analyzeStock).toHaveBeenCalledWith(payload);
    });
  });

  describe('searchCompany', () => {
    it('should return company results when a keyword is provided ', async () => {
      const keyword = 'Test';
      const searchResults = [
        { id: 1, name: 'Test Company A' },
        { id: 2, name: 'Test Company B' },
      ];

      mockStockService.searchCompany.mockResolvedValue(searchResults);

      const result = await stockController.searchCompany(keyword);

      expect(result).toEqual(searchResults);
      expect(mockStockService.searchCompany).toHaveBeenCalledTimes(1);
      expect(mockStockService.searchCompany).toHaveBeenCalledWith(keyword);
    });

    it('should return an empty array and message if no keyword is provided', async () => {
      const keyword = '';

      const result = await stockController.searchCompany(keyword);

      expect(result).toEqual({
        message: 'Keyword is required',
        data: [],
      });
      expect(mockStockService.searchCompany).not.toHaveBeenCalled();
    });

    it('should throw an error when the service throws an error', async () => {
      const keyword = 'Test';

      mockStockService.searchCompany.mockRejectedValue(new Error('Service error'));

      await expect(stockController.searchCompany(keyword)).rejects.toThrow('Service error');
      expect(mockStockService.searchCompany).toHaveBeenCalledTimes(1);
      expect(mockStockService.searchCompany).toHaveBeenCalledWith(keyword);
    });
  });
});

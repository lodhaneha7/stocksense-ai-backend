import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BSECompany } from '../schemas/bse-company.schema';
import { JsonImportService } from './json-import.service';

jest.mock('fs/promises');

describe('JsonImportService', () => {
  let service: JsonImportService;
  let bseCompanyModel: Model<BSECompany>;

  const mockBseCompanyModel = {
    countDocuments: jest.fn(),
    insertMany: jest.fn(),
  };

  beforeAll(() => {
    jest.spyOn(path, 'resolve').mockImplementation((...args: string[]) => args.join('/'));
    jest.spyOn(console, 'log').mockImplementation(() => {}); 
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JsonImportService,
        {
          provide: getModelToken('bsecompany'),
          useValue: mockBseCompanyModel,
        },
      ],
    }).compile();

    service = module.get<JsonImportService>(JsonImportService);
    bseCompanyModel = module.get<Model<BSECompany>>(getModelToken('bsecompany'));
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAndImportJson', () => {
    it('should skip importing if the collection is not empty', async () => {
      mockBseCompanyModel.countDocuments.mockResolvedValueOnce(10); // Simulate existing documents

      const filePath = '/path/to/bsecompany.json';
      await service.checkAndImportJson(filePath);

      expect(mockBseCompanyModel.countDocuments).toHaveBeenCalled();
      expect(mockBseCompanyModel.insertMany).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Collection already has data. Skipping JSON import.');
    });

    it('should import JSON data if the collection is empty', async () => {
      const mockJsonData = JSON.stringify([{ issuerName: 'Company A' }, { issuerName: 'Company B' }]);
      mockBseCompanyModel.countDocuments.mockResolvedValueOnce(0); // Simulate empty collection
      jest.spyOn(fs, 'readFile').mockResolvedValue(mockJsonData); // Mock JSON file reading

      const filePath = '/path/to/bsecompany.json';
      await service.checkAndImportJson(filePath);

      expect(mockBseCompanyModel.countDocuments).toHaveBeenCalled();
      expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
      expect(mockBseCompanyModel.insertMany).toHaveBeenCalledWith(JSON.parse(mockJsonData));
      expect(console.log).toHaveBeenCalledWith('JSON data successfully imported!');
    });

    it('should handle errors during JSON import', async () => {
      mockBseCompanyModel.countDocuments.mockResolvedValueOnce(0); // Simulate empty collection
      jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('File read error')); // Mock file reading failure

      const filePath = '/path/to/bsecompany.json';

      await expect(service.checkAndImportJson(filePath)).rejects.toThrow('File read error');
      expect(mockBseCompanyModel.countDocuments).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error importing JSON data:', expect.any(Error));
    });
  });
});
